import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";

const files = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  { encoding: "utf8" },
)
  .split("\0")
  .filter(Boolean);
const existingFiles = files.filter((file) => existsSync(file));

const violations = [];
const forbiddenPaths = [
  /(^|\/)\.env(?:\.|$)/,
  /(^|\/)\.DS_Store$/,
  /(^|\/)references\/raw\//,
  /(^|\/)work\//,
  /\.(?:pem|key|p12|mobileprovision)$/i,
];
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{40,}\b/,
  /\bYUANBAO_COOKIE\s*=\s*(?!your_|example|placeholder)[^\s]+/i,
  /\/Users\/[A-Za-z0-9._-]+\/project\//,
];

for (const file of existingFiles) {
  if (forbiddenPaths.some((pattern) => pattern.test(file))) {
    violations.push(`${file}: forbidden local or secret-bearing path`);
    continue;
  }

  const info = statSync(file);
  if (info.size > 20 * 1024 * 1024) {
    violations.push(`${file}: exceeds the 20 MiB per-file repository budget`);
  }

  if (file.endsWith(".glb") && !file.startsWith("public/models/")) {
    violations.push(`${file}: 3D models are allowed only under public/models/`);
  }

  if (info.size > 2 * 1024 * 1024 || /\.(?:png|jpe?g|webp|gif|glb|woff2?)$/i.test(file)) continue;
  const content = readFileSync(file, "utf8");
  for (const pattern of secretPatterns) {
    if (pattern.test(content)) violations.push(`${file}: matches protected secret or local-path pattern`);
  }
}

if (!existingFiles.includes("THIRD_PARTY_ASSETS.md")) {
  violations.push("THIRD_PARTY_ASSETS.md: required when redistributing 3D models");
}

if (violations.length) {
  console.error("Repository boundary check failed:\n" + violations.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Repository boundary check passed for ${existingFiles.length} files.`);
