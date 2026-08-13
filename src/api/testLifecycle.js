import { strict as assert } from "node:assert";
import { api } from "./carShopClient.js";

export async function cleanupDemoData() {
  const response = await api.reset();
  assert.equal(response.status, 200, JSON.stringify(response.data));
  return response.data;
}

export async function ensureApiIsReady() {
  const response = await api.ping();
  assert.equal(response.status, 200, "Expected backend /ping to be reachable");
  assert.deepEqual(response.data, { message: "pong" });
}
