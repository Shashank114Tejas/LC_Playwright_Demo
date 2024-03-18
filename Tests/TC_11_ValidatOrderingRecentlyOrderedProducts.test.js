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

test.describe("Test Case Title", () => {
  // Iterating through each set of test data
  for (const data of dataset) {
    test("Order Recently Ordered Products", async ({ page }) => {
      test.info().annotations.push({
        type: 'Description',
        description: `This test case orders products that were recently ordered by the user. The flow includes:
          - Signing in with valid credentials.
          - Navigating to the My Account page.
          - Re-ordering products from the user's order history.
          - Updating the cart for re-ordering.
          - Proceeding to checkout with Store Pickup option.
          - Validating and proceeding with the billing address.
          - Filling payment card details.
          - Capturing the order number after successful payment.`
      });

      logTestCaseStart("=>=>=> Order Recently Ordered Products. <=<=<=");

      // Navigate to the specified URL
      await test.step("Navigate to the specified URL", async () => {
        await page.goto(data.url);
      });

      const poManager = new POManager(page);
      const dashboardPage = poManager.getDashBoardPage();

      logger.info("Signing in...");

      // Login with provided credentials
      await test.step("Login with provided credentials", async () => {
        await dashboardPage.clickOnSignInLink();
        const loginPage = poManager.getLoginPage();
        const heading = await loginPage.getCustomerLoginHeading();
        expect(heading?.trim(), "Heading on the login page is not as expected").toBe("Customer Login");
        await loginPage.validLogin(data.email, data.password);
        await page.waitForLoadState("networkidle");
        logger.info("User Signed in Successfully!");
      });

      // Navigate to My Account page
      await test.step("Navigate to My Account page", async () => {
        await dashboardPage.NavigateToMyAccountPage();
      });

      // Re-order products
      await test.step("Re-order products", async () => {
        const myAccountsPage = poManager.getMyAccountsPage();
        await myAccountsPage.reOrder();
      });

      // Update cart for re-ordering
      await test.step("Update cart for re-ordering", async () => {
        const shoppingCartPage = poManager.getShoppingCartPage();
         await shoppingCartPage.updateQuantitiesOfAllProducts()
      });

      // Proceed to checkout through mini cart
      await test.step("Proceed to checkout through mini cart", async () => {
        await dashboardPage.proceedToCheckOutThroughMinicart();
      });

      // Select Store Pickup option at checkout
      await test.step("Select Store Pickup at checkout", async () => {
        const orderSummaryPage = poManager.getOrderSummaryPage();
        logger.info("Selecting Store Pickup at checkout...");
        await orderSummaryPage.enableOrderTypeRadioBtn("Store Pickup");
      });

      // Validate billing address and proceed to checkout
      await test.step("Validate address and proceed to checkout", async () => {
        const orderSummaryPage = poManager.getOrderSummaryPage();
        logger.info("Validating address and proceeding to checkout...");
        await orderSummaryPage.checkBillingAddressThenProceedToCheckout(data.billingAddress);
      });

      // Fill payment card details
      await test.step("Fill payment card details", async () => {
        const paymentDetailsPage = poManager.getPaymentDetailsPage();
        logger.info("Filling payment card details...");
        await paymentDetailsPage.fillPaymentCardDetails();
      });

      // Get the order number after successful payment
      await test.step("Validating order number after successful payment", async () => {
        const paymentDetailsPage = poManager.getPaymentDetailsPage();
        const orderNo = await paymentDetailsPage.getPaymentSuccessOrderId();
        logger.info("Value of orderNo:", orderNo);
        console.log(orderNo);
        expect(orderNo, "orderNo is not generated after successful payment").toBeTruthy();
        logger.info("Payment successful! Order number:", orderNo);
        return orderNo;
      });
      

  

      logTestCaseEnd(
        "=>=>=> Order Recently Ordered Products. <=<=<="
      );
    });
  }
});
