class ConfirmationPage {
  /**
   *@param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.confirmOrderBtn = page.locator("button.btn-primary");
    this.rejectOrderBtn = page.locator("button.btn-warning");
    this.actionText = page.locator("h3").last();
    this.allOrderedProductsRows = page.locator("div.card.card-body p tbody>tr");
    this.dataset = JSON.parse(
      JSON.stringify(require("../Utils/ClientAppTestData.json"))
    );
  }

  /**
   * Extracts details data from items rows on a page.
   *
   * @param {Page} page - The page to extract data from.
   * @returns {Object[]} rowData - An array containing details data for each row.
   */
  async extractItemsDetailsRowData(page) {
    const rowData = []; // Array to store data for each row

    // Counting the number of visible rows
    const rowsCount = await page
      .locator("div.card.card-body p tbody>tr:visible")
      .count();

    // Iterating over each row
    for (let i = 0; i < rowsCount; i++) {
      const row = page.locator("div.card.card-body p tbody>tr").nth(i);
      const cellsCount = await row.locator("td").count();

      const cells = row.locator("td");

      const rowDataItem = {}; // Object to store data for each cell in the row
      // Iterating over each cell in the row
      for (let j = 0; j < cellsCount; j++) {
        const cellText = await cells.nth(j).innerText();
        const key = ["Name", "Quantity", "Price"][j]; // Determining the key based on cell index
        rowDataItem[key] = cellText; // Storing cell text with corresponding key
      }

      rowData.push(rowDataItem); // Adding row data to the rowData array
    }

    return rowData; // Returning the array containing details data for each row
  }

  /**
   * Extracts pricing details data from a page.
   *
   * @param {Page} page - The page to extract data from.
   * @returns {Object[]} rowData - An array containing pricing details data.
   */
  async extractItemsPricingDetailsData(page) {
    const rowData = []; // Array to store data for each row

    // Counting the number of visible pricing detail sections
    const rowsCount = await page
      .locator("main#maincontent h4:visible") // Selecting visible pricing detail sections
      .count();

    // Iterating over each pricing detail section
    for (let i = 0; i < rowsCount; i++) {
      if (i == 1) {
        continue; // Skipping the second section
      }

      // Selecting the pricing detail section
      const row = page.locator("main#maincontent h4").nth(i);
      const cellsCount = await row.locator("span").count();
      const cells = row.locator("span");

      const rowDataItem = {}; // Object to store data for each cell in the section
      const keys = [
        "OrderID",
        "",
        "Subtotal",
        "Taxes",
        "Shipping",
        "ServiceFee",
        "GrandTotal",
      ]; // Keys for each data item

      // Iterating over each cell in the section
      for (let j = 0; j < cellsCount; j++) {
        const cellText = await cells.nth(j).innerText();
        rowDataItem[keys[i]] = cellText; // Storing cell text with corresponding key
      }

      rowData.push(rowDataItem); // Adding section data to the rowData array
    }

    return rowData; // Returning the array containing pricing details data
  }

  /**
   * Generates a confirmation page URL and performs an action.
   *
   * @param {string} entityId - The ID of the entity.
   * @param {'confirm' | 'reject'} action - The action to perform.
   */
  async navigateToConfirmationPageAndPerformAction(entityId, action) {
    const allRowData = []; // Array to store data for each iteration

    for (const data of this.dataset) {
      const modifiedUrl = data.confirmationPageUrl.replace(
        /entity_id=\d+/,
        `entity_id=${entityId}`
      );

      // Create a new tab and navigate to the modified URL
      const newPage = await this.page.context().newPage();
      await newPage.goto(modifiedUrl);
      await newPage.locator("button.btn-primary").waitFor();

      const rowData = await this.extractItemsDetailsRowData(newPage);
      allRowData.push(rowData);
      const rowData2 = await this.extractItemsPricingDetailsData(newPage);
      allRowData.push(rowData2);

      // Perform the action based on the 'action' parameter
      if (action.toLowerCase() === "confirm") {
        await newPage.locator("button.btn-primary").click();
      } else {
        await newPage.locator("button.btn-warning").click();
      }

      // Closing the new tab
      await newPage.close();
    }

    return allRowData;
  }
}

export { ConfirmationPage };
