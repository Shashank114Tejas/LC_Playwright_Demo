class MyAddressBookPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.defaultBillingAddress = page.locator(
      "div.box.box-address-billing div.box-content>address"
    );
    this.defaultShippingAddress = page.locator(
      "div.box.box-address-shipping div.box-content>address"
    );
    this.allAdditionalAddressesEntries = page.locator(
      "div.block.block-addresses-list tbody>tr"
    );
  }

  /**
   * Formats the input data by trimming each line and replacing multiple whitespaces with a single space.
   * @param {string} input - The input data to format.
   * @returns {Promise<string>} The formatted input.
   */
  async formatData(input) {
    // Trim each line, replace multiple whitespaces with a single space, and join the lines with commas
    const lines = input
      .trim()
      .split("\n")
      .map((line) => line.trim().replace(/\s+/g, " "));
    return lines.join(", ");
  }

  /**
   * Retrieves and formats the default billing address.
   * @returns {Promise<string>} The formatted default billing address.
   */
  async getDefaultBillingAddress() {
    // Get the text content of the default billing address element
    const billAddress = await this.defaultBillingAddress.textContent();
   
    // Format the billing address and return it
    return this.formatData(billAddress);
  }

  /**
   * Retrieves and formats the default shipping address.
   * @returns {Promise<string>} The formatted default shipping address.
   */
  async getDefaultShippingAddress() {
    // Get the text content of the default shipping address element
    const shipAddress = await this.defaultShippingAddress.textContent();
    // Format the shipping address and return it
    return this.formatData(shipAddress);
  }

  /**
   * Retrieves and formats additional addresses.
   * @returns {Promise<Array<string>>} An array of formatted additional addresses.
   */
  async getAdditionalAddressesEntries() {
    const addresses = [];
    // Loop through each additional address entry
    for (
      let i = 0;
      i < (await this.allAdditionalAddressesEntries.count());
      i++
    ) {
      // Get the text content of the current additional address entry
      const addressEntry = await this.allAdditionalAddressesEntries
        .nth(i)
        .textContent();
      // Format the address entry and add it to the addresses array
      addresses.push(await this.formatData(addressEntry));
    }
    return addresses; // Return the array of formatted additional addresses
  }
}

export { MyAddressBookPage };
