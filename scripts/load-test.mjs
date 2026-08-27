import http from 'node:http';
import https from 'node:https';
import { execFileSync } from 'node:child_process';
import { monitorEventLoopDelay } from 'node:perf_hooks';

function parseArguments(argv) {
  const values = new Map();
  for (let index = 0; index < argv.length; index += 2) {
    const name = argv[index];
    const value = argv[index + 1];
    if (!name?.startsWith('--') || value === undefined) {
      throw new Error('Arguments must be supplied as --name value pairs.');
    }
    values.set(name.slice(2), value);
  }

  const number = (name, fallback) => {
    const value = Number(values.get(name) ?? fallback);
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(`--${name} must be a positive number.`);
    }
    return value;
  };

  return {
    url: new URL(values.get('url') ?? 'http://127.0.0.1:8080/'),
    rate: number('rate', 500),
    durationSeconds: number('duration', 20),
    timeoutMs: number('timeout', 5000),
    maxInFlight: number('max-in-flight', 512),
    serverPid: values.has('server-pid') ? number('server-pid') : null,
    label: values.get('label') ?? 'local-load-test',
  };
}

function percentile(sorted, fraction) {
  if (sorted.length === 0) return 0;
  return sorted[Math.min(sorted.length - 1, Math.ceil(fraction * sorted.length) - 1)];
}

function processSample(pid) {
  if (!pid) return null;
  try {
    const output = execFileSync('/bin/ps', ['-p', String(pid), '-o', '%cpu=,rss='], {
      encoding: 'utf8',
      timeout: 1000,
    }).trim();
    if (!output) return null;
    const [cpuPercent, rssKiB] = output.split(/\s+/).map(Number);
    return { cpuPercent, rssMiB: rssKiB / 1024 };
  } catch {
    return null;
  }
}

const options = parseArguments(process.argv.slice(2));
const requestModule = options.url.protocol === 'https:' ? https : http;
const requestCount = Math.floor(options.rate * options.durationSeconds);
const agent = new requestModule.Agent({
  keepAlive: true,
  maxSockets: options.maxInFlight,
  maxFreeSockets: Math.min(options.maxInFlight, 2048),
  scheduling: 'lifo',
});
const eventLoopDelay = monitorEventLoopDelay({ resolution: 10 });
const latencies = [];
const statuses = new Map();
const activeRequests = new Set();
const serverSamples = [];
let issued = 0;
let completed = 0;
let droppedByGenerator = 0;
let bytes = 0;
let inFlight = 0;
let maxObservedInFlight = 0;
let maximumSchedulerDeficit = 0;

function requestOnce() {
  const started = process.hrtime.bigint();
  return new Promise((resolve) => {
    const request = requestModule.request(options.url, {
      agent,
      method: 'GET',
      headers: {
        Accept: 'text/html',
        'User-Agent': 'visa-local-arrival-rate-test/1.0',
      },
    }, (response) => {
      let responseBytes = 0;
      response.on('data', (chunk) => { responseBytes += chunk.length; });
      response.on('end', () => {
        const latencyMs = Number(process.hrtime.bigint() - started) / 1e6;
        latencies.push(latencyMs);
        bytes += responseBytes;
        const status = String(response.statusCode);
        statuses.set(status, (statuses.get(status) ?? 0) + 1);
        resolve();
      });
    });

    request.setTimeout(options.timeoutMs, () => request.destroy(new Error('timeout')));
    request.on('error', (error) => {
      const latencyMs = Number(process.hrtime.bigint() - started) / 1e6;
      latencies.push(latencyMs);
      const status = `ERR:${error.code ?? error.message}`;
      statuses.set(status, (statuses.get(status) ?? 0) + 1);
      resolve();
    });
    request.end();
  });
}

function launchRequest() {
  issued += 1;
  inFlight += 1;
  maxObservedInFlight = Math.max(maxObservedInFlight, inFlight);
  const operation = requestOnce().finally(() => {
    completed += 1;
    inFlight -= 1;
    activeRequests.delete(operation);
  });
  activeRequests.add(operation);
}

eventLoopDelay.enable();
const wallStarted = process.hrtime.bigint();
const samplingTimer = setInterval(() => {
  const sample = processSample(options.serverPid);
  if (sample) serverSamples.push(sample);
}, 500);

await new Promise((resolve, reject) => {
  const scheduleStarted = process.hrtime.bigint();
  const schedulingTimer = setInterval(() => {
    const elapsedSeconds = Number(process.hrtime.bigint() - scheduleStarted) / 1e9;
    const expected = Math.min(requestCount, Math.floor(elapsedSeconds * options.rate));
    const arrivalsDue = expected - issued - droppedByGenerator;
    maximumSchedulerDeficit = Math.max(maximumSchedulerDeficit, arrivalsDue);

    for (let count = 0; count < arrivalsDue; count += 1) {
      if (inFlight < options.maxInFlight) launchRequest();
      else droppedByGenerator += 1;
    }

    if (issued + droppedByGenerator >= requestCount) {
      clearInterval(schedulingTimer);
      resolve();
    }
  }, 2);
});

await Promise.all(activeRequests);
clearInterval(samplingTimer);
eventLoopDelay.disable();
agent.destroy();

const wallSeconds = Number(process.hrtime.bigint() - wallStarted) / 1e9;
const sorted = latencies.sort((left, right) => left - right);
const successes = Array.from(statuses.entries())
  .filter(([status]) => /^2\d\d$/.test(status))
  .reduce((sum, [, count]) => sum + count, 0);
const cpuValues = serverSamples.map((sample) => sample.cpuPercent);
const memoryValues = serverSamples.map((sample) => sample.rssMiB);

console.log(JSON.stringify({
  label: options.label,
  target: options.url.href,
  configured: {
    rateRps: options.rate,
    durationSeconds: options.durationSeconds,
    requests: requestCount,
    timeoutMs: options.timeoutMs,
  },
  observed: {
    issued,
    droppedByGenerator,
    completed,
    successes,
    failures: completed - successes,
    successPercent: completed > 0 ? Number((successes / completed * 100).toFixed(4)) : 0,
    wallSeconds: Number(wallSeconds.toFixed(3)),
    completionRps: Number((completed / wallSeconds).toFixed(1)),
    responseMiB: Number((bytes / 1024 / 1024).toFixed(2)),
    maxInFlight: maxObservedInFlight,
    maximumSchedulerDeficit,
  },
  latencyMs: {
    p50: Number(percentile(sorted, 0.50).toFixed(2)),
    p95: Number(percentile(sorted, 0.95).toFixed(2)),
    p99: Number(percentile(sorted, 0.99).toFixed(2)),
    max: Number((sorted.at(-1) ?? 0).toFixed(2)),
  },
  generatorEventLoopDelayMs: {
    mean: Number((eventLoopDelay.mean / 1e6).toFixed(2)),
    p95: Number((eventLoopDelay.percentile(95) / 1e6).toFixed(2)),
    max: Number((eventLoopDelay.max / 1e6).toFixed(2)),
  },
  serverProcess: serverSamples.length ? {
    samples: serverSamples.length,
    averageCpuPercent: Number((cpuValues.reduce((sum, value) => sum + value, 0) / cpuValues.length).toFixed(1)),
    maximumCpuPercent: Number(Math.max(...cpuValues).toFixed(1)),
    averageRssMiB: Number((memoryValues.reduce((sum, value) => sum + value, 0) / memoryValues.length).toFixed(2)),
    maximumRssMiB: Number(Math.max(...memoryValues).toFixed(2)),
  } : null,
  statuses: Object.fromEntries(statuses),
}, null, 2));
