import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadDotEnv() {
  const envPath = resolve(process.cwd(), ".env");

  if (!existsSync(envPath)) {
    return;
  }

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function withoutTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

loadDotEnv();

export const config = {
  apiBaseUrl: withoutTrailingSlash(
    process.env.API_BASE_URL
  ),
  uiBaseUrl: withoutTrailingSlash(
    process.env.UI_BASE_URL
  ),
  testPassword: process.env.TEST_PASSWORD
};
