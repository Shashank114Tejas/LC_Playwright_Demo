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

  /**
   * This method extracts details data of ordered items from the My Orders page by iterating through each row and extracting data for each item's name, SKU, price, quantity, and subtotal, and returns an array containing details data for all ordered items.
   * Extracts the details data of ordered items from the My Orders page.
   * @returns {Promise<Array<object>>} An array containing details data for ordered items.
   */
  async extractOrderedItemDetailsDataMyOrdersPage() {
    const rowData = []; // Array to store details data for each item

    // Count the number of rows containing item details
    const rowsCount = await this.allOrderedProductsRows.count();

    // Loop through each row
    for (let i = 0; i < rowsCount; i++) {
      // Get the current row element
      const row = this.allOrderedProductsRows.nth(i);

      // Count the number of cells in the current row
      const cellsCount = await row.locator("td").count();

      // Get the cells within the current row
      const cells = row.locator("td");

      // Create an object to store details data for the current row
      const rowDataItem = {};

      // Loop through each cell and assign the cell text to the corresponding key
      for (let j = 0; j < cellsCount; j++) {
        const cellText = await cells.nth(j).innerText();
        const key = ["Name", "SKU", "Price", "Qty", "Subtotal"][j]; // Define keys for each column
        rowDataItem[key] = cellText; // Assign value to the corresponding key
      }

      // Add the details data object to the rowData array
      rowData.push(rowDataItem);
    }

    return rowData; // Return the array containing details data for ordered items
  }

  /**
   * This method extracts pricing data of ordered items from the My Orders page by iterating through each row and extracting data for each item's subtotal, shipping, service fee, taxes, and grand total, and returns an array containing pricing data for all ordered items.
   * Extracts the pricing data of ordered items from the My Orders page.
   * @returns {Promise<Array<object>>} An array containing pricing data for ordered items.
   */
  async extractOrderedItemsPricingDataMyOrdersPage() {
    const rowData = []; // Array to store pricing data for each item
    const keys = ["Subtotal", "Shipping", "ServiceFee", "Taxes", "GrandTotal"]; // Manually defined keys

    // Count the number of rows containing pricing data
    const rowsCount = await this.allOrderedProductsPricingRows.count();

    // Loop through each row
    for (let i = 0; i < rowsCount; i++) {
      // Get the current row element
      const row = this.allOrderedProductsPricingRows.nth(i);

      // Get the cells within the row
      const cells = await row.locator("span");

      // Create an object to store pricing data for the current row
      const rowDataItem = {};

      // Loop through each cell and assign the cell text to the corresponding key
      for (let j = 0; j < (await cells.count()); j++) {
        const cellText = await cells.nth(j).innerText();
        rowDataItem[keys[i]] = cellText; // Assign value to the corresponding manual key
      }

      // Add the pricing data object to the rowData array
      rowData.push(rowDataItem);
    }

    return rowData; // Return the array containing pricing data for ordered items
  }

  /**
   * This method validates the order data against the expected data, checking for mismatches in each item's name, quantity, and price, and returns true if all items match.
   * Validates the order data against the expected data.
   * @param {Array<object>} expectedData - The expected order data array.
   * @param {Array<object>} actualData - The actual order data array.
   * @returns {boolean} Whether the order data matches the expected data.
   */
  async validateOrderData(expectedData, actualData) {
    // Iterate over each expected item
    for (const expectedItem of expectedData) {
      // Find the matching actual item by name
      const matchingActualItem = actualData[0].find(
        (actualItem) => actualItem.Name === expectedItem.Name
      );

      // Check if the matching actual item exists
      if (!matchingActualItem) {
        console.log(`Product "${expectedItem.Name}" not found in actual data.`);
        return false; // Return false if the item is not found
      }

      // Check if the expected quantity matches the actual quantity
      if (expectedItem.Qty !== matchingActualItem.Quantity) {
        const expectedQTY = parseInt(expectedItem.Qty.replace("Ordered", ""));
        const actualQTY = parseInt(matchingActualItem.Quantity);

        // Check if the quantities match
        if (expectedQTY !== actualQTY) {
          console.log(
            `Quantity mismatch for "${expectedItem.Name}": expected "${expectedQTY}", actual "${actualQTY}"`
          );
          return false; // Return false if the quantities do not match
        }
      }

      // Parse expected and actual prices and compare them
      const expectedPrice = parseFloat(expectedItem.Price.replace(/\$/, ""));
      const actualPrice = parseFloat(
        matchingActualItem.Price.replace(/\$/, "")
      );

      // Check if the prices match
      if (expectedPrice !== actualPrice) {
        console.log(
          `Price mismatch for "${expectedItem.Name}": expected ${expectedPrice}, actual ${actualPrice}`
        );
        return false; // Return false if the prices do not match
      }
    }

    return true; // Return true if all items match
  }

  /**
   * This method compares the pricing data against the expected data,
   * checking for mismatches in each key and returning true if all values match.
   * @param {object} expectedPricingData - The expected pricing data object.
   * @param {array} actualPricingData - The actual pricing data array.
   * @param {string} orderID - The order ID to validate against.
   * @returns {boolean} Whether the pricing data matches the expected data.
   */
  async validatePricingData(expectedPricingData, actualPricingData, orderID) {
    // Define keys to compare (excluding OrderID)
    const keysToCompare = [
      "Subtotal",
      "Shipping",
      "ServiceFee",
      "Taxes",
      "GrandTotal",
    ];

    // Retrieve the OrderID from the second array in actualPricingData
    const actualOrderID = actualPricingData[1]?.find(
      (item) => item.OrderID
    )?.OrderID;

    // Check if OrderID exists in actualPricingData
    if (!actualOrderID) {
      console.log("OrderID not found in actualPricingData.");
      return false;
    }

    // Check if the actual OrderID matches the expected OrderID
    if (actualOrderID !== orderID) {
      console.log(
        `OrderID mismatch: expected ${orderID}, actual ${actualOrderID}`
      );
      return false;
    }

    console.log(`OrderNo:-${actualOrderID} verified`);

    // Compare values for each key
    for (let i = 0; i < keysToCompare.length; i++) {
      const key = keysToCompare[i];

      // Retrieve and parse expected and actual values
      const expectedValue = parseFloat(
        expectedPricingData[i]?.[key]?.replace(/\$/g, "")
      );
      const actualValue = parseFloat(
        actualPricingData[1]
          ?.find((item) => item[key])
          ?.[key]?.replace(/\$/g, "")
      );

      // Log expected and actual values
      console.log(
        `Expected ${[key]}:  ${expectedValue}, Actual ${[key]}: ${actualValue}`
      );

      // Compare values with a tolerance of 0.0001
      if (
        Math.abs(expectedValue - actualValue) > 0.0001 &&
        !(expectedValue === 0 && actualValue === 0)
      ) {
        console.log(
          `Value mismatch for "${key}": expected ${expectedValue}, actual ${actualValue}`
        );
        return false;
      }
    }

    return true; // Return true if all values match
  }
}
export { MyOrdersPage };
