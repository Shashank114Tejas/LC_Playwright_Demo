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
    this.firstDeliveryAddress=page.locator("div.shipping-address-items>div")
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
   * Generates a confirmation page URL and performs an action.
   *
   *
   * @param {'Store Pickup' | 'Delivery'} orderType - The action to perform.
   */
  async enableOrderTypeRadioBtn(orderType) {
    await this.nextButton.waitFor();
    if (orderType.toLowerCase() == "store pickup") {
      await this.storePickupRadioBtn.check();
      await this.nextButton.hover();

      console.log("selected radio btn");
      await this.nextButton.waitFor();
      await this.page.waitForTimeout(3000)
      await this.nextButton.click();
    } else {
      await this.deliveryRadioBtn.check();
      await this.firstDeliveryAddress.first().locator("button[class*=shipping-item]>span").click();
      await this.nextButton.waitFor();
      await this.page.waitForTimeout(3000)
      await this.nextButton.click();
    }
    console.log(`clicked on ${orderType} ordertype radio btn`);
  }


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
    return obj;
  }

  /**
   * Generates a confirmation page URL and performs an action.
   *
   * @param {'Store Pickup' | 'Delivery'} orderType - The action to perform.
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
    await this.nextButton.waitFor();

    const modifiedData = await this.removeQuotes(data);
    if (
      JSON.stringify(modifiedData.orderType).toLowerCase() === "store pickup"
    ) {
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

    console.log(
      `Clicked on ${modifiedData.orderType} order type radio button and filled shipping details`
    );
  }

  async fillGuestUserFlatRateShippingDetails(
    email,
    firstName,
    LastName,
    streetAddress,
    state_Province,
    city,
    zip_postalCode,
    phnNo,
    country
  ) {
    await this.shippingEmailField.fill(email);
    await this.shippingFirstNameField.fill(firstName);
    await this.shippingLastNameField.fill(LastName);
    await this.shippingStreetAddressField.fill(streetAddress);
    await this.shippingStateProvinceDrp.selectOption(state_Province);
    await this.shippingCityField.fill(city);
    await this.shippingZipPostalCodeField.fill(zip_postalCode);
    await this.shippingPhnNoField.fill(phnNo);

    if (country) {
      await this.shippingCountryDrp.selectOption(country);
    }
    await this.nextButton.locator("span").click();
  }

  async fillGuestUserStorePickupEmailAddress(email) {
    await this.shippingEmailField.fill(email);
    await this.page.waitForLoadState("domcontentloaded");
    await this.nextButton.locator("span").click();
  }

  /**
   * Generates a confirmation page URL and performs an action.
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
    await this.GuestBillingFirstNameField.fill(firstName);
    await this.GuestBillingLastNameField.fill(LastName);
    await this.GuestBillingStreetAddressField.fill(streetAddress);
    await this.GuestBillingStateProvinceDrp.selectOption(state_Province);
    await this.GuestBillingCityField.fill(city);
    await this.GuestBillingZipPostalCodeField.fill(zip_postalCode);
    await this.GuestBillingPhnNoField.fill(phnNo);

    if (country) {
      await this.GuestBillingCountryDrp.selectOption(country);
    }
    await this.guestUserStorePickupBillingInfoUpdateBtn.click();
    await this.paymentProceedToCheckOutBtn.click();
  }

  async checkBillingShippingAddressSameCheckboxAndProceedToCheckout() {
    await this.billingShippingSameCheckBox.check();
    await this.paymentProceedToCheckOutBtn.click();
  }
  async checkBillingAddressThenProceedToCheckout(addressComponents) {//validate
    await this.page.waitForTimeout(2000)
    const billAddress = await this.paymentBillingAddress.textContent();

    // Check if all address components are included in billAddress
    const addressCheck = addressComponents.every((component) =>
      billAddress.includes(component)
    );

    if (addressCheck) {
      await this.paymentProceedToCheckOutBtn.click();
    } else {
      console.log("address not matched");
    }
  }
}
export { OrderSummaryPage };
