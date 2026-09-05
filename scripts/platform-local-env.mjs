import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, chmodSync } from "node:fs";
// Credentials stay in an ignored local file and are never printed.
const raw = execFileSync(
  "npx",
  ["--yes", "supabase", "status", "--output", "json"],
  { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
);
const status = JSON.parse(raw);
const api = status.API_URL || status.api_url;
const anon = status.ANON_KEY || status.anon_key;
const service = status.SERVICE_ROLE_KEY || status.service_role_key;
if (!api || !anon || !service)
  throw new Error("Local Supabase did not return the required configuration.");
if (!["127.0.0.1", "localhost"].includes(new URL(api).hostname))
  throw new Error("This helper only configures local Supabase.");
const values = {
  VITE_SUPABASE_URL: api,
  VITE_SUPABASE_ANON_KEY: anon,
  VITE_PLATFORM_API_URL: "",
  VITE_ADMIN_HOST: "admin.localhost",
  SUPABASE_URL: api,
  SUPABASE_SERVICE_ROLE_KEY: service,
  PUBLIC_APP_URL: "http://127.0.0.1:5173",
  ADMIN_APP_URL: "http://admin.localhost:5173",
  PLATFORM_API_URL: "http://127.0.0.1:3001",
  PLATFORM_PORT: "3001",
  SANDBOX_AMOUNT_CENTS: "100",
  EMAIL_PROVIDER: "mailpit",
  MAILPIT_URL: "http://127.0.0.1:54324",
  EMAIL_FROM: "Visa Seva <status@visa-seva.test>",
  VITE_SHOWCASE_BACKEND: "disabled",
};
let lines = existsSync(".env") ? readFileSync(".env", "utf8").split("\n") : [];
for (const [key, value] of Object.entries(values)) {
  const index = lines.findIndex((line) => line.startsWith(`${key}=`));
  if (index < 0) lines.push(`${key}=${value}`);
  else lines[index] = `${key}=${value}`;
}
writeFileSync(".env", lines.join("\n") + "\n", { mode: 0o600 });
chmodSync(".env", 0o600);
console.log(
  "Configured local Supabase, API, admin hostname, and mail inbox. Credentials are stored only in .env.",
);
