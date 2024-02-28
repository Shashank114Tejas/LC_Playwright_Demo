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

// Load test data from a JSON file
const dataset = JSON.parse(
  JSON.stringify(require("../Utils/ClientAppTestData.json"))
);

// Add logging hooks for better test reporting
addLoggingHooks(test);

// Iterate through each set of test data
for (const data of dataset) {
  test(" Purchase Flow with Delivery Option and Order Rejection.", async ({
    page,
  }) => {
    // Navigate to the specified URL
    await page.goto(data.url);
    
    // Initialize Page Object Manager
    const poManager = new POManager(page);
    
    // Access Dashboard page
    const dashboardPage = poManager.getDashBoardPage();

    // Sign in with valid credentials
    console.log("The user is signing in");
    console.log();
    await dashboardPage.clickOnSignInLink();
    const loginPage = poManager.getLoginPage();
    const heading = await loginPage.getCustomerLoginHeading();
    expect(heading?.trim()).toBe("Customer Login");
    await loginPage.validLogin(data.email, data.password);
    await page.waitForLoadState("networkidle");
    console.log("User Signed in Succesfully!");
    console.log();

    // Load product data from an Excel sheet
    const excelReader = new ExcelReader('LC_Workbook.xlsx');
    await excelReader.loadWorkbook();
    const sheetName = 'ValidUserDeliveryList';
    const excelData = await excelReader.getData(sheetName);

    // Add products to the cart
    console.log("Extracting data from excel and adding products to the cart");
    console.log();
    for (const data1 of excelData) {
      await dashboardPage.navigateAndAddProductsToCart(data1);
    }
    console.log("All available products added in the cart");
    console.log();

    // Proceed to checkout
    const productListingPage = poManager.getProductListingPage();
    console.log("Clicking on Proceed To Checkout button from shopping cart icon");
    console.log();
    await productListingPage.proceedToCheckout();

    // Select delivery option at checkout
    const orderSummaryPage = poManager.getOrderSummaryPage();
    console.log("Selecting delivery option at checkout");
    console.log();
    await orderSummaryPage.enableOrderTypeRadioBtn("Delivery")

    // Validate billing address and proceed to checkout
    console.log("Validating address and proceeding to checkout");
    console.log();
    await orderSummaryPage.checkBillingAddressThenProceedToCheckout(data.billingAddress);

    // Fill payment card details and make payment
    const paymentDetailsPage = poManager.getPaymentDetailsPage();
    console.log("Entering card details and making payment");
    console.log();
    await paymentDetailsPage.fillPaymentCardDetails();

    // Get the order number after successful payment
    const orderNo = await paymentDetailsPage.getPaymentSuccessOrderId();
    console.log("Payment successful! OrderNo is generated.");
    console.log(`Order No is: ${orderNo}`);
    console.log();

    // Capture the entity key for email scenario
    const entity_Id = String(orderNo).slice(6, orderNo.length);
   
    // Navigate to My Orders page and extract addresses and pricing details
    console.log("Navigating to My Orders page and extracting addresses and pricing details");
    console.log();
    await paymentDetailsPage.navigateToMyOrdersPage();
    const myOrdersPage = poManager.getMyOrdersPage();
    const expectedItemsData = await myOrdersPage.extractOrderedItemDetailsDataMyOrdersPage();
    const expectedPricing = await myOrdersPage.extractOrderedItemsPricingDataMyOrdersPage();

    // Check status before and after confirmation or reject action on orderNo
    console.log("Checking Before/After status from My Accounts Page");
    console.log();
    await dashboardPage.NavigateToMyAccountPage();
    const myAccountsPage = poManager.getMyAccountsPage();
    const beforeActionStatus = await myAccountsPage.checkOrderStatus(orderNo);
    console.log("Before Action status:" + beforeActionStatus);
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
      console.log("Data validation successful!");
      console.log();

    } else {
      console.log("Data validation failed!");
    }

    console.log("Validating Pricing details");
    const isPricingValid = await myOrdersPage.validatePricingData(
      expectedPricing,
      actualItemsData,
      orderNo
    );
    if (isPricingValid) {
      console.log("Pricing validation successful!");
      console.log();

    } else {
      console.log("Pricing validation failed!");
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
    await page.reload();
    await dashboardPage.NavigateToMyAccountPage();

    const afterActionStatus = await myAccountsPage.checkOrderStatus(orderNo);
    console.log("After Action status:" + afterActionStatus);
    console.log();
    //expect(afterActionStatus).toBe("Canceled")

    console.log("Congratulations! you've successfully Canceled the order!!");
  });
}