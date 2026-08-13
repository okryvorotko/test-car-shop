export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.username = page.getByTestId("r_username");
    this.password = page.getByTestId("r_password");
    this.submit = page.getByTestId("r_register");
    this.message = page.getByTestId("r_msg");
  }

  async goto() {
    await this.page.goto("/register");
  }

  async register(user) {
    await this.username.fill(user.username);
    await this.password.fill(user.password);
    await this.submit.click();
  }
}
