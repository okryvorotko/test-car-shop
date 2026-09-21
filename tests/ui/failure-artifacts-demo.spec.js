import { expect, test } from "@playwright/test";
import { api } from "../../src/api/carShopClient.js";
import { carCatalog } from "../../src/data/cars.js";
import { uniqueUser } from "../../src/fixtures/users.js";
import { CarDetailsPage } from "../../src/ui/CarDetailsPage.js";
import { CarsPage } from "../../src/ui/CarsPage.js";
import { CartPage } from "../../src/ui/CartPage.js";
import { LoginPage } from "../../src/ui/LoginPage.js";

test.skip(
  process.env.RUN_FAILURE_DEMO !== "true",
  "Enable RUN_FAILURE_DEMO to exercise failure-report artifacts."
);

test("failure demo captures diagnostics for the Allure report", async ({ page }, testInfo) => {
  const browserLogs = [];
  page.on("console", (message) => {
    const line = `[browser:${message.type()}] ${message.text()}`;
    browserLogs.push(line);
    console.log(line);
  });

  const user = uniqueUser("failure-demo");
  const car = carCatalog.lucidAir;
  const loginPage = new LoginPage(page);
  const carsPage = new CarsPage(page);
  const detailsPage = new CarDetailsPage(page);
  const cartPage = new CartPage(page);

  console.log("[failure-demo] Creating a user, then logging in through the UI.");
  await api.register(user);
  await loginPage.goto();
  await loginPage.login(user);
  await expect(page).toHaveURL(/\/cars$/);
  await expect(page.getByTestId("cars-page")).toBeVisible();

  console.log(`[failure-demo] Filtering the catalog for ${car.model}.`);
  await carsPage.filterByModel("Lucid");
  await expect(carsPage.carCard(car.id)).toBeVisible();
  await expect(carsPage.resultsGrid).toContainText(car.model);
  await expect(carsPage.resultsGrid).not.toContainText("Tesla Model 3");

  console.log(`[failure-demo] Opening ${car.model} and adding it to the cart.`);
  await carsPage.openCar(car.id);
  await expect(detailsPage.model(car.id)).toContainText(car.model);
  await detailsPage.addToCart(car.id);

  console.log("[failure-demo] Verifying the cart before the intentional failure.");
  await expect(page).toHaveURL(/\/cart$/);
  await expect(cartPage.cartItem(car.id)).toBeVisible();
  await expect(cartPage.summaryTotal).toContainText("$69,900");

  try {
    console.log("[failure-demo] The shopping flow is complete; running the expected failure now.");
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
