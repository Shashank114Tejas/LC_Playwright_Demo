/*This test case validates the purchase flow on an e-commerce platform. It involves:
                - Logging in with valid credentials.
                - Adding multiple products to the cart from an Excel sheet.
                - Proceeding to checkout, opting for store pickup.
                - Entering payment details and completing the purchase.
                - Verifying the order details on the My Orders page.
                - Confirming the order and checking the updated status on My Account page. */

import { test, expect } from "@playwright/test";
import { POManager } from "../PageObjects/POManager";
import { ExcelReader } from "../Utils/ExcelReader";
import { addLoggingHooks } from "../Utils/TestUtils";
import { logger, logTestCaseStart, logTestCaseEnd } from "../Utils/Logger";

test.describe("Test Case Title", () => {
  // Loading test data from a JSON file
  const dataset = JSON.parse(
    JSON.stringify(require("../Utils/ClientAppTestData.json"))
  );

  // Adding logging hooks for better test reporting
  addLoggingHooks(test);

  // Iterating through each set of test data
  for (const data of dataset) {
    test("Purchase Flow with Store Pickup and Order Confirmation.", async ({
      page,
    }) => {
      test.info().annotations.push({
        type: "Description",
        description: `This test case validates the purchase flow on an e-commerce platform. It involves:
                - Logging in with valid credentials.
                - Adding multiple products to the cart from an Excel sheet.
                - Proceeding to checkout, opting for store pickup.
                - Entering payment details and completing the purchase.
                - Verifying the order details on the My Orders page.
                - Confirming the order and checking the updated status on My Account page.`,
      });

      logTestCaseStart(
        "=>=>=> Purchase Flow with Store Pickup and Order Confirmation. <=<=<="
      );

      await test.step("Navigate to the application URL", async () => {
        await page.goto(data.url);
        logger.info(`Navigating to URL: ${data.url}`);
      });

      const poManager = new POManager(page);
      const dashboardPage = poManager.getDashBoardPage();

      await test.step("Sign in to the application", async () => {
        logger.info("Signing in...");
        await dashboardPage.clickOnSignInLink();
        const loginPage = poManager.getLoginPage();
        const heading = await loginPage.getCustomerLoginHeading();
        logger.info(` Verifying login page heading: ${heading.trim()}`);
        await loginPage.validLogin(data.email, data.password);
        await page.waitForLoadState("networkidle");
        logger.info("User signed in successfully!");
      });

      const excelReader = new ExcelReader("LC_Workbook.xlsx");
      await excelReader.loadWorkbook();
      const sheetName = "ValidUserStorePickupList";
      const excelData = await excelReader.getData(sheetName);

      await test.step("Add products to the cart from Excel data", async () => {
        logger.info("Adding products to the cart from Excel data...");
        for (const data1 of excelData) {
          await dashboardPage.navigateAndAddProductsToCart(data1);
        }
        logger.info("All available products added to the cart");
      });

      const productListingPage = poManager.getProductListingPage();
      await test.step("Proceed to checkout", async () => {
        logger.info("Proceeding to checkout...");
        await dashboardPage.proceedToCheckOutThroughMinicart();
      });

      const orderSummaryPage = poManager.getOrderSummaryPage();
      await test.step("Select Store Pickup option at checkout", async () => {
        logger.info("Selecting Store Pickup at checkout...");
        await orderSummaryPage.enableOrderTypeRadioBtn("Store Pickup");
      });

      await test.step("Validate billing address and proceed to checkout", async () => {
        logger.info("Validating address and proceeding to checkout...");
        await orderSummaryPage.checkBillingAddressThenProceedToCheckout(
          data.billingAddress
        );
      });

      const paymentDetailsPage = poManager.getPaymentDetailsPage();
      await test.step("Fill payment card details", async () => {
        logger.info("Filling payment card details...");
        await paymentDetailsPage.fillPaymentCardDetails();
      });

      const orderNo =
        await test.step("Get the order number after successful payment", async () => {
          const orderNo = await paymentDetailsPage.getPaymentSuccessOrderId();
          logger.info("Payment successful! Order number:", orderNo);
          return orderNo;
        });

      const entity_Id = String(orderNo).slice(6, orderNo.length);

      const myOrdersPage = poManager.getMyOrdersPage();
      const expectedItemsData =
        await test.step("Navigate to My Orders page and extract order details", async () => {
          logger.info(
            "Navigating to My Orders page and extracting order and pricing details..."
          );
          await paymentDetailsPage.navigateToMyOrdersPage();
          return await myOrdersPage.extractOrderedItemDetailsDataMyOrdersPage();
        });

      let expectedPricing;
      await test.step("Extract pricing details from My Orders page", async () => {
        expectedPricing =
          await myOrdersPage.extractOrderedItemsPricingDataMyOrdersPage();
        await dashboardPage.NavigateToMyAccountPage();
      });

      let beforeActionStatus;
      const myAccountsPage = poManager.getMyAccountsPage();

      beforeActionStatus =
        await test.step("Check status before confirmation", async () => {
          logger.info("Checking before/after status from My Accounts Page...");
          const beforeActionStatus = await myAccountsPage.checkOrderStatus(
            orderNo
          );
          logger.info(`Before action status: ${beforeActionStatus}`);
          expect(beforeActionStatus).toBe("Processing");
          return beforeActionStatus;
        });

      const confirmationPage = poManager.getConfirmationPage();
      const actualItemsData = await test.step("Confirm order", async () => {
        logger.info("Confirming order...");
        return await confirmationPage.navigateToConfirmationPageAndPerformAction(
          entity_Id,
          "confirm"
        );
      });

      await test.step("Validate order data", async () => {
        logger.info("Validating order data...");
        const isValid = await myOrdersPage.validateOrderData(
          expectedItemsData,
          actualItemsData
        );
        if (isValid) {
          logger.info("Data validation successful!");
        } else {
          logger.info("Data validation failed!");
        }
        expect(isValid).toBeTruthy();
      });

      await test.step("Validate pricing data", async () => {
        logger.info("Validating pricing details...");
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
        expect(isPricingValid).toBeTruthy();
      });

      await test.step("Reload page for next iteration", async () => {
        await new Promise((resolve) => setTimeout(resolve, 7000));
        await page.reload();
        await dashboardPage.NavigateToMyAccountPage();
      });

      await test.step("Check status after confirmation", async () => {
        const afterActionStatus = await myAccountsPage.checkOrderStatus(
          orderNo
        );
        logger.info(`After action status: ${afterActionStatus}`);
        await expect(
          afterActionStatus,
          `Order status is not as expected: ${afterActionStatus}`
        ).toBe("Confirmed");
      });

      logger.info("Congratulations! Order successfully placed.");
      logTestCaseEnd(
        "=>=>=> Purchase Flow with Store Pickup and Order Confirmation. <=<=<="
      );
    });
  }
});
