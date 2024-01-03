class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
  
    constructor(page) {
      this.page = page;
      this.customerHeading = page.getByRole('heading', { name: 'Customer Login' });
      this.emailFeild = page.locator(".control>#email").first();
      this.passwordFeild = page.locator(".control>#pass").first();
      this.signInBtn = page.locator("button#send2").first();
    }

    async getCustomerLoginHeading(){
    return this.customerHeading.textContent();
    }

    async validLogin(email, password) {
      await this.emailFeild.fill(email);
      await this.passwordFeild.fill(password);
      await this.signInBtn.click();
      await this.page.locator("li.greet.welcome>span").first().waitFor()
    }
}
export{ LoginPage};