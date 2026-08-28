use std::time::Duration;

use tokio::{
    sync::broadcast,
    time::{MissedTickBehavior, interval},
};
use tracing::{info, warn};

use crate::state::AppState;

pub async fn run(state: AppState, mut shutdown: broadcast::Receiver<()>) {
    let mut outbox_tick = interval(Duration::from_secs(1));
    outbox_tick.set_missed_tick_behavior(MissedTickBehavior::Skip);
    let mut cleanup_tick = interval(Duration::from_secs(60));
    cleanup_tick.set_missed_tick_behavior(MissedTickBehavior::Skip);

    loop {
        tokio::select! {
            _ = outbox_tick.tick() => {
                match process_outbox_batch(&state).await {
                    Ok(processed) if processed > 0 => {
                        state.metrics.outbox_processed.inc_by(processed);
                        info!(processed, "acknowledged synthetic outbox batch");
                    }
                    Ok(_) => {}
                    Err(error) => warn!(%error, "outbox batch failed; it will be retried"),
                }
            }
            _ = cleanup_tick.tick() => {
                state.prune_memory();
                if let Err(error) = cleanup_expired_records(&state).await {
                    warn!(%error, "expired-record cleanup failed; it will be retried");
                }
            }
            _ = shutdown.recv() => break,
        }
    }
}

async fn process_outbox_batch(state: &AppState) -> Result<u64, sqlx::Error> {
    let result = sqlx::query(
        "WITH batch AS (\
             SELECT id FROM outbox_events \
             WHERE processed_at IS NULL \
             ORDER BY created_at \
             LIMIT 500 \
             FOR UPDATE SKIP LOCKED\
         ) \
         UPDATE outbox_events AS events \
         SET processed_at = now(), attempts = attempts + 1 \
         FROM batch WHERE events.id = batch.id",
    )
    .execute(&state.pool)
    .await?;
    Ok(result.rows_affected())
}

async fn cleanup_expired_records(state: &AppState) -> Result<(), sqlx::Error> {
    let mut transaction = state.pool.begin().await?;
    sqlx::query(
        "DELETE FROM idempotency_records WHERE (session_id, route, idempotency_key) IN (\
             SELECT session_id, route, idempotency_key FROM idempotency_records \
             WHERE expires_at < now() ORDER BY expires_at LIMIT 10000\
         )",
    )
    .execute(&mut *transaction)
    .await?;
    sqlx::query(
        "DELETE FROM demo_sessions WHERE id IN (\
             SELECT id FROM demo_sessions \
             WHERE expires_at < now() - interval '24 hours' \
             ORDER BY expires_at LIMIT 10000\
         )",
    )
    .execute(&mut *transaction)
    .await?;
    transaction.commit().await?;
    Ok(())
}
