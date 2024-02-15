import { log } from "console";

class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.signInLink = page.locator(
      "div.panel.header .header.links li.link.authorization-link a"
    );
    this.menuItemsLocator = '[role="menuitem"][name="${name}"]';
    this.allhrefs = page.locator("nav.navigation ul#ui-id-1>li"); //13
    this.searchBarSKU = page.locator("div.field.search input#search");
    this.searchBarSKUseachIcon = page
      .locator("div.actions button[type=submit]")
      .first();
    this.allProductsList = page.locator("ol.products li");
    this.logo = page.locator("a[title=LiquorCart]>img");
    this.dynamicProductAddedMsg = page.locator("#custommessage:visible");
    this.allProductslistInsinglePage = page.locator("ol.products li");
    this.paginationNextBtn = page.locator("ul.items a.action.next");
    this.headerAccountLink = page.locator(
      "header.page-header ul.header.links li.link.my-account-link>a"
    );
    this.merchantNameAddressHeader = page.locator("div.merchant-nameAddress");
    this.merchantphoneHoursDeliveryHeader = page.locator(
      "div.merchant-phoneHoursDeliveryOptions"
    );
    this.merchantphnHoursAddressHeader = page.getByRole("banner");
    this.shoppingCartIcon = page.locator("a.action.showcart:visible");
    this.shoppingCartCountLabel = page.locator(
      "a.action.showcart span.counter-number"
    );
    this.proceedToCheckoutBtn = page.locator("button#top-cart-btn-checkout");
    this.accountLink = page.locator(
      "header.page-header li.link.my-account-link a"
    );
    this.signOutLink = page.locator(
      "div.panel.header li.link.authorization-link a"
    );
    this.myAccountPageHeader = page.locator("div.page-title-wrapper h1>span");
    this.hiGuestText = page.locator("div.panel.header span.not-logged-in");
    this.empytCartPopuptext = page.locator(
      "div.panel.header div.block-content strong"
    );
    this.closeEmptyCartPopup = page.locator(
      "div.panel.header div.block-content button#btn-minicart-close"
    );
    this.emptyCartMsg = page.locator("strong.subtitle.empty");
    this.shoppingCartViewAndEditLink = page.locator(
      "div#minicart-content-wrapper a.action.viewcart>span"
    );
    this.shoppingCartPopupClose = page.locator("button#btn-minicart-close");
    this.removeIconMinicart = page.locator(
      "div.minicart-wrapper.active div.product-item-details div.secondary>a.action.delete"
    );
    this.minicartItemsList = page.locator(
      "div.minicart-wrapper.active div.product-item-details"
    );
  }

  /**
   * Clicks on the sign-in link.
   */
  async clickOnSignInLink() {
    await this.signInLink.click(); // Clicking on the sign-in link
  }

  /**
   * Retrieves the text displayed when the cart is empty.
   * @returns {Promise<string>} - The text displayed when the cart is empty.
   */
  async getEmptyCartText() {
    return new Promise((resolve) => {
      setTimeout(async () => {
        // Simulating a click on the shopping cart icon
        await this.shoppingCartIcon.click();
        // Extracting the text of the empty cart message
        const text = await this.emptyCartMsg.textContent();
        // Closing the shopping cart popup
        await this.shoppingCartPopupClose.click();
        resolve(text); // Resolving the promise with the empty cart message text
      }, 1000); // Waiting for 1 second before executing to ensure the UI updates
    });
  }

  /**
   * Validates if the "Hi, Guest" text is present.
   * @returns {Promise<string>} - The text content of the "Hi, Guest" element.
   */
  async validateHiGuestTextPresent() {
    return await this.hiGuestText.textContent();
  }

  /**
   * Retrieves the merchant name and address.
   * @returns {Promise<string[]>} - An array containing the merchant name and address.
   */
  async getMerchantNameAndAddress() {
    return this.merchantNameAddressHeader.allInnerTexts();
  }

  /**
   * Retrieves the locator for the merchant's phone, hours, and delivery address.
   * @returns {Locator} - The locator for the merchant's phone, hours, and delivery address.
   */
  async getMerchantphoneHoursDeliveryLocator() {
    return this.merchantphnHoursAddressHeader;
  }

  /**
   * Checks if the logo is visible.
   * @returns {Promise<boolean>} - A boolean indicating if the logo is visible.
   */
  async isLogoVisible() {
    return this.logo.isVisible();
  }

  /**
   * Checks if the shopping cart icon is visible.
   * @returns {Promise<boolean>} - A boolean indicating if the shopping cart icon is visible.
   */
  async isShoppingCartIconVisible() {
    return this.shoppingCartIcon.isVisible();
  }

  /**
   * Checks if the logo functionality is working fine.
   * @param {string} expectedUrl - The expected URL after clicking the logo.
   * @returns {Promise<boolean>} - A boolean indicating if the functionality is working fine.
   */
  async isLogoFunctionalityWorkingFine(expectedUrl) {
    // Click on the logo if it is enabled
    if (this.logo.isEnabled()) {
      await this.logo.click();
      // Check if the current URL matches the expected URL after clicking the logo
      if (this.page.url() === expectedUrl) return true;
    }
    return false;
  }

  /**
   * Checks if the account functionality is working fine.
   * @returns {Promise<boolean>} - A boolean indicating if the functionality is working fine.
   */
  async isAccountFunctionalityWorkingFine() {
    // Click on the account link if it is enabled
    if (this.accountLink.isEnabled()) {
      await this.accountLink.click();
      // Check if the header text matches either "Customer Login" or "My Account"
      const headerText = await this.myAccountPageHeader.textContent();
      if (headerText === "Customer Login" || headerText === "My Account") {
        return true;
      }
      return false;
    }
  }

  /**
   * Checks if the sign-out functionality is working fine.
   * @returns {Promise<boolean>} - A boolean indicating if the functionality is working fine.
   */
  async isSignOutFunctionalityWorkingFine() {
    // Click on the sign-out link if it is enabled
    if (this.signOutLink.isEnabled()) {
      await this.signOutLink.click();
      // Check if the current URL includes "logoutSuccess"
      return this.page.url().includes("logoutSuccess");
    }
  }

  /**
   * Retrieves the dynamic successful product added message.
   * @returns {Promise<string|null>} - The successful product added message or null if not found.
   */
  async getDynamicSuccessfulProductAddedMsg() {
    try {
      // Get the text content of the dynamic product added message
      const successmsg = await this.dynamicProductAddedMsg.textContent();
      // Return the message if it's not null
      if (successmsg != null) {
        return successmsg;
      } else {
        console.log("No message found");
        return null;
      }
    } catch (error) {
      console.error("Catch block: Item qty not available");
      return null;
    }
  }

  /**
   * Asserts the dynamic successful product added message.
   * @param {string} productName - The name of the product to be asserted.
   * @returns {Promise<boolean>} - A boolean indicating if the message contains the product name.
   */
  async assertDynamicProductAddedMsg(productName) {
    // Get the successful product added message
    const successfulProductAddedMsg =
      await this.getDynamicSuccessfulProductAddedMsg();
    // Check if the message contains the product name
    return successfulProductAddedMsg.includes(
      `You added ${productName} to your shopping cart.`
    );
  }

  /**
   * This method loops through all pages, searches for the product by name, adds it to the cart if found,
   *  and handles various scenarios such as product not found,
   *  item quantity not available, and successful product addition.
   * Adds products to the cart by their names.
   * @param {string} productName - The name of the product to add to the cart.
   */
  async addProductsToCartByNames(productName) {
    let hasNextPage = true;

    // Loop until all pages have been checked or the product is found
    while (hasNextPage) {
      // Count the number of products on the current page
      const count = await this.allProductslistInsinglePage.count();

      // Loop through each product on the page
      for (let i = 0; i < count; ++i) {
        const productNameElement = await this.allProductslistInsinglePage
          .nth(i)
          .locator("strong > a");
        const productNameText = await productNameElement.textContent();
        const trimmedProductName = productNameText?.trim();

        // Check if the product name matches the desired product
        if (trimmedProductName.includes(productName)) {
          const currentURL = await this.page.url();

          // Click on the "Add to Cart" button for the matching product
          await this.allProductslistInsinglePage
            .nth(i)
            .locator("button")
            .click();

          // Wait for a short delay to allow the page to update
          return new Promise((resolve) => {
            setTimeout(async () => {
              const newURL = await this.page.url();

              // Check if the URL has changed after adding the product to the cart
              if (currentURL !== newURL) {
                console.log("Item qty not available, skipping this product");
                console.log();
                resolve();
              } else {
                const msg = await this.getDynamicSuccessfulProductAddedMsg();

                // Check if a success message is displayed
                if (msg) {
                  if (
                    msg.includes(
                      `You added ${productName} to your shopping cart.`
                    )
                  ) {
                    console.log(`${productName} added in cart`);
                    console.log();

                    // Assert the success message
                    if (await this.assertDynamicProductAddedMsg(productName))
                      resolve(); // Exit the function if the product is added
                  } else {
                    console.log(
                      "1st else block: The requested qty is not available"
                    );
                    resolve();
                  }
                } else {
                  console.log(
                    "2nd else block: The requested qty is not available and I am on product listing page"
                  );
                  // Exit the function if no message is found
                  resolve();
                }
              }
            }, 2000); // Wait for 2 seconds to allow the cart update to reflect
          });
        }
      }

      // Check if there is a next page
      hasNextPage = await this.paginationNextBtn.isVisible();

      // If there is a next page, navigate to it
      if (hasNextPage) {
        await this.paginationNextBtn.click();
      }
    }

    console.log(`Product ${productName} not found on any page.`);
  }

  /**
   * Navigates to a category, then to a subcategory, and adds products to the cart.
   * @param {Object} data - The data containing category, subcategory, and product names.
   *                        Example: { CategoryName: "Category", SubCategoryName: "Subcategory", ProductName: "Product" }
   */
  async navigateAndAddProductsToCart(data) {
    const { CategoryName, SubCategoryName, ProductName } = data;

    // Log received data for debugging
    console.log(`Data received: ${JSON.stringify(data)}`);
    console.log(`Checking categoryName: ${JSON.stringify(CategoryName)}`);
    console.log(`Checking subcategoryName: ${JSON.stringify(SubCategoryName)}`);
    console.log(`Checking productName: ${JSON.stringify(ProductName)}`);

    // Wait for the last link to be visible
    await this.allhrefs.last().waitFor();

    // Count the total number of links
    const count = await this.allhrefs.count();

    // Loop through each link
    for (let i = 0; i < count; i++) {
      // Get the href attribute of the link
      const href = await this.allhrefs
        .nth(i)
        .locator("a")
        .first()
        .getAttribute("href");

      // Check if the href attribute exists and matches the category name
      if (
        href &&
        href
          .trim()
          .includes(
            JSON.stringify(data.CategoryName).slice(1, -1).toLowerCase().trim()
          )
      ) {
        console.log(
          `Category matched: ${JSON.stringify(data.CategoryName).toLowerCase()}`
        );

        // Hover over the category link
        await this.allhrefs.nth(i).locator("a").first().hover();

        // Check if the category is expanded
        const isCategoryExpanded = await this.page
          .locator("ul[aria-expanded=true]")
          .getAttribute("aria-expanded");

        if (isCategoryExpanded === "true") {
          console.log("Category is expanded");

          // Get the list of subcategories
          const subCategoryList = this.page.locator(
            "ul[aria-expanded=true]>li a"
          );
          const subcategoryCount = await subCategoryList.count();

          let subcategoryFound = false;

          // Loop through each subcategory
          for (let j = 0; j < subcategoryCount; j++) {
            const subcategoryHref = await subCategoryList
              .nth(j)
              .getAttribute("href");

            // Check if the href attribute exists and matches the subcategory name
            if (
              subcategoryHref &&
              subcategoryHref
                .trim()
                .toLowerCase()
                .includes(SubCategoryName.toLowerCase().trim())
            ) {
              console.log(`Subcategory matched: ${SubCategoryName}`);

              // Click on the subcategory link
              await subCategoryList.nth(j).click();
              subcategoryFound = true;
              break;
            }
          }

          // If the subcategory is not found, click on the category link
          if (!subcategoryFound) {
            console.log("Subcategory not found, clicking on the category");
            await this.allhrefs.nth(i).locator("a").first().click();
          }

          // Add products to cart by names
          await this.addProductsToCartByNames(ProductName);
          break;
        }
      }
    }
  }

  /**
   * Navigates to the My Account page.
   */
  async NavigateToMyAccountPage() {
    // Click on the My Account link in the header
    await this.headerAccountLink.click();

    // Check if the page header indicates the user is on the My Account page
    if ((await this.myAccountPageHeader.textContent()) === "My Account") {
      console.log("User is on the My Account page");
    }
  }

  /**
   * Finds and adds a product to the cart using its SKU value.
   * @param {string} SKU_Value - The SKU value of the product to add to the cart.
   */
  async findAndAddProductToCartUsingSKU(SKU_Value) {
    // Clear the search bar and enter the SKU value
    await this.searchBarSKU.clear();
    await this.searchBarSKU.fill(SKU_Value);

    // Click on the search icon
    await this.searchBarSKUseachIcon.click();

    // Check if products are found
    if ((await this.allProductsList.count()) > 0) {
      // Click on the first product's button to add it to the cart
      await this.allProductsList.locator("button").click();

      try {
        // Check if a success message is displayed
        const successmsg = await this.getDynamicSuccessfulProductAddedMsg();
        if (successmsg != null) console.log(successmsg.trim());
      } catch (error) {
        console.error("Item qty not available");
        throw new Error("Item qty not available");
      }
    } else {
      // Log a message if no products are found with the given SKU value
      console.log(`Did not find any product with the SKU value ${SKU_Value}`);
    }
  }

 /**
 * Navigates to the shopping cart.
 * Resolves the promise after navigating to the cart.
 * @returns {Promise<void>}
 */
async navigateToShoppingCart() {
  await this.shoppingCartIcon.waitFor();
  await this.allhrefs.last().waitFor();
  try {
    await this.page.waitForTimeout(2000);
    // Click on the shopping cart icon
    await this.shoppingCartIcon.click();
   

    // Hover over and click on the "View and Edit Cart" link
    await this.shoppingCartViewAndEditLink.hover();
    await this.shoppingCartViewAndEditLink.click();
  } catch (error) {
    console.error("Error navigating to shopping cart:", error);
  }
}



  /**
   * Removes the first item from the mini-cart.
   * Resolves the promise if the item is successfully removed.
   * Rejects the promise if there is an error or the item is not removed.
   * @returns {Promise<void>}
   */
  async removeFirstItemFromMinicart() {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          // Click on the shopping cart icon to open the mini-cart
          await this.shoppingCartIcon.click();
          await this.page.waitForTimeout(2000);

          // Get the initial count of items in the mini-cart
          const initialCount = await this.minicartItemsList.count();
          await this.removeIconMinicart.last().waitFor()
          // Hover over and click on the remove icon of the first item
          await this.removeIconMinicart.first().hover();
          await this.removeIconMinicart.first().click();

          // Handle confirmation dialog
          await this.page.on("dialog", (dialog) => dialog.accept());
          await this.page
            .locator("button.action-primary.action-accept")
            .click();
          await this.page.waitForTimeout(2000);

          // Get the final count of items in the mini-cart
          const finalCount = await this.minicartItemsList.count();

          // Check if the count decreased by 1 after removing the item
          if (finalCount === initialCount - 1) {
            resolve(); // Resolve the promise if the count decreased by 1
          } else {
            reject(
              new Error("Count did not decrease by 1 after removing item.")
            );
          }
        } catch (error) {
          reject(error); // Reject the promise with any caught error
        }
      }, 2000);
    });
  }
}

export { DashboardPage };
