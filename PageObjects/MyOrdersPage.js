class MyOrdersPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.allOrderedProductsRows = page.locator(
      "table.data.table.table-order-items tbody"
    );
    this.allOrderedProductsPricingRows = page.locator("tfoot>tr");
  }

  async extractOrderedItemDetailsDataMyOrdersPage() {
    const rowData = [];
    const rowsCount = await this.allOrderedProductsRows.count();

    for (let i = 0; i < rowsCount; i++) {
      const row = this.allOrderedProductsRows.nth(i);
      const cellsCount = await this.allOrderedProductsRows
        .nth(i)
        .locator("td")
        .count();
      const cells = this.allOrderedProductsRows.nth(i).locator("td");
      const rowDataItem = {};
      for (let j = 0; j < cellsCount; j++) {
        const cellText = await cells.nth(j).innerText();
        const key = ["Name", "SKU", "Price", "Qty", "Subtotal"][j];
        rowDataItem[key] = cellText;
      }

      rowData.push(rowDataItem); // Add the row data to the array
    }

    return rowData;
  }

  async extractOrderedItemsPricingDataMyOrdersPage() {
    const rowData = [];
    const rowsCount = await this.allOrderedProductsPricingRows.count();
    const keys = ["Subtotal", "Shipping", "ServiceFee","Taxes", "GrandTotal"]; // Manually defined keys
  
    for (let i = 0; i < rowsCount; i++) {
      const row = this.allOrderedProductsPricingRows.nth(i);
      const cells = await row.locator("span");
      const rowDataItem = {};
  
      for (let j = 0; j < (await cells.count()); j++) {
        const cellText = await cells.nth(j).innerText();
        rowDataItem[keys[i]] = cellText; // Assign value to the corresponding manual key
      }
  
      rowData.push(rowDataItem);
    }
  
    return (rowData);
  }
  

  async validateOrderData(expectedData, actualData) {
    for (const expectedItem of expectedData) {
      const matchingActualItem = actualData[0].find(
        (actualItem) => actualItem.Name === expectedItem.Name
      );

      if (!matchingActualItem) {
        console.log(`Product "${expectedItem.Name}" not found in actual data.`);
        return false;
      }

      if (expectedItem.Qty !== matchingActualItem.Quantity) {
        const expectedQTY = parseInt(expectedItem.Qty.replace("Ordered", ""));
        const actualQTY = parseInt(matchingActualItem.Quantity);

        if (expectedQTY !== actualQTY) {
          console.log(
            `Quantity mismatch for "${expectedItem.Name}": expected "${expectedQTY}", actual "${actualQTY}"`
          );
          return false;
        }
      }

      const expectedPrice = parseFloat(expectedItem.Price.replace(/\$/, ""));
      const actualPrice = parseFloat(
        matchingActualItem.Price.replace(/\$/, "")
      );

      if (expectedPrice !== actualPrice) {
        console.log(
          `Price mismatch for "${expectedItem.Name}": expected ${expectedPrice}, actual ${actualPrice}`
        );
        return false;
      }
    }

    return true;
  }


  async validatePricingData(expectedPricingData, actualPricingData, orderID) {
    // Define keys to compare (excluding OrderID)
    const keysToCompare = ["Subtotal", "Shipping", "ServiceFee","Taxes", "GrandTotal"];
   
    // Retrieve the OrderID from the second array in actualPricingData
    const actualOrderID = actualPricingData[1]?.find(item => item.OrderID)?.OrderID;

    if (!actualOrderID) {
        console.log("OrderID not found in actualPricingData.");
        return false;
    }

    if (actualOrderID !== orderID) {
        console.log(`OrderID mismatch: expected ${orderID}, actual ${actualOrderID}`);
        return false;
    }

    console.log(`OrderNo:-${actualOrderID} verified`);

    // Compare values for each key
    for (let i = 0; i < keysToCompare.length; i++) {
        const key = keysToCompare[i];

        const expectedValue = expectedPricingData[i]?.[key]?.replace(/\$/g, "");
        const actualValue = parseFloat((actualPricingData[1]?.find(item => item[key])?.[key])?.replace(/\$/g, ""));

        console.log(`Expected ${[key]}:  ${expectedValue}, Actual ${[key]}: ${actualValue}`);

        if (Math.abs(expectedValue - actualValue) > 0.0001 && !(expectedValue === 0 && actualValue === 0)) {
            console.log(
                `Value mismatch for "${key}": expected ${expectedValue}, actual ${actualValue}`
            );
            return false;
        }
    }

    return true;
}

}
export { MyOrdersPage };
