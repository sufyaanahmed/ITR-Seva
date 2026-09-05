import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
const target = process.argv[2] || "/private/tmp/visa-seva-admin-deploy";
const values = Object.fromEntries(
  readFileSync(".env.hosted.local", "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split(/=(.*)/s).slice(0, 2))
    .filter(([key]) => key.startsWith("VITE_")),
);
const linkPath = `${target}/.vercel/project.json`;
const link = existsSync(linkPath) ? readFileSync(linkPath) : null;
execFileSync(
  "npm",
  ["run", "build", "--", "--outDir", target, "--emptyOutDir"],
  {
    env: { ...process.env, ...values, VITE_APP_ROLE: "admin" },
    stdio: "inherit",
  },
);
writeFileSync(
  `${target}/vercel.json`,
  JSON.stringify(
    {
      framework: null,
      rewrites: [{ source: "/(.*)", destination: "/index.html" }],
    },
    null,
    2,
  ),
);

if (link) {
  mkdirSync(`${target}/.vercel`, { recursive: true });
  writeFileSync(linkPath, link);
}
