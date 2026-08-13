import { strict as assert } from "node:assert";
import { api } from "../../src/api/carShopClient.js";
import { cleanupDemoData, ensureApiIsReady } from "../../src/api/testLifecycle.js";
import { carCatalog } from "../../src/data/cars.js";
import { uniqueUser } from "../../src/fixtures/users.js";

describe("Cars, cart, and order APIs", function () {
  let token;

  before(async function () {
    await ensureApiIsReady();
  });

  beforeEach(async function () {
    await cleanupDemoData();
    token = await api.register(uniqueUser());
  });

  afterEach(async function () {
    await cleanupDemoData();
  });

  it("lists reusable seeded cars sorted by price by default", async function () {
    const response = await api.cars(token);

    assert.equal(response.status, 200);
    assert.equal(response.data.length, 26);
    assert.equal(response.data[0].model, carCatalog.chevroletBoltEv.model);
    assert.equal(response.data[0].available, 1);
  });

  it("filters cars by model and range", async function () {
    const response = await api.cars(token, {
      model: "Tesla",
      minRange: 350,
      sortBy: "range",
      sortDirection: "desc"
    });

    assert.equal(response.status, 200);
    assert.ok(response.data.length > 0);
    assert.ok(response.data.every((car) => car.model.includes("Tesla")));
    assert.ok(response.data.every((car) => car.rangeMiles >= 350));
    assert.equal(response.data[0].model, carCatalog.teslaModelS.model);
  });

  it("adds a car to the cart and keeps duplicate adds idempotent", async function () {
    const carId = carCatalog.teslaModel3.id;

    const firstAdd = await api.addToCart(token, carId);
    const secondAdd = await api.addToCart(token, carId);
    const cart = await api.cart(token);
    const count = await api.cartCount(token);

    assert.deepEqual(firstAdd.data, { ok: true, count: 1 });
    assert.deepEqual(secondAdd.data, { ok: true, count: 1 });
    assert.equal(cart.data.length, 1);
    assert.equal(cart.data[0].id, carId);
    assert.deepEqual(count.data, { count: 1 });
  });

  it("creates an order from the cart and removes the purchased car from inventory", async function () {
    const carId = carCatalog.nissanLeaf.id;
    await api.addToCart(token, carId);

    const order = await api.order(token);
    const cart = await api.cart(token);
    const purchasedCar = await api.car(token, carId);
    const availableCars = await api.cars(token);

    assert.equal(order.status, 200);
    assert.equal(order.data.itemCount, 1);
    assert.equal(order.data.total, carCatalog.nissanLeaf.price);
    assert.deepEqual(cart.data, []);
    assert.equal(purchasedCar.data.available, 0);
    assert.equal(availableCars.data.some((car) => car.id === carId), false);
  });

  it("rejects checkout when the cart is empty", async function () {
    const response = await api.order(token);

    assert.equal(response.status, 400);
    assert.equal(response.data.error, "Cart is empty");
  });
});
