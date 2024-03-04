class ShoppingCartPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.allAddedProductslist = page.locator(
      "table#shopping-cart-table tr.item-info"
    );
    this.updateShoppingCartBtn = page.locator(
      "div.cart.main.actions button[name=update_cart_action]>span"
    );
    this.orderTotal = page.locator("div.cart-summary td.amount>strong>span");
    this.firstProductRemovebtn = page
      .locator("tr.item-actions a[title='Remove item']")
      .first();
    this.noItemsInCartText = page.locator("div.cart-empty>p").first();
  }

  /**
   * This method iterates through each product in the shopping cart, updates the quantity of each product
   *  (incremented by 2 in this example), and then clicks the update shopping cart button to apply the changes.
   *  Finally, it waits for the page to finish loading after the update.
   * Updates the quantities of all products in the shopping cart.
   */
  async updateQuantitiesOfAllProducts() {
    // Loop through each product in the shopping cart
    for (let i = 0; i < (await this.allAddedProductslist.count()); i++) {
      // Find the input field for the quantity of the current product
      const inputField = this.allAddedProductslist.nth(i).locator("input");

      // Click on the input field to focus
      await inputField.click();

      // Clear the existing quantity value
      await inputField.clear();

      // Fill the input field with the updated quantity (incremented by 2 for demonstration)
      await inputField.fill(String(i + 2));
    }

    // Click on the update shopping cart button to apply the changes
    await this.updateShoppingCartBtn.click();

    // Wait for the page to finish loading after updating the shopping cart
    await this.page.waitForTimeout(2000);
  }

  /**
   * This method retrieves the grand total amount from the order total element on the page
   *  and returns it without the dollar sign.
   * Retrieves the grand total from the order total element.
   * @returns {string} The grand total amount without the dollar sign.
   */
  async getGrandTotal() {
    // Get the total amount from the order total element
    const total = await this.orderTotal.textContent();

    // Remove the dollar sign from the total amount and return it
    return total.replace("$", "");
  }

  /**
   * Removes all products from the cart.
   */
  async removeAllProductsFromCart() {
    let count = await this.allAddedProductslist.count(); // Get the initial count of products in the cart

    // Loop until there are no more products in the cart
    while (count !== null && count !== 0) {
      // Click on the remove button of the first product
      await this.firstProductRemovebtn.click();

      // Update count after removing a product
      count = await this.allAddedProductslist.count();
    }
  }

  /**
   * Retrieves the text indicating an empty cart after deletion.
   * @returns {Promise<string>} The text indicating an empty cart after deletion.
   */
  async getEmptyCartTextAfterDeletion() {
    return this.noItemsInCartText.textContent();
  }

  async updateCartForReOrder() {
    await this.page.waitForTimeout(2000);

    await this.updateShoppingCartBtn.waitFor()
     // Click on the update shopping cart button to apply the changes    
     // Wait for the page to finish loading after updating the shopping cart
    await this.updateShoppingCartBtn.click();

//  await this.page.pause()
  }
}

export { ShoppingCartPage };
