/*
This test case validates the purchase flow on an e-commerce platform. It involves:
- Logging in with valid credentials.
- Adding multiple products to the cart from an Excel sheet.
- Proceeding to checkout, opting for store pickup.
- Entering payment details and completing the purchase.
- Verifying the order details on the My Orders page.
- Confirming the order and checking the updated status on My Account page.
*/

import { test, expect } from "@playwright/test";
import { POManager } from "../PageObjects/POManager";
import { ExcelReader } from "../Utils/excelReader";
import { addLoggingHooks } from "../Utils/TestUtils";


//passing data from Json Object
const dataset = JSON.parse(
  JSON.stringify(require("../Utils/ClientAppTestData.json"))
);

 addLoggingHooks(test)
 for (const data of dataset) {
  test("Purchase Flow with Store Pickup and Order Confirmation.", async ({
    page,
  }) => {
    // Navigate to the application URL
    await page.goto(data.url);
    console.log(`Navigating to URL: ${data.url}`);

    // Initialize Page Object Manager
    const poManager = new POManager(page);
    const dashboardPage = poManager.getDashBoardPage();

    // Sign in to the application
    console.log("Signing in...");
    await dashboardPage.clickOnSignInLink();
    const loginPage = poManager.getLoginPage();
    const heading = await loginPage.getCustomerLoginHeading();
    console.log("Verifying login page heading:", heading.trim());
    await loginPage.validLogin(data.email, data.password);
    await page.waitForLoadState("networkidle");
    console.log("User signed in successfully!");

    // Load test data from Excel
    const excelReader = new ExcelReader('LC_Workbook.xlsx');
    await excelReader.loadWorkbook();
    const sheetName = 'ValidUserStorePickupList';
    const excelData = await excelReader.getData(sheetName);

    // Add products to the cart from Excel data
    console.log("Adding products to the cart from Excel data...");
    for (const data1 of excelData) {
      await dashboardPage.navigateAndAddProductsToCart(data1);
    }
    console.log("All available products added to the cart");

    // Proceed to checkout
    const productListingPage = poManager.getProductListingPage();
    console.log("Proceeding to checkout...");
    await productListingPage.proceedToCheckout();

    // Select Store Pickup option at checkout
    const orderSummaryPage = poManager.getOrderSummaryPage();
    console.log("Selecting Store Pickup at checkout...");
    await orderSummaryPage.enableOrderTypeRadioBtn("Store Pickup");

    // Validate billing address and proceed to checkout
    console.log("Validating address and proceeding to checkout...");
    await orderSummaryPage.checkBillingAddressThenProceedToCheckout(data.billingAddress);

    // Fill payment card details
    const paymentDetailsPage = poManager.getPaymentDetailsPage();
    console.log("Filling payment card details...");
    await paymentDetailsPage.fillPaymentCardDetails();

    // Get the order number after successful payment
    const orderNo = await paymentDetailsPage.getPaymentSuccessOrderId();
    console.log("Payment successful! Order number:", orderNo);

    // Extract entity ID from order number
    const entity_Id = String(orderNo).slice(6, orderNo.length);

    // Navigate to My Orders page and extract order details
    console.log("Navigating to My Orders page and extracting addresses and pricing details...");
    await paymentDetailsPage.navigateToMyOrdersPage();
    const myOrdersPage = poManager.getMyOrdersPage();
    const expectedItemsData = await myOrdersPage.extractOrderedItemDetailsDataMyOrdersPage();
    const expectedPricing = await myOrdersPage.extractOrderedItemsPricingDataMyOrdersPage();

    // Check status before confirmation
    console.log("Checking before/after status from My Accounts Page...");
    await dashboardPage.NavigateToMyAccountPage();
    const myAccountsPage = poManager.getMyAccountsPage();
    const beforeActionStatus = await myAccountsPage.checkOrderStatus(orderNo);
    console.log("Before action status:", beforeActionStatus);
    expect(beforeActionStatus).toBe("Processing");

    // Confirm order
    const confirmationPage = poManager.getConfirmationPage();
    console.log("Confirming order...");
    const actualItemsData = await confirmationPage.navigateToConfirmationPageAndPerformAction(entity_Id, "confirm");

    // Validate order data
    console.log("Validating order data...");
    const isValid = await myOrdersPage.validateOrderData(expectedItemsData, actualItemsData);
    if (isValid) {
      console.log("Data validation successful!");
    } else {
      console.log("Data validation failed!");
    }

    // Validate pricing data
    console.log("Validating pricing details...");
    const isPricingValid = await myOrdersPage.validatePricingData(expectedPricing, actualItemsData, orderNo);
    if (isPricingValid) {
      console.log("Pricing validation successful!");
    } else {
      console.log("Pricing validation failed!");
    }

    // Reload page for next iteration
    await new Promise(resolve => setTimeout(resolve, 7000));
    await page.reload();
    await dashboardPage.NavigateToMyAccountPage();

    // Check status after confirmation
    const afterActionStatus = await myAccountsPage.checkOrderStatus(orderNo);
    console.log("After action status:", afterActionStatus);
    expect(afterActionStatus).toBe("Confirmed");

    console.log("Congratulations! Order successfully placed.");
  });
}


 


/**
 * 1. valid login and add products to cart and checkout ||Done
 * 2. guest user and add products to cart and checkout  ||Done

 * 1. Buy a product ||P1 Done
 * 2. Quick Checkout ||P1 Done
 * 3. Header Validation  ||P1 Done
 * 
 * 4. New User Registration||P2 || Captcha
 * 5. Menu  Validation ||P2 //In process
 * 6. Search Panel ||P2 
 * 7. My account/edit/change password/ ||P2 //recent orders/reorder
 * 8. Cart Validation settings/edit ||P2 //
 *
 *
 */
