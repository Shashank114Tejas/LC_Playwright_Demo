// Import dotenv and load the configuration
require("dotenv").config();

class PaymentDetailsPage {
  constructor(page) {
    this.page = page;
    this.cardNumberFeild = page
      .frameLocator('iframe[name="tx_iframe_tokenExIframeDiv"]')
      .getByLabel("Data");
    this.cardNameFeild = page.locator(" input[name=name]");
    this.cardCVV = page
      .frameLocator('iframe[name="tx_iframe_cvv_iframe-cvc"]')
      .getByLabel("CVV");
    this.cardExpiry = page.locator("#expiry");
    this.payBtn = page.locator("button.payButton");
    this.paymentSuccessOrderNo = page.locator("div.checkout-success strong");
    this.GuestUserSuccessOrderNo = page
      .locator("div.checkout-success span")
      .first();
  }

  /**
   * This method fills the payment card details using environment variables such as
   *  card number, name, CVV, and expiry date. After filling the details, it waits for the page to load
   *  and then clicks on the payment button.
   *  If any error occurs during the process, it's logged to the console.
   * Fills the payment card details using environment variables and proceeds with payment.
   *
   */
  async fillPaymentCardDetails() {
    try {
      // Checking if the environment variables are defined
      if (
        !process.env.CARD_NUMBER ||
        !process.env.CARD_NAME ||
        !process.env.CARD_CVV ||
        !process.env.CARD_EXPIRY
      ) {
        console.error(
          "One or more required environment variables are not defined."
        );
        return;
      }

      // Fill the payment card details
      await this.cardNumberFeild.pressSequentially(process.env.CARD_NUMBER, {
        delay: 100,
      });
      await this.cardNameFeild.fill(process.env.CARD_NAME, { timeout: 1000 });
      await this.cardCVV.fill(process.env.CARD_CVV);
      await this.cardExpiry.pressSequentially(process.env.CARD_EXPIRY, {
        delay: 100,
      });

      // Wait for the page to load
      await this.page.waitForLoadState("domcontentloaded");

      // Click on the payment button
      await this.payBtn.click();
    } catch (error) {
      console.error("Error while filling payment card details:", error.message);
    }
  }

  /**
   * Retrieves the order ID from the payment success page.
   * @returns {Promise<string>} The order ID.
   */
  async getPaymentSuccessOrderId() {
    await this.paymentSuccessOrderNo.waitFor()
    return this.paymentSuccessOrderNo.textContent();
  }

  /**
   * Retrieves the order ID from the guest user payment success page.
   * @returns {Promise<string>} The order ID.
   */
  async getGuestUserPaymentSuccessOrderID() {
    return this.GuestUserSuccessOrderNo.textContent();
  }

  /**
   * Navigates to the My Orders page from the payment success page.
   */
  async navigateToMyOrdersPage() {
    await this.paymentSuccessOrderNo.click();
  }
}
export { PaymentDetailsPage };
