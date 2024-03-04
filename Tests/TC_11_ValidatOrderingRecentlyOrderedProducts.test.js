import { test, expect } from "@playwright/test";
import { POManager } from "../PageObjects/POManager";
import { addLoggingHooks } from "../Utils/TestUtils";
import { logger, logTestCaseStart, logTestCaseEnd } from "../Utils/Logger";

// Loading test data from a JSON file
const dataset = JSON.parse(
  JSON.stringify(require("../Utils/ClientAppTestData.json"))
);

// Adding logging hooks for better test reporting
addLoggingHooks(test);

// Iterating through each set of test data
for (const data of dataset) {
  test("Order Recently Ordered Products", async ({ page }) => {
    logTestCaseStart("=>=>=> Order Recently Ordered Products. <=<=<=");

    // Navigate to the specified URL
    await page.goto(data.url);
    const poManager = new POManager(page);
    const dashboardPage = poManager.getDashBoardPage();

    logger.info("Signing in...");
    await dashboardPage.clickOnSignInLink();

    // Login with provided credentials
    const loginPage = poManager.getLoginPage();
    const heading = await loginPage.getCustomerLoginHeading();
    expect(heading?.trim()).toBe("Customer Login");
    await loginPage.validLogin(data.email, data.password);
    await page.waitForLoadState("networkidle");

    logger.info("User Signed in Succesfully!");

    // Navigate to My Account page
    await dashboardPage.NavigateToMyAccountPage();

    const myAccountsPage = poManager.getMyAccountsPage();
    await myAccountsPage.reOrder();
    
    const shoppingCartPage = poManager.getShoppingCartPage();
    await shoppingCartPage.updateCartForReOrder()
      

    await page.waitForTimeout(2000)
    await dashboardPage.proceedToCheckOutThroughMinicart();


    // Select Store Pickup option at checkout
    const orderSummaryPage = poManager.getOrderSummaryPage();
    logger.info("Selecting Store Pickup at checkout...");
    await orderSummaryPage.enableOrderTypeRadioBtn("Store Pickup");

    // Validate billing address and proceed to checkout
    logger.info("Validating address and proceeding to checkout...");
    await orderSummaryPage.checkBillingAddressThenProceedToCheckout(data.billingAddress);

    // Fill payment card details
    const paymentDetailsPage = poManager.getPaymentDetailsPage();
    logger.info("Filling payment card details...");
    await paymentDetailsPage.fillPaymentCardDetails();

    // Get the order number after successful payment
    const orderNo = await paymentDetailsPage.getPaymentSuccessOrderId();
    logger.info("Payment successful! Order number:", orderNo);

    // Extract entity ID from order number
    const entity_Id = String(orderNo).slice(6, orderNo.length);

    logTestCaseEnd(
      "=>=>=> Order Recently Ordered Products. <=<=<="
    );
  });
}
