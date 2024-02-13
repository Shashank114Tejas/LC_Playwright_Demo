class ProductListingPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.allProductslistInsinglePage = page.locator("ol.products li");
    this.shoppingCartIcon = page.locator("a.action.showcart");
    this.shoppingCartCountLabel = page.locator(
      "a.action.showcart span.counter-number"
    );
    this.proceedToCheckoutBtn = page.locator("button#top-cart-btn-checkout");
    this.dynamicProductAddedMsg = page.locator("#custommessage:visible");
    this.paginationNextBtn = page.locator("ul.items a.action.next");
  }
  /**
   * Retrieves the dynamic product added message.
   * @returns {Promise<string>} The text content of the dynamic product added message.
   */
  async getDynamicProductAddedMsg() {
    return await this.dynamicProductAddedMsg.textContent();
  }

  /**
   * Proceeds to the checkout page from the shopping cart.
   */
  async proceedToCheckout() {
    // Wait for 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Click on the shopping cart icon
    await this.shoppingCartIcon.click();

    // Click on the proceed to checkout button
    await this.proceedToCheckoutBtn.click();

    // Wait for the page to load completely
    await this.page.waitForLoadState("domcontentloaded");
  }
}
export { ProductListingPage };
