import { expect, test } from "@playwright/test";
import { api } from "../../src/api/carShopClient.js";
import { carCatalog } from "../../src/data/cars.js";
import { uniqueUser } from "../../src/fixtures/users.js";
import { CarDetailsPage } from "../../src/ui/CarDetailsPage.js";
import { CarsPage } from "../../src/ui/CarsPage.js";
import { CartPage } from "../../src/ui/CartPage.js";
import { RegisterPage } from "../../src/ui/RegisterPage.js";

test("new user can register, browse cars, add to cart, and buy", async ({ page }) => {
  const user = uniqueUser("ui-user");
  const car = carCatalog.teslaModel3;
  const registerPage = new RegisterPage(page);
  const carsPage = new CarsPage(page);
  const detailsPage = new CarDetailsPage(page);
  const cartPage = new CartPage(page);

  await registerPage.goto();
  await registerPage.register(user);

  await expect(page).toHaveURL(/\/cars$/);
  await expect(page.getByTestId("cars-page")).toBeVisible();
  await expect(carsPage.carModel(car.id)).toContainText(`${car.year} ${car.model}`);

  await carsPage.openCar(car.id);
  await expect(detailsPage.model(car.id)).toContainText(car.model);

  await detailsPage.addToCart(car.id);
  await expect(page).toHaveURL(/\/cart$/);
  await expect(cartPage.cartItem(car.id)).toBeVisible();
  await expect(cartPage.summaryTotal).toContainText("$38,990");

  await cartPage.buy();
  await expect(page).toHaveURL(/\/order$/);
  await expect(page.getByTestId("order-status")).toContainText("Order placed");
  await expect(page.getByTestId("order-details")).toContainText("$38,990");
});

test("catalog filters cars by model", async ({ page }) => {
  const token = await api.register(uniqueUser("ui-seed"));
  await page.addInitScript((authToken) => {
    window.localStorage.setItem("token", authToken);
  }, token);

  const carsPage = new CarsPage(page);

  await page.goto("/cars");
  await expect(page.getByTestId("cars-page")).toBeVisible();

  await carsPage.filterByModel("Lucid");

  await expect(carsPage.carCard(carCatalog.lucidAir.id)).toBeVisible();
  await expect(carsPage.resultsGrid).toContainText("Lucid Air");
  await expect(carsPage.resultsGrid).not.toContainText("Tesla Model 3");
});
