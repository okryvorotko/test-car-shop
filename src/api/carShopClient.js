import { strict as assert } from "node:assert";
import { config } from "../utils/config.js";
import { HttpClient } from "./httpClient.js";

export class CarShopClient {
  constructor(baseUrl = config.apiBaseUrl) {
    this.http = new HttpClient({ baseUrl });
  }

  ping() {
    return this.http.get("/ping");
  }

  reset() {
    return this.http.post("/admin/reset");
  }

  async register(user) {
    const response = await this.http.post("/auth/register", { body: user });
    assert.equal(response.status, 200, JSON.stringify(response.data));
    return response.data.token;
  }

  async login(user) {
    const response = await this.http.post("/auth/login", { body: user });
    assert.equal(response.status, 200, JSON.stringify(response.data));
    return response.data.token;
  }

  me(token) {
    return this.http.get("/me", { token });
  }

  cars(token, query) {
    return this.http.get("/cars", { token, query });
  }

  car(token, id) {
    return this.http.get(`/cars/${id}`, { token });
  }

  cart(token) {
    return this.http.get("/cart", { token });
  }

  cartCount(token) {
    return this.http.get("/cart/count", { token });
  }

  addToCart(token, carId) {
    return this.http.post(`/cart/add/${carId}`, { token });
  }

  order(token) {
    return this.http.post("/order", { token });
  }
}

export const api = new CarShopClient();
