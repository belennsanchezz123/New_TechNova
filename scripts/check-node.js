#!/usr/bin/env node

const requiredMajor = 22;
const currentVersion = process.versions.node;
const currentMajor = Number.parseInt(currentVersion.split(".")[0], 10);

if (!Number.isInteger(currentMajor)) {
  console.error(`[ERROR] Could not parse Node.js version: ${currentVersion}`);
  process.exit(1);
}

if (currentMajor < requiredMajor) {
  console.error("[ERROR] Incompatible Node.js version.");
  console.error(`[ERROR] Detected: v${currentVersion}`);
  console.error(`[ERROR] Required: >= v${requiredMajor}.0.0`);
  console.error("[INFO] Run: nvm use (or nvm install && nvm use)");
  process.exit(1);
}
