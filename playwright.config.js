import { defineConfig, devices } from "@playwright/test";
import { config } from "./src/utils/config.js";

export default defineConfig({
  testDir: "./tests/ui",
  timeout: 30_000,
  expect: {
    timeout: 7_500
  },
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["allure-playwright", { resultsDir: "allure-results" }]
  ],
  use: {
    baseURL: config.uiBaseUrl,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
