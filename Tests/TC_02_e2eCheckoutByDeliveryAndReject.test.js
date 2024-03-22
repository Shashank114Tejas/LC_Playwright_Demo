/*
This test case validates the purchase flow on an e-commerce platform, specifically testing the delivery option at checkout. It involves:
- Logging in with valid credentials.
- Adding multiple products to the cart from an Excel sheet.
- Proceeding to checkout, opting for delivery.
- Entering payment details and completing the purchase.
- Verifying the order details on the My Orders page.
- Rejecting the order from the confirmation page and confirming the status as canceled .
*/

import { test, expect } from "@playwright/test";
import { POManager } from "../PageObjects/POManager";
import { ExcelReader } from "../Utils/ExcelReader";
import { addLoggingHooks } from "../Utils/TestUtils";
import { logger, logTestCaseStart, logTestCaseEnd } from "../Utils/Logger";

test.describe("Test Case Title", () => {
  // Load test data from a JSON file
  const dataset = JSON.parse(
    JSON.stringify(require("../Utils/ClientAppTestData.json"))
  );

  // Add logging hooks for better test reporting
  addLoggingHooks(test);

  // Iterate through each set of test data
  for (const data of dataset) {
    test("Purchase Flow with Delivery Option and Order Rejection.", async ({
      page,
    }) => {
      test.info().annotations.push({
        type: "Description",
        description: `This test case validates the purchase flow on an e-commerce platform, specifically testing the delivery option at checkout. It involves:
        - Logging in with valid credentials.
        - Adding multiple products to the cart from an Excel sheet.
        - Proceeding to checkout, opting for delivery.
        - Entering payment details and completing the purchase.
        - Verifying the order details on the My Orders page.
        - Rejecting the order from the confirmation page and confirming the status as canceled.`,
      });

      logTestCaseStart(
        "=>=>=> Purchase Flow with Delivery Option and Order Rejection. <=<=<="
      );

      await test.step("Navigate to the specified URL", async () => {
        await page.goto(data.url);
      });

      const poManager = new POManager(page);
      const dashboardPage = poManager.getDashBoardPage();

      await test.step("Sign in with valid credentials", async () => {
        logger.info("Signing in...");
        await dashboardPage.clickOnSignInLink();
        const loginPage = poManager.getLoginPage();
        const heading = await loginPage.getCustomerLoginHeading();
        logger.info(` Verifying login page heading: ${heading.trim()}`);
        await loginPage.validLogin(data.email, data.password);
        await page.waitForLoadState("networkidle");
        logger.info("User Signed in Succesfully!");
      });

      const excelReader = new ExcelReader("LC_Workbook.xlsx");
      await excelReader.loadWorkbook();
      const sheetName = "ValidUserDeliveryList";
      const excelData = await excelReader.getData(sheetName);

      await test.step("Add products to the cart", async () => {
        logger.info("Adding products to the cart from Excel data...");
        for (const data1 of excelData) {
          await dashboardPage.navigateAndAddProductsToCart(data1);
        }
        logger.info("All available products added in the cart");
      });

      const productListingPage = poManager.getProductListingPage();
      await test.step("Proceed to checkout", async () => {
        logger.info(
          "Clicking on Proceed To Checkout button from shopping cart icon"
        );
        await productListingPage.proceedToCheckout();
      });

      const orderSummaryPage = poManager.getOrderSummaryPage();
      await test.step("Select delivery option at checkout", async () => {
        logger.info("Selecting delivery option at checkout");
        await orderSummaryPage.enableOrderTypeRadioBtn("Delivery");
      });

      await test.step("Validate billing address and proceed to checkout", async () => {
        logger.info("Validating address and proceeding to checkout");
        await orderSummaryPage.checkBillingAddressThenProceedToCheckout(
          data.billingAddress
        );
      });

      const paymentDetailsPage = poManager.getPaymentDetailsPage();
      await test.step("Fill payment card details and make payment", async () => {
        logger.info("Filling payment card details...");
        await paymentDetailsPage.fillPaymentCardDetails();
      });

      let orderNo;
      await test.step("Get the order number after successful payment", async () => {
        orderNo = await paymentDetailsPage.getPaymentSuccessOrderId();
        logger.info("Payment successful! OrderNo is generated.");
        logger.info(`Order No is: ${orderNo}`);
      });

      const entity_Id = String(orderNo).slice(5, orderNo.length);
      let expectedItemsData;
      let expectedPricing;
      await test.step("Navigate to My Orders page and extract order derails and pricing details", async () => {
        await paymentDetailsPage.navigateToMyOrdersPage();
        const myOrdersPage = poManager.getMyOrdersPage();
        expectedItemsData =
          await myOrdersPage.extractOrderedItemDetailsDataMyOrdersPage();
        expectedPricing =
          await myOrdersPage.extractOrderedItemsPricingDataMyOrdersPage();
      });

      await test.step("Checking order status before rejecting", async () => {
        logger.info("Checking Before/After status from My Accounts Page");
        await dashboardPage.NavigateToMyAccountPage();
        const myAccountsPage = poManager.getMyAccountsPage();
        const beforeActionStatus = await myAccountsPage.checkOrderStatus(
          orderNo
        );
        logger.info(`Before Action status: ${beforeActionStatus}`);
        expect(beforeActionStatus).toBe("Processing");
      });

      await test.step("Perform action (reject order) on the confirmation page and validate order details and pricing.", async () => {
        const confirmationPage = poManager.getConfirmationPage();
        const actualItemsData =
          await confirmationPage.navigateToConfirmationPageAndPerformAction(
            entity_Id,
            "reject"
          );

        const myOrdersPage = poManager.getMyOrdersPage();
        const isValid = await myOrdersPage.validateOrderData(
          expectedItemsData,
          actualItemsData
        );
        if (isValid) {
          logger.info("Data validation successful!");
        } else {
          logger.info("Data validation failed!");
        }

        logger.info("Validating Pricing details");
        const isPricingValid = await myOrdersPage.validatePricingData(
          expectedPricing,
          actualItemsData,
          orderNo
        );
        if (isPricingValid) {
          logger.info("Pricing validation successful!");
        } else {
          logger.info("Pricing validation failed!");
        }
      });

      await test.step("Navigate to my accounts page and Check order status after rejecting", async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await page.reload();
        await dashboardPage.NavigateToMyAccountPage();
        const myAccountsPage = poManager.getMyAccountsPage();

        const afterActionStatus = await myAccountsPage.checkOrderStatus(
          orderNo
        );
        logger.info(`After Action status:  ${afterActionStatus}`);
        await expect.soft(
          afterActionStatus,
          `Order status is not as expected: ${afterActionStatus}`
        ).toBe("canceled");
      });

      logger.info("Congratulations! you've successfully Canceled the order!!");
      logTestCaseEnd(
        "=>=>=> Purchase Flow with Delivery Option and Order Rejection. <=<=<="
      );
    });
  }
});
