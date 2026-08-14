export class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.getByTestId("login-username");
    this.password = page.getByTestId("login-password");
    this.submit = page.getByTestId("login-submit");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(user) {
    await this.username.fill(user.username);
    await this.password.fill(user.password);
    await this.submit.click();
  }
}
