import { expect, test } from "@playwright/test";

test("failure demo captures diagnostics for the Allure report", async ({ page }, testInfo) => {
  test.skip(
    process.env.RUN_FAILURE_DEMO !== "true",
    "Enable RUN_FAILURE_DEMO to exercise failure-report artifacts."
  );

  const browserLogs = [];
  page.on("console", (message) => {
    const line = `[browser:${message.type()}] ${message.text()}`;
    browserLogs.push(line);
    console.log(line);
  });

  console.log("[failure-demo] Opening the application before the intentional failure.");
  await page.goto("/");

  try {
    console.log("[failure-demo] Running an assertion that is expected to fail.");
    await expect(
      page.getByRole("heading", { name: "This heading intentionally does not exist" }),
      "Intentional failure used to verify Allure diagnostics"
    ).toBeVisible({ timeout: 3_000 });
  } finally {
    await testInfo.attach("failure-demo.log", {
      body: Buffer.from([
        "This failure is intentional.",
        `Page URL: ${page.url()}`,
        `Browser console entries: ${browserLogs.length}`,
        ...browserLogs
      ].join("\n")),
      contentType: "text/plain"
    });
  }
});
