import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
const { SUPABASE_PROJECT_REF, PLATFORM_API_URL, CRON_SECRET, EMAIL_FROM } =
  process.env;
if (
  SUPABASE_PROJECT_REF !== "ollqqjxxbhldmfcuvzvb" ||
  !CRON_SECRET ||
  new URL(PLATFORM_API_URL).origin !== "https://visa-seva-platform.vercel.app"
)
  throw Error(
    "This setup is restricted to the dedicated Visa Seva deployment.",
  );
const quote = (value) => `'${value.replaceAll("'", "''")}'`;
const active = Boolean(EMAIL_FROM && !EMAIL_FROM.includes("@resend.dev"));
const sql = `create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
do $setup$ declare existing uuid; begin
 select id into existing from vault.secrets where name='visa_seva_email_cron';
 if existing is null then perform vault.create_secret(${quote(CRON_SECRET)},'visa_seva_email_cron');
 else perform vault.update_secret(existing,${quote(CRON_SECRET)},'visa_seva_email_cron'); end if;
end $setup$;
select cron.schedule('visa-seva-email-outbox','* * * * *',$job$
 select net.http_post(
  url:='https://visa-seva-platform.vercel.app/api/email-cron',
  headers:=jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||(select decrypted_secret from vault.decrypted_secrets where name='visa_seva_email_cron')),
  body:='{}'::jsonb, timeout_milliseconds:=55000
 ) where exists(select 1 from public.email_notifications where status in ('queued','sent') and next_attempt_at<=now());
$job$);
update cron.job set active=${active} where jobname='visa-seva-email-outbox';
select jobname,schedule,active from cron.job where jobname='visa-seva-email-outbox';`;
const dir = mkdtempSync(join(tmpdir(), "visa-seva-cron-"));
const file = join(dir, "schedule.sql");
try {
  writeFileSync(file, sql, { mode: 0o600 });
  const result = execFileSync(
    "npx",
    ["--yes", "supabase", "db", "query", "--linked", "--file", file],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  console.log(result.toString().replaceAll(CRON_SECRET, "[redacted]"));
  console.log(
    active
      ? "Hosted email retries scheduled."
      : "Hosted email retry job installed but paused until a verified sender is configured.",
  );
} catch (error) {
  console.error(
    error.stderr?.toString().replaceAll(CRON_SECRET, "[redacted]") ||
      "Email schedule setup failed.",
  );
  process.exitCode = 1;
} finally {
  rmSync(dir, { recursive: true, force: true });
}
