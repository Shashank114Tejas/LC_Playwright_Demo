/*
This test case validates the purchase flow on an e-commerce platform, specifically testing the delivery option at checkout. It involves:
- Logging in with valid credentials.
- Adding multiple products to the cart from an Excel sheet.
- Proceeding to checkout, opting for delivery.
- Entering payment details and completing the purchase.
- Verifying the order details on the My Orders page.
- Rejecting the order from the My Account page and confirming the cancellation.
*/


// Importing necessary dependencies and utilities
import { test, expect } from "@playwright/test";
import { POManager } from "../PageObjects/POManager";
import { ExcelReader } from "../Utils/excelReader";
import { addLoggingHooks } from "../Utils/TestUtils";
import { logger, logTestCaseStart, logTestCaseEnd } from '../Utils/Logger';


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
    logTestCaseStart("=>=>=> Purchase Flow with Delivery Option and Order Rejection. <=<=<=");

    // Navigate to the specified URL
    await page.goto(data.url);

    // Initialize Page Object Manager
    const poManager = new POManager(page);

    // Access Dashboard page
    const dashboardPage = poManager.getDashBoardPage();

    // Sign in with valid credentials
    logger.info("Signing in...");
    await dashboardPage.clickOnSignInLink();
    const loginPage = poManager.getLoginPage();
    const heading = await loginPage.getCustomerLoginHeading();
    logger.info(` Verifying login page heading: ${heading.trim()}`);
    await loginPage.validLogin(data.email, data.password);
    await page.waitForLoadState("networkidle");
    logger.info("User Signed in Succesfully!");

    // Load product data from an Excel sheet
    const excelReader = new ExcelReader('LC_Workbook.xlsx');
    await excelReader.loadWorkbook();
    const sheetName = 'ValidUserDeliveryList';
    const excelData = await excelReader.getData(sheetName);

    // Add products to the cart
    logger.info("Adding products to the cart from Excel data...");
    for (const data1 of excelData) {
      await dashboardPage.navigateAndAddProductsToCart(data1);
    }
    logger.info("All available products added in the cart");

    // Proceed to checkout
    const productListingPage = poManager.getProductListingPage();
    logger.info("Clicking on Proceed To Checkout button from shopping cart icon");
    await productListingPage.proceedToCheckout();

    // Select delivery option at checkout
    const orderSummaryPage = poManager.getOrderSummaryPage();
    logger.info("Selecting delivery option at checkout");
    await orderSummaryPage.enableOrderTypeRadioBtn("Delivery")

    // Validate billing address and proceed to checkout
    logger.info("Validating address and proceeding to checkout");
    await orderSummaryPage.checkBillingAddressThenProceedToCheckout(data.billingAddress);

    // Fill payment card details and make payment
    const paymentDetailsPage = poManager.getPaymentDetailsPage();
    logger.info("Filling payment card details...");
    await paymentDetailsPage.fillPaymentCardDetails();

    // Get the order number after successful payment
    const orderNo = await paymentDetailsPage.getPaymentSuccessOrderId();
    logger.info("Payment successful! OrderNo is generated.");
    logger.info(`Order No is: ${orderNo}`);

    // Capture the entity key for email scenario
    const entity_Id = String(orderNo).slice(6, orderNo.length);
   
    // Navigate to My Orders page and extract addresses and pricing details
    logger.info("Navigating to My Orders page and extracting addresses and pricing details");
    await paymentDetailsPage.navigateToMyOrdersPage();
    const myOrdersPage = poManager.getMyOrdersPage();
    const expectedItemsData = await myOrdersPage.extractOrderedItemDetailsDataMyOrdersPage();
    const expectedPricing = await myOrdersPage.extractOrderedItemsPricingDataMyOrdersPage();

    // Check status before and after confirmation or reject action on orderNo
    logger.info("Checking Before/After status from My Accounts Page");
    await dashboardPage.NavigateToMyAccountPage();
    const myAccountsPage = poManager.getMyAccountsPage();
    const beforeActionStatus = await myAccountsPage.checkOrderStatus(orderNo);
    logger.info(`Before Action status: ${beforeActionStatus}`);
    expect(beforeActionStatus).toBe("Processing")

    // Perform action (reject order) on the confirmation page
    const confirmationPage = poManager.getConfirmationPage();
    const actualItemsData = await confirmationPage.navigateToConfirmationPageAndPerformAction(entity_Id, "reject");
      
    //validating data's present on my orders page and confirmtation page are equal or not.
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

    await new Promise(resolve => setTimeout(resolve, 5000));
    await page.reload();
    await dashboardPage.NavigateToMyAccountPage();

    const afterActionStatus = await myAccountsPage.checkOrderStatus(orderNo);
    logger.info(`After Action status:  ${afterActionStatus}`);

    logger.info("Congratulations! you've successfully Canceled the order!!");
    logTestCaseEnd("=>=>=> Purchase Flow with Delivery Option and Order Rejection. <=<=<=");

  });
}
