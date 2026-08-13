export class CartPage {
  constructor(page) {
    this.page = page;
    this.buyButton = page.getByTestId("cart-buy-button");
    this.summaryTotal = page.getByTestId("cart-summary-total");
  }

  cartItem(carId) {
    return this.page.getByTestId(`cart-item-${carId}`);
  }

  async buy() {
    await this.buyButton.click();
  }
}
