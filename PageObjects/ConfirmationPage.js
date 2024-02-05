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

 
  async extractItemsDetailsRowData(page) {
    const rowData = []; // Array to store data for each row
  
    const rowsCount = await page
      .locator("div.card.card-body p tbody>tr:visible")
      .count();
  
    for (let i = 0; i < rowsCount; i++) {
      const row = page.locator("div.card.card-body p tbody>tr").nth(i);
      const cellsCount = await row.locator("td").count();
  
      const cells = row.locator("td");
  
      const rowDataItem = {};
      for (let j = 0; j < cellsCount; j++) {
        const cellText = await cells.nth(j).innerText();
        const key = ["Name", "Quantity", "Price"][j];
        rowDataItem[key] = cellText;
      }
  
      rowData.push(rowDataItem);
    }
  
    return rowData;
  }
  
  async extractItemsPricingDetailsData(page) {
    const rowData = []; // Array to store data for each row

    const rowsCount = await page
        .locator("main#maincontent h4:visible")//7
        .count();

    for (let i = 0; i < rowsCount; i++) {
        if (i == 1) {
            continue;
        }

        const row = page.locator("main#maincontent h4").nth(i);
        const cellsCount = await row.locator("span").count();
        const cells = row.locator("span");

        const rowDataItem = {};
        const keys = ["OrderID", "","Subtotal", "Taxes", "Shipping", "ServiceFee", "GrandTotal"];

        for (let j = 0; j < cellsCount; j++) {
            const cellText = await cells.nth(j).innerText();
            rowDataItem[keys[i]] = cellText;
        }

        rowData.push(rowDataItem);
    }

    return(rowData);
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
      const rowData2=await this.extractItemsPricingDetailsData(newPage)
      allRowData.push(rowData2)

      // Perform the action based on the 'action' parameter
      if (action.toLowerCase() === "confirm") {
        await newPage.locator("button.btn-primary").click();
      } else {
        await newPage.locator("button.btn-warning").click();
      }
  
      // Closing the new tab
      await newPage.close();
    }
  
    return(allRowData); ;
  }
  
}

export { ConfirmationPage };
