class OrderSummaryPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.storePickupRadioBtn = page.locator(
      "input[value=amstorepickup_amstorepickup]"
    );
    this.deliveryRadioBtn = page.locator("input[value=flatrate_flatrate]");
    this.firstDeliveryAddress = page.locator("div.shipping-address-items>div");
    this.nextButton = page.locator("button.button.action.continue.primary");
    this.guestUserStorePickupBillingInfoUpdateBtn = page.locator(
      "button.action.action-update>span"
    );
    this.paymentProceedToCheckOutBtn = page
      .locator("div.actions-toolbar button.action.primary.checkout")
      .last();
    this.paymentBillingAddress = page.locator("div.billing-address-details");
    this.shippingEmailField = page.locator(
      "fieldset#customer-email-fieldset input#customer-email"
    );
    this.shippingFirstNameField = page.locator(
      "form#co-shipping-form  input[name='firstname']"
    );
    this.GuestBillingFirstNameField = page.locator(
      "form#co-payment-form  input[name='firstname']"
    );
    this.shippingLastNameField = page.locator(
      "form#co-shipping-form  input[name='lastname']"
    );
    this.GuestBillingLastNameField = page.locator(
      "form#co-payment-form  input[name='lastname']"
    );
    this.shippingStreetAddressField = page.locator(
      "form#co-shipping-form  input[name='street[0]']"
    );
    this.GuestBillingStreetAddressField = page.locator(
      "form#co-payment-form  input[name='street[0]']"
    );
    this.shippingStateProvinceDrp = page.locator(
      "form#co-shipping-form  select[name='region_id']"
    );
    this.GuestBillingStateProvinceDrp = page.locator(
      "form#co-payment-form  select[name='region_id']"
    );
    this.shippingCountryDrp = page.locator(
      "form#co-shipping-form  select[name='country_id']"
    );
    this.GuestBillingCountryDrp = page.locator(
      "form#co-payment-form  select[name='country_id']"
    );
    this.shippingCityField = page.locator(
      "form#co-shipping-form  input[name='city']"
    );
    this.GuestBillingCityField = page.locator(
      "form#co-payment-form  input[name='city']"
    );
    this.shippingZipPostalCodeField = page.locator(
      "form#co-shipping-form  input[name='postcode']"
    );
    this.GuestBillingZipPostalCodeField = page.locator(
      "form#co-payment-form  input[name='postcode']"
    );
    this.shippingPhnNoField = page.locator(
      "form#co-shipping-form  input[name='telephone']"
    );
    this.GuestBillingPhnNoField = page.locator(
      "form#co-payment-form  input[name='telephone']"
    );
    this.billingShippingSameCheckBox = page.locator(
      "div.checkout-billing-address input[type=checkbox]"
    );
  }

  /**
   * This method enables the order type radio button based on the provided order type.
   *  If the order type is "Store Pickup", it selects the store pickup radio button and clicks
   *  on the next button. If the order type is "Delivery", it selects the delivery radio button,
   *  selects the first delivery address, and clicks on the next button.
   *
   * @param {'Store Pickup' | 'Delivery'} orderType - The type of order (either 'Store Pickup' or 'Delivery').
   */
  async enableOrderTypeRadioBtn(orderType) {
    await this.nextButton.waitFor(); // Wait for the next button to be visible

    // Check the order type and perform actions accordingly
    if (orderType.toLowerCase() === "store pickup") {
      // Select store pickup radio button
      await this.storePickupRadioBtn.check();
      await this.nextButton.hover(); // Hover over the next button

      console.log("Selected store pickup radio button");

      // Click on the next button after a delay
      await this.nextButton.waitFor();
      await this.page.waitForTimeout(3000);
      await this.nextButton.click();
    } else {
      // Select delivery radio button
      await this.deliveryRadioBtn.check();

      // Select the first delivery address
      await this.firstDeliveryAddress
        .first()
        .locator("button[class*=shipping-item]>span")
        .click();

      await this.nextButton.waitFor(); // Wait for the next button to be visible
      await this.page.waitForTimeout(3000); // Wait for a brief timeout

      // Click on the next button
      await this.nextButton.click();
    }

    console.log(`Clicked on ${orderType} order type radio button`);
  }

  /**
   * This method removes quotes from the keys and string values of the provided object.
   *  It iterates through each key of the object and recursively removes quotes from nested objects.
   *  If the value associated with a key is a string,
   *  it removes quotes from that string. Finally, it returns the modified object with quotes removed.
   *   Removes quotes from the keys and string values of the provided object.
   *
   * @param {object} obj - The object from which quotes are to be removed.
   * @returns {object} The object with quotes removed from keys and string values.
   */
  async removeQuotes(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          // Recursively remove quotes from nested objects
          obj[key] = await this.removeQuotes(obj[key]);
        } else if (typeof obj[key] === "string") {
          // Remove quotes from string values
          obj[key] = obj[key].replace(/"/g, "");
        }
      }
    }
    return obj; // Return the modified object
  }

  /**
   * This method enables the order type radio button and proceeds to checkout for a guest user,
   *  providing necessary data such as email, first name, last name, address, etc.
   *  It first waits for the next button to be visible, then removes any quotes from the data object.
   *  Depending on the order type (store pickup or delivery), it selects the appropriate radio button and
   *  fills the required details.
   *  Finally, it logs the action performed.
   * Enables the order type radio button and proceeds to checkout for a guest user, providing necessary data.
   *
   * @param {'Store Pickup' | 'Delivery'} orderType - The type of order to perform.
   * @param {string} email - The guest user's email address.
   * @param {string} firstName - The guest user's first name.
   * @param {string} lastName - The guest user's last name.
   * @param {string} streetAddress - The guest user's street address.
   * @param {string} stateProvince - The guest user's state or province.
   * @param {string} city - The guest user's city.
   * @param {string} zipPostalCode - The guest user's ZIP or postal code.
   * @param {string} phnNo - The guest user's phone number.
   * @param {string} country - The guest user's country.
   */
  async enableGuestUserOrderTypeRadioBtnAndCheckout(data) {
    // Wait for the next button to be visible
    await this.nextButton.waitFor();

    // Remove quotes from data object
    const modifiedData = await this.removeQuotes(data);

    // Check the order type and proceed accordingly
    if (
      JSON.stringify(modifiedData.orderType).toLowerCase() === "store pickup"
    ) {
      // If store pickup, select store pickup radio button and fill necessary details
      await this.storePickupRadioBtn.check();
      await this.fillGuestUserStorePickupEmailAddress(modifiedData.email);
      await this.fillBillingInfoUpdateAndProceedToCheckOut(
        modifiedData.firstName,
        modifiedData.lastName,
        modifiedData.streetAddress,
        modifiedData.stateProvince,
        modifiedData.city,
        String(modifiedData.zipPostalCode),
        String(modifiedData.phnNo),
        modifiedData.country
      );
    } else {
      // If delivery, select delivery radio button and fill necessary details
      await this.deliveryRadioBtn.check();
      await this.fillGuestUserFlatRateShippingDetails(
        modifiedData.email,
        modifiedData.firstName,
        modifiedData.lastName,
        modifiedData.streetAddress,
        modifiedData.stateProvince,
        modifiedData.city,
        String(modifiedData.zipPostalCode),
        String(modifiedData.phnNo),
        modifiedData.country
      );
      await this.checkBillingShippingAddressSameCheckboxAndProceedToCheckout();
    }

    // Log the action performed
    console.log(
      `Clicked on ${modifiedData.orderType} order type radio button and filled shipping details`
    );
  }

  /**
 *This method handles the process of filling in flat rate shipping details during the checkout process
  for a guest user. It fills in various shipping details such as email, first name, last name, address, etc.,
  and then clicks on the next button to proceed with the checkout process.

 *  Fills flat rate shipping details for a guest user during checkout.
 * 
 *
 * @param {string} email - The guest user's email address.
 * @param {string} firstName - The guest user's first name.
 * @param {string} lastName - The guest user's last name.
 * @param {string} streetAddress - The guest user's street address.
 * @param {string} stateProvince - The guest user's state or province.
 * @param {string} city - The guest user's city.
 * @param {string} zipPostalCode - The guest user's ZIP or postal code.
 * @param {string} phnNo - The guest user's phone number.
 * @param {string} country - The guest user's country.
 */
  async fillGuestUserFlatRateShippingDetails(
    email,
    firstName,
    lastName,
    streetAddress,
    stateProvince,
    city,
    zipPostalCode,
    phnNo,
    country
  ) {
    // Fill flat rate shipping details
    await this.shippingEmailField.fill(email);
    await this.shippingFirstNameField.fill(firstName);
    await this.shippingLastNameField.fill(lastName);
    await this.shippingStreetAddressField.fill(streetAddress);
    await this.shippingStateProvinceDrp.selectOption(stateProvince);
    await this.shippingCityField.fill(city);
    await this.shippingZipPostalCodeField.fill(zipPostalCode);
    await this.shippingPhnNoField.fill(phnNo);

    // Select country if provided
    if (country) {
      await this.shippingCountryDrp.selectOption(country);
    }

    // Click on the next button to proceed
    await this.nextButton.locator("span").click();
  }

  /**
 *This method fills in the email address field for a guest user during the store pickup checkout process.
  It waits for the page to finish loading and then
  clicks on the next button to proceed with the checkout.
 *  Fills the email address field for a guest user during store pickup checkout.
 *
 * @param {string} email - The guest user's email address.
 */
  async fillGuestUserStorePickupEmailAddress(email) {
    // Fill the email address field
    await this.shippingEmailField.fill(email);

    // Wait for the page to finish loading
    await this.page.waitForLoadState("domcontentloaded");

    // Click on the next button to proceed
    await this.nextButton.locator("span").click();
  }

  /**
   * Fills the billing information for a guest user and proceeds to checkout.
   *
   * @param {string} firstName - The guest user's first name.
   * @param {string} lastName - The guest user's last name.
   * @param {string} streetAddress - The guest user's street address.
   * @param {string} stateProvince - The guest user's state or province.
   * @param {string} city - The guest user's city.
   * @param {string} zipPostalCode - The guest user's ZIP or postal code.
   * @param {string} phnNo - The guest user's phone number.
   * @param {string} country - The guest user's country.
   */
  async fillBillingInfoUpdateAndProceedToCheckOut(
    firstName,
    LastName,
    streetAddress,
    state_Province,
    city,
    zip_postalCode,
    phnNo,
    country
  ) {
    // Fill the billing information fields
    await this.GuestBillingFirstNameField.fill(firstName);
    await this.GuestBillingLastNameField.fill(LastName);
    await this.GuestBillingStreetAddressField.fill(streetAddress);
    await this.GuestBillingStateProvinceDrp.selectOption(state_Province);
    await this.GuestBillingCityField.fill(city);
    await this.GuestBillingZipPostalCodeField.fill(zip_postalCode);
    await this.GuestBillingPhnNoField.fill(phnNo);

    // If country is provided, select it from the dropdown
    if (country) {
      await this.GuestBillingCountryDrp.selectOption(country);
    }

    // Click on the update button for billing info
    await this.guestUserStorePickupBillingInfoUpdateBtn.click();

    // Click on the button to proceed to payment checkout
    await this.paymentProceedToCheckOutBtn.click();
  }

  /**
   * Checks the billing and shipping address are the same and proceeds to checkout.
   */
  async checkBillingShippingAddressSameCheckboxAndProceedToCheckout() {
    // Check the billing and shipping address same checkbox
    await this.billingShippingSameCheckBox.check();

    // Click on the button to proceed to payment checkout
    await this.paymentProceedToCheckOutBtn.click();
  }

  /**
   * Checks the billing address and then proceeds to checkout.
   *
   * @param {Array<string>} addressComponents - The components of the expected billing address.
   */
  async checkBillingAddressThenProceedToCheckout(addressComponents) {
    await this.page.waitForTimeout(2000);

    // Retrieve the current billing address text
    const billAddress = await this.paymentBillingAddress.textContent();

    // Check if all address components are included in the billing address
    const addressCheck = addressComponents.every((component) =>
      billAddress.includes(component)
    );

    // If address components match, proceed to checkout; otherwise, log the mismatch
    if (addressCheck) {
      await this.paymentProceedToCheckOutBtn.click();
    } else {
      console.log("Address not matched");
    }
  }
}
export { OrderSummaryPage };
