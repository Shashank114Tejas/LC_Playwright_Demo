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
import { ExcelReader } from "../Utils/ExcelReader";
import { addLoggingHooks } from "../Utils/TestUtils";
import { logger, logTestCaseStart, logTestCaseEnd } from '../Utils/Logger';


test.describe("Test Case Title", () => {

    // Loading test data from a JSON file
    const dataset = JSON.parse(
        JSON.stringify(require("../Utils/ClientAppTestData.json"))
    );

    // Adding logging hooks for better test reporting
    addLoggingHooks(test);

    // Iterating through each set of test data
    for (const data of dataset) {
        test("Quick Guest Checkout with Delivery Order Type", async ({ page }) => {

            test.info().annotations.push({
                type: 'Description',
                description: `This test case performs a quick guest checkout using the flat rate order type. It involves:
                - Navigating to the homepage.
                - Adding products to the cart extracted from an Excel sheet.
                - Proceeding to checkout and selecting the order type.
                - Adding billing or shipping addresses from an Excel sheet and checking out.
                - Entering payment card details.
                - Capturing and logging the generated order number.
                - Confirming the successful placement of the order.`
            });

            logTestCaseStart("=>=>=> Quick Guest Checkout with Delivery Order Type. <=<=<=");

            // Step: Navigate to the specified URL
            await test.step("Navigate to the specified URL", async () => {
                await page.goto(data.url);
                await page.waitForLoadState("domcontentloaded");
            });

            // Initialize Page Object Manager
            const poManager = new POManager(page);
            const dashboardPage = poManager.getDashBoardPage();

            // Wait for the element to load
            await test.step("Wait for the element to load", async () => {
                await page.locator("a#ui-id-107").waitFor();
            });

            // Initialize Excel reader and load workbook
            const excelReader = new ExcelReader("LC_Workbook.xlsx");
            await excelReader.loadWorkbook();

            // Get data from the GuestUserItemsList sheet
            const sheetName = "GuestUserItemsList";
            const excelData = await excelReader.getData(sheetName);

            // Log info
            logger.info("Adding products to the cart from Excel data...");

            // Iterate through each product data and add them to the cart
            await test.step("Add products to the cart", async () => {
                for (const data1 of excelData) {
                    await dashboardPage.navigateAndAddProductsToCart(data1);
                }
                logger.info("Available products added in the cart");
            });

            // Proceed to checkout after adding products to the cart
            const productListingPage = poManager.getProductListingPage();
            await test.step("Proceed to checkout", async () => {
                logger.info("Clicking on Proceed To Checkout button from shopping cart icon");
                await productListingPage.proceedToCheckout();
            });

            // Initialize Order Summary Page
            const orderSummaryPage = poManager.getOrderSummaryPage();

            // Get data from the GuestUserBillingShippingAddress sheet
            const sheetName2 = 'GuestUserBillingShippingAddress';
            const excelData2 = await excelReader.getData(sheetName2);

            // Iterate through each address data and enable guest user order type radio button and checkout
            await test.step("Select order type, add addresses, and checkout", async () => {
                for (const address of excelData2) {
                    await orderSummaryPage.enableGuestUserOrderTypeRadioBtnAndCheckout(address);
                }
            });

            // Initialize Payment Details Page
            const paymentDetailsPage = poManager.getPaymentDetailsPage();

            // Fill payment card details and capture the order number
            await test.step("Fill payment card details and capture order number", async () => {
                logger.info("Filling payment card details...");
                await paymentDetailsPage.fillPaymentCardDetails();
                const orderNo = await paymentDetailsPage.getGuestUserPaymentSuccessOrderID();
                logger.info("Payment successful!! Order number is generated.");
                logger.info(`Order No is: ${orderNo}`);

                // Log the success message
                logger.info(`Congratulations you've successfully placed an order with orderId: ${orderNo}`);
            });

            logTestCaseEnd("=>=>=> Quick Guest Checkout with Delivery Order Type. <=<=<=");
        })
    }

});
