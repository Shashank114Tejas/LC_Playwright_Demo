/*
This test case validates the purchase flow on an e-commerce platform. It involves:
- Logging in with valid credentials.
- Adding multiple products to the cart from an Excel sheet.
- Proceeding to checkout, opting for store pickup.
- Entering payment details and completing the purchase.
- Verifying the order details on the My Orders page.
- Confirming the order and checking the updated status on My Account page.
*/

// Importing necessary dependencies and utilities
import { test, expect } from "@playwright/test";
import { POManager } from "../PageObjects/POManager";
import { ExcelReader } from "../Utils/ExcelReader";
import { addLoggingHooks } from "../Utils/TestUtils";
import { logger, logTestCaseStart, logTestCaseEnd } from '../Utils/Logger';


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
    logTestCaseStart("=>=>=> Purchase Flow with Store Pickup and Order Confirmation. <=<=<=");
    // Navigate to the application URL
    await page.goto(data.url);
    logger.info(`Navigating to URL: ${data.url}`);

    // Initialize Page Object Manager
    const poManager = new POManager(page);
    const dashboardPage = poManager.getDashBoardPage();

    // Sign in to the application
    logger.info("Signing in...");
    await dashboardPage.clickOnSignInLink();
    const loginPage = poManager.getLoginPage();
    const heading = await loginPage.getCustomerLoginHeading();
    logger.info(` Verifying login page heading: ${heading.trim()}`);
    await loginPage.validLogin(data.email, data.password);
    await page.waitForLoadState("networkidle");
    logger.info("User signed in successfully!");

    // Load test data from Excel
    const excelReader = new ExcelReader('LC_Workbook.xlsx');
    await excelReader.loadWorkbook();
    const sheetName = 'ValidUserStorePickupList';
    const excelData = await excelReader.getData(sheetName);

    // Add products to the cart from Excel data
    logger.info("Adding products to the cart from Excel data...");
    for (const data1 of excelData) {
      await dashboardPage.navigateAndAddProductsToCart(data1);
    }
    logger.info("All available products added to the cart");

    // Proceed to checkout
    const productListingPage = poManager.getProductListingPage();
    logger.info("Proceeding to checkout...");
    await productListingPage.proceedToCheckout();

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

    // Navigate to My Orders page and extract order details
    logger.info("Navigating to My Orders page and extracting order and pricing details...");
    await paymentDetailsPage.navigateToMyOrdersPage();
    const myOrdersPage = poManager.getMyOrdersPage();
    const expectedItemsData = await myOrdersPage.extractOrderedItemDetailsDataMyOrdersPage();

    const expectedPricing = await myOrdersPage.extractOrderedItemsPricingDataMyOrdersPage();

    // Check status before confirmation
    logger.info("Checking before/after status from My Accounts Page...");
    await dashboardPage.NavigateToMyAccountPage();
    const myAccountsPage = poManager.getMyAccountsPage();
    const beforeActionStatus = await myAccountsPage.checkOrderStatus(orderNo);
    logger.info(`Before action status: ${beforeActionStatus}` );
    expect(beforeActionStatus).toBe("Processing");

    // Confirm order
    const confirmationPage = poManager.getConfirmationPage();
    logger.info("Confirming order...");
    const actualItemsData = await confirmationPage.navigateToConfirmationPageAndPerformAction(entity_Id, "confirm");

    // Validate order data
    logger.info("Validating order data...");
    const isValid = await myOrdersPage.validateOrderData(expectedItemsData, actualItemsData);
    if (isValid) {
      logger.info("Data validation successful!");
    } else {
      logger.info("Data validation failed!");
    }

    // Validate pricing data
    logger.info("Validating pricing details...");
    const isPricingValid = await myOrdersPage.validatePricingData(expectedPricing, actualItemsData, orderNo);
    if (isPricingValid) {
      logger.info("Pricing validation successful!");
    } else {
      logger.info("Pricing validation failed!");
    }

    // Reload page for next iteration
    await new Promise(resolve => setTimeout(resolve, 7000));
    await page.reload();
    await dashboardPage.NavigateToMyAccountPage();

    // Check status after confirmation
    const afterActionStatus = await myAccountsPage.checkOrderStatus(orderNo);
    logger.info(`After action status: ${afterActionStatus}`);
    expect(afterActionStatus).toBe("Confirmed");

    logger.info("Congratulations! Order successfully placed.");
    logTestCaseEnd("=>=>=> Purchase Flow with Store Pickup and Order Confirmation. <=<=<=");
  });
}
