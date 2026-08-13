export class CarDetailsPage {
  constructor(page) {
    this.page = page;
  }

  addToCartButton(carId) {
    return this.page.getByTestId(`car-details-add-to-cart-${carId}`);
  }

  model(carId) {
    return this.page.getByTestId(`car-details-model-${carId}`);
  }

  async addToCart(carId) {
    await this.addToCartButton(carId).click();
  }
}
