// Import dotenv and load the configuration
require('dotenv').config();



class PaymentDetailsPage {
    constructor(page) {
        this.page = page;
        this.cardNumberFeild= page.frameLocator('iframe[name="tx_iframe_tokenExIframeDiv"]').getByLabel('Data')
        this.cardNameFeild = page.locator(" input[name=name]")
        this.cardCVV = page.frameLocator('iframe[name="tx_iframe_cvv_iframe-cvc"]').getByLabel('CVV')
        this.cardExpiry = page.locator('#expiry')
        this.payBtn = page.locator("button.payButton")
      this.paymentSuccessOrderNo = page.locator("div.checkout-success strong")
      this.GuestUserSuccessOrderNo=page.locator("div.checkout-success span").first()
    }

    /**
     * @param {import('@playwright/test').Page} page
     */
  

  async fillPaymentCardDetails() {
    try {
      // Checking if the environment variables are defined
      if (!process.env.CARD_NUMBER || !process.env.CARD_NAME || !process.env.CARD_CVV || !process.env.CARD_EXPIRY) {
        console.error('One or more required environment variables are not defined.');
        return;
      }
  
      console.log('CARD_NUMBER:', process.env.CARD_NUMBER);
      console.log('CARD_NAME:', process.env.CARD_NAME);
      console.log('CARD_CVV:', process.env.CARD_CVV);
      console.log('CARD_EXPIRY:', process.env.CARD_EXPIRY);
  
      // Fill the payment card details
      await this.cardNumberFeild.pressSequentially(process.env.CARD_NUMBER, { delay: 100 });
      await this.cardNameFeild.fill(process.env.CARD_NAME, { timeout: 1000 });
      await this.cardCVV.fill(process.env.CARD_CVV);
        await this.cardExpiry.pressSequentially(process.env.CARD_EXPIRY, { delay: 100 });
       
      await  this.page.waitForLoadState("domcontentloaded")
      await this.payBtn.click()
    } catch (error) {
      console.error('Error while filling payment card details:', error.message);
    }
  }
  
    async getPaymentSuccessOrderId() {
      return this.paymentSuccessOrderNo.textContent()
  }
  async getGuestUserPaymentSuccessOrderID() {
    return this.GuestUserSuccessOrderNo.textContent()
  }
   
  async navigateToMyOrdersPage() {
    await this.paymentSuccessOrderNo.click();
  }
   
}
export{PaymentDetailsPage};