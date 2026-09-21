import { defineConfig, devices } from "@playwright/test";
import { config } from "./src/utils/config.js";

export default defineConfig({
  testDir: "./tests/ui",
  timeout: 30_000,
  expect: {
    timeout: 7_500
  },
  fullyParallel: true,
  workers: 2,
  globalSetup: "./src/ui/globalSetup.js",
  globalTeardown: "./src/ui/globalTeardown.js",
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
