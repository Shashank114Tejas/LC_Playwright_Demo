class DashboardPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
  
    constructor(page) {
      this.page = page;
      this.cardTitles = page.locator("div.card-body>h5");
      this.products = page.locator("div.card-body");
      this.cartIcon = page.locator("button[routerlink*='cart']");
      this.successMsg = page.locator("div[aria-label*='Added To Cart']");
    }
}
export{ DashboardPag};