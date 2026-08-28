use prometheus::{
    Encoder, HistogramOpts, HistogramVec, IntCounter, IntCounterVec, IntGauge, Opts, Registry,
    TextEncoder,
};

#[derive(Clone)]
pub struct Metrics {
    registry: Registry,
    pub requests: IntCounterVec,
    pub request_duration: HistogramVec,
    pub in_flight: IntGauge,
    pub overload_rejections: IntCounter,
    pub rate_limit_rejections: IntCounter,
    pub submissions: IntCounter,
    pub outbox_processed: IntCounter,
}

impl Metrics {
    pub fn new() -> Result<Self, prometheus::Error> {
        let registry = Registry::new();
        let requests = IntCounterVec::new(
            Opts::new("http_requests_total", "HTTP requests"),
            &["method", "status"],
        )?;
        let request_duration = HistogramVec::new(
            HistogramOpts::new("http_request_duration_seconds", "HTTP request duration").buckets(
                vec![
                    0.001, 0.0025, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 3.0,
                ],
            ),
            &["method"],
        )?;
        let in_flight = IntGauge::new(
            "http_requests_in_flight",
            "Currently executing HTTP requests",
        )?;
        let overload_rejections = IntCounter::new(
            "overload_rejections_total",
            "Requests rejected by concurrency protection",
        )?;
        let rate_limit_rejections = IntCounter::new(
            "rate_limit_rejections_total",
            "Requests rejected by rate limiting",
        )?;
        let submissions = IntCounter::new(
            "application_submissions_total",
            "Successfully committed synthetic submissions",
        )?;
        let outbox_processed = IntCounter::new(
            "outbox_events_processed_total",
            "Synthetic outbox events acknowledged by the bounded worker",
        )?;

        registry.register(Box::new(requests.clone()))?;
        registry.register(Box::new(request_duration.clone()))?;
        registry.register(Box::new(in_flight.clone()))?;
        registry.register(Box::new(overload_rejections.clone()))?;
        registry.register(Box::new(rate_limit_rejections.clone()))?;
        registry.register(Box::new(submissions.clone()))?;
        registry.register(Box::new(outbox_processed.clone()))?;

        Ok(Self {
            registry,
            requests,
            request_duration,
            in_flight,
            overload_rejections,
            rate_limit_rejections,
            submissions,
            outbox_processed,
        })
    }

    pub fn render(&self) -> Result<String, prometheus::Error> {
        let families = self.registry.gather();
        let mut buffer = Vec::new();
        TextEncoder::new().encode(&families, &mut buffer)?;
        Ok(String::from_utf8_lossy(&buffer).into_owned())
    }
}
