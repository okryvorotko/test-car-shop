import { strict as assert } from "node:assert";
import { api } from "../../src/api/carShopClient.js";
import { cleanupDemoData, ensureApiIsReady } from "../../src/api/testLifecycle.js";
import { uniqueUser } from "../../src/fixtures/users.js";

describe("Auth API", function () {
  before(async function () {
    await ensureApiIsReady();
  });

  afterEach(async function () {
    await cleanupDemoData();
  });

  it("registers a user and returns the current account", async function () {
    const user = uniqueUser();
    const token = await api.register(user);

    const me = await api.me(token);

    assert.equal(me.status, 200);
    assert.equal(me.data.username, user.username);
    assert.equal(Number.isInteger(me.data.id), true);
  });

  it("logs in an existing user", async function () {
    const user = uniqueUser();
    await api.register(user);

    const token = await api.login(user);
    const me = await api.me(token);

    assert.equal(me.status, 200);
    assert.equal(me.data.username, user.username);
  });

  it("rejects protected resources without a bearer token", async function () {
    const response = await api.cars();

    assert.equal(response.status, 401);
    assert.equal(response.data.error, "No token");
  });
});
