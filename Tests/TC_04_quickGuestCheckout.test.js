/*
This test case performs a quick guest checkout using the flat rate order type. It involves:
- Navigating to the homepage.
- Adding products to the cart extracted from an Excel sheet.
- Proceeding to checkout and selecting the order type.
- Adding billing or shipping addresses from an Excel sheet and checking out.
- Entering payment card details.
- Capturing and logging the generated order number.
- Confirming the successful placement of the order.
*/


// Importing necessary dependencies and utilities
import { test, expect } from "@playwright/test";
import { POManager } from "../PageObjects/POManager";
import { ExcelReader } from "../Utils/excelReader";
import { addLoggingHooks } from "../Utils/TestUtils";

// Loading test data from a JSON file
const dataset = JSON.parse(
  JSON.stringify(require("../Utils/ClientAppTestData.json"))
);

// Adding logging hooks for better test reporting
addLoggingHooks(test);

// Iterating through each set of test data
for (const data of dataset) {
  test("Quick Guest Checkout by Flat Rate orderType", async ({ page }) => {
    // Navigate to the specified URL
    await page.goto(data.url);
    await page.waitForLoadState("domcontentloaded");

    // Initialize Page Object Manager
    const poManager = new POManager(page);
    const dashboardPage = poManager.getDashBoardPage();

    // Wait for the element to load
    await page.locator("a#ui-id-107").waitFor();

    // Initialize Excel reader and load workbook
    const excelReader = new ExcelReader("LC_Workbook.xlsx");
    await excelReader.loadWorkbook();

    // Get data from the GuestUserItemsList sheet
    const sheetName = "GuestUserItemsList";
    const excelData = await excelReader.getData(sheetName);

    console.log("Extracting data from excel and adding products to the cart");
    console.log();
    
    // Iterate through each product data and add them to the cart
    for (const data1 of excelData) {
      await dashboardPage.navigateAndAddProductsToCart(data1);
    }
    console.log("Available products added in the cart");
    console.log();

    // Proceed to checkout after adding products to the cart
    const productListingPage = poManager.getProductListingPage();
    console.log("Clicking on Proceed To Checkout button from shopping cart icon");
    console.log();
    await productListingPage.proceedToCheckout();

    // Initialize Order Summary Page
    const orderSummaryPage = poManager.getOrderSummaryPage();

    // Get data from the GuestUserBillingShippingAddress sheet
    const sheetName2 = 'GuestUserBillingShippingAddress';
    const excelData2 = await excelReader.getData(sheetName2);

    // Iterate through each address data and enable guest user order type radio button and checkout
    console.log("Selecting order type radio button, adding addresses and checking out");
    console.log();
    for (const address of excelData2) {
      await orderSummaryPage.enableGuestUserOrderTypeRadioBtnAndCheckout(address);
    }

    // Initialize Payment Details Page
    const paymentDetailsPage = poManager.getPaymentDetailsPage();

    // Fill payment card details and capture the order number
    console.log("Entering card details");
    console.log();
    await paymentDetailsPage.fillPaymentCardDetails();
    const orderNo = await paymentDetailsPage.getGuestUserPaymentSuccessOrderID();
    console.log("Payment successful!! Order number is generated.");
    console.log(`Order No is: ${orderNo}`);
    console.log();

    // Log the success message
    console.log(
      `Congratulations you've successfully placed an order with orderId: ${orderNo}`
    );
  });
}
