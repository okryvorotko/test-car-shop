export class CarsPage {
  constructor(page) {
    this.page = page;
    this.modelFilter = page.getByTestId("model-filter-input");
    this.sortBy = page.getByTestId("sort-by-select");
    this.sortDirection = page.getByTestId("sort-direction-select");
    this.resultsGrid = page.getByTestId("cars-results-grid");
    this.cartLink = page.getByTestId("cart-link");
  }

  async openCar(carId) {
    await this.page.getByTestId(`car-card-link-${carId}`).click();
  }

  async filterByModel(model) {
    await this.modelFilter.fill(model);
  }

  carCard(carId) {
    return this.page.getByTestId(`car-card-${carId}`);
  }

  carModel(carId) {
    return this.page.getByTestId(`car-model-${carId}`);
  }
}
