class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.customerHeading = page.getByRole("heading", {
      name: "Customer Login",
    });
    this.emailFeild = page.locator(".control>#email").first();
    this.passwordFeild = page.locator(".control>#pass").first();
    this.signInBtn = page.locator("button#send2").first();
  }

  /**
   * Gets the text content of the customer login heading.
   * @returns {Promise<string>} The text content of the customer login heading.
   */
  async getCustomerLoginHeading() {
    return this.customerHeading.textContent();
  }

  /**
   * Performs a valid login with the provided email and password.
   * @param {string} email - The email address of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<void>}
   */
  async validLogin(email, password) {
    // Fill the email field with the provided email
    await this.emailFeild.fill(email);

    // Fill the password field with the provided password
    await this.passwordFeild.fill(password);

    // Click on the sign-in button
    await this.signInBtn.click();

    // Wait for the greeting message to appear after successful login
    await this.page.locator("li.greet.welcome>span").first().waitFor();
  }
}
export { LoginPage };
