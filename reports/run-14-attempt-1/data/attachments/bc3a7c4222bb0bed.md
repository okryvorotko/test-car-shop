# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: car-shop.spec.js >> new user can register, browse cars, add to cart, and buy
- Location: tests/ui/car-shop.spec.js:10:1

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/cars$/
Received string:  "http://3.88.104.16:3000/register"
Timeout: 7500ms

Call log:
  - Expect "toHaveURL" with timeout 7500ms
    19 × unexpected value "http://3.88.104.16:3000/register"

```

```yaml
- main:
  - img "Car Shop Demo"
  - heading "Register" [level=2]
  - textbox "Username": ui-user-a8a2be45-d9f1-48c4-b99f-fd6582e06e2a
  - textbox "Password": Password123!
  - button "Register"
  - paragraph
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | import { api } from "../../src/api/carShopClient.js";
  3  | import { carCatalog } from "../../src/data/cars.js";
  4  | import { uniqueUser } from "../../src/fixtures/users.js";
  5  | import { CarDetailsPage } from "../../src/ui/CarDetailsPage.js";
  6  | import { CarsPage } from "../../src/ui/CarsPage.js";
  7  | import { CartPage } from "../../src/ui/CartPage.js";
  8  | import { RegisterPage } from "../../src/ui/RegisterPage.js";
  9  | 
  10 | test("new user can register, browse cars, add to cart, and buy", async ({ page }) => {
  11 |   const user = uniqueUser("ui-user");
  12 |   const car = carCatalog.teslaModel3;
  13 |   const registerPage = new RegisterPage(page);
  14 |   const carsPage = new CarsPage(page);
  15 |   const detailsPage = new CarDetailsPage(page);
  16 |   const cartPage = new CartPage(page);
  17 | 
  18 |   await registerPage.goto();
  19 |   await registerPage.register(user);
  20 | 
> 21 |   await expect(page).toHaveURL(/\/cars$/);
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  22 |   await expect(page.getByTestId("cars-page")).toBeVisible();
  23 |   await expect(carsPage.carModel(car.id)).toContainText(`${car.year} ${car.model}`);
  24 | 
  25 |   await carsPage.openCar(car.id);
  26 |   await expect(detailsPage.model(car.id)).toContainText(car.model);
  27 | 
  28 |   await detailsPage.addToCart(car.id);
  29 |   await expect(page).toHaveURL(/\/cart$/);
  30 |   await expect(cartPage.cartItem(car.id)).toBeVisible();
  31 |   await expect(cartPage.summaryTotal).toContainText("$38,990");
  32 | 
  33 |   await cartPage.buy();
  34 |   await expect(page).toHaveURL(/\/order$/);
  35 |   await expect(page.getByTestId("order-status")).toContainText("Order placed");
  36 |   await expect(page.getByTestId("order-details")).toContainText("$38,990");
  37 | });
  38 | 
  39 | test("catalog filters cars by model", async ({ page }) => {
  40 |   const token = await api.register(uniqueUser("ui-seed"));
  41 |   await page.addInitScript((authToken) => {
  42 |     window.localStorage.setItem("token", authToken);
  43 |   }, token);
  44 | 
  45 |   const carsPage = new CarsPage(page);
  46 | 
  47 |   await page.goto("/cars");
  48 |   await expect(page.getByTestId("cars-page")).toBeVisible();
  49 | 
  50 |   await carsPage.filterByModel("Lucid");
  51 | 
  52 |   await expect(carsPage.carCard(carCatalog.lucidAir.id)).toBeVisible();
  53 |   await expect(carsPage.resultsGrid).toContainText("Lucid Air");
  54 |   await expect(carsPage.resultsGrid).not.toContainText("Tesla Model 3");
  55 | });
  56 | 
```