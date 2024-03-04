import { waitForDebugger } from "inspector";
import { logger } from "../Utils/Logger";

class MyAccountsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  /**
   * Generates a confirmation page URL and performs an action.
   *
   * @param {string} entityId - The ID of the entity.
   * @param {'confirm' | 'reject'} action - The action to perform.
   */

  constructor(page) {
    this.page = page;
    this.viewAllOrdersLink = page.locator(
      "div.block-title.order a.action.view>span"
    );
    this.recentOrdersList = page.locator(
      "table.data.table.table-order-items tbody>tr"
    );
    this.allOrdersRowInsinglePage = page.locator(
      "table.data.table.table-order-items.history tbody>tr"
    );
    this.paginationNextBtn = page.locator("a.action.next");
    this.myAccountEditBtn = page.locator(
      "div.block.block-dashboard-info a.action.edit>span"
    );
    this.contactInfoNameEmail = page.locator(
      "div.block.block-dashboard-info div.box-content>p"
    );
    this.pageHeader = page.locator("h1>span");
    this.editFirstnameField = page.locator(
      "form#form-validate div.control>input#firstname"
    );
    this.editLastnameField = page.locator(
      "form#form-validate div.control>input#lastname"
    );
    this.editAccountInfoSaveBtn = page.locator(
      "form#form-validate div.primary>button.action.save.primary>span"
    );
    this.editSuccessMsg = page.locator(
      "main#maincontent div[data-ui-id='message-success']>div"
    );
    this.sidebarAddressBookLink = page.locator(
      "div.sidebar.sidebar-main li>a[href*='address']"
    );
    this.recentlyOrderedHeading = page.locator("strong#block-reorder-heading");
    this.recentlyOrderedProductsList = page.locator(
      "ol#cart-sidebar-reorder>li "
    );
    this.recentlyOrderedAddToCartBtn = page.locator(
      "div.sidebar.sidebar-additional button[title='Add to Cart']>span"
    );
  }

  /**
   * Checks the status of a given order.
   * @param {string} orderNo - The order number to check.
   * @returns {Promise<string>} The status of the order.
   * @throws {Error} If the order is not found after all iterations.
   */
  async checkOrderStatus(orderNo) {
    // Click on the view all orders link
    await this.viewAllOrdersLink.click();

    let maxIterations = 100;
    let iteration = 0;
    let hasNextPage = true;

    while (hasNextPage && iteration < maxIterations) {
      const count = await this.allOrdersRowInsinglePage.count();

      for (let i = 0; i < count; ++i) {
        const orderNoElement = this.allOrdersRowInsinglePage
          .nth(i)
          .locator("td")
          .first();
        const orderNoText = await orderNoElement.textContent();

        if (orderNoText === orderNo) {
          const statusElement = this.allOrdersRowInsinglePage
            .nth(i)
            .locator("td.col.status");
          const status = await statusElement.textContent();
          return status;
        }
      }

      // Check for pagination next button
      hasNextPage = await this.paginationNextBtn.isVisible();

      // If the next page exists, click on it
      if (hasNextPage) {
        await this.paginationNextBtn.click();
      }

      iteration++;
    }

    // If the order is not found after all iterations, throw an error
    throw new Error(`Order ${orderNo} not found on any page.`);
  }

  /**
   * Gets the first name, last name, and email from the My Account page.
   * @returns {Promise<Array<string>>} An array containing the first name, last name, and email.
   */
  async getMyAccountFirstNameLastNameEmail() {
    const firstLastNameEmail = await this.contactInfoNameEmail.textContent();
    const infoArr = firstLastNameEmail.split(" ");
    const contactInfo = infoArr
      .filter((val) => val.trim() !== "")
      .map((val) => val.trim());
    return contactInfo;
  }

  /**
   * Edits the first name and last name on the My Account page.
   * Logs a message indicating whether the changes were successful.
   * @returns {Promise<void>}
   */
  async editMyAccountFirstNameAndLastName() {
    const [firstName, lastName, email] =
      await this.getMyAccountFirstNameLastNameEmail();

    // Click on the edit button for account information
    await this.myAccountEditBtn.click();

    if ((await this.pageHeader.textContent()) === "Edit Account Information") {
      // Check if the current name is 'QARemo Sys', if so, change it to 'John Doe', otherwise change it back
      if (firstName === "QARemo" && lastName === "Sys") {
        await this.editFirstnameField.fill("John");
        await this.editLastnameField.fill("Doe");
      } else {
        await this.editFirstnameField.fill("QARemo");
        await this.editLastnameField.fill("Sys");
      }
    }

    // Click on the save button for account information
    await this.editAccountInfoSaveBtn.click();

    // Check if the edit was successful and log a message accordingly
    const editSuccess = await this.editSuccessMsg.textContent();
    if (editSuccess.trim() === "You saved the account information.") {
      logger.info("User's Account firstname and lastname are changed");
    } else {
      logger.info("-> User's Account firstname and lastname are not changed");
    }
  }

  /**
   * Navigates to the Address Book page.
   * @returns {Promise<void>}
   */
  async navigateToAddressBookPage() {
    await this.sidebarAddressBookLink.click();
  }

  // async addRecentlyOrderedProductsToCart() {
  //   await this.recentlyOrderedHeading.waitFor()
  //   for (let i = 0; i < await this.recentlyOrderedProductsList.count(); i++){
  //     await this.recentlyOrderedProductsList.nth(i).locator("input[type=checkbox]").check();
  //   }
  //   await this.recentlyOrderedAddToCartBtn.click()
  //   await this.page.pause()
  // }

  async reOrder() {
    for (let i = 0; i < (await this.recentOrdersList.count()); i++) {
      if (
        (await this.recentOrdersList
          .nth(i)
          .locator(" td[data-th=Status]")
          .textContent()) == "Processing" ||
        (await this.recentOrdersList
          .nth(i)
          .locator(" td[data-th=Status]")
          .textContent()) == "Pending"
      ) {
        await this.recentOrdersList.nth(i).locator(" td[data-th=Actions] a.action.order").click();
        break;
      }
    }
  }
}

export { MyAccountsPage };
