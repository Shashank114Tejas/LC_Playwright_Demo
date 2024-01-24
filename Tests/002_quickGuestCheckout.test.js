import { test, expect } from "@playwright/test";
import { POManager } from "../PageObjects/POManager";
import { ExcelReader } from "../Utils/excelReader";
import { addLoggingHooks } from "../Utils/TestUtils";

const dataset = JSON.parse(
  JSON.stringify(require("../Utils/ClientAppTestData.json"))
);

addLoggingHooks(test)
for (const data of dataset) {
  test("Quick Guest Checkout by Flat Rate orderType", async ({ page }) => {
    await page.goto(data.url);
    await page.waitForLoadState("domcontentloaded");
    const poManager = new POManager(page);
    const dashboardPage = poManager.getDashBoardPage();

    await page.locator("a#ui-id-107").waitFor();

    const excelReader = new ExcelReader("LC_Workbook.xlsx");
    await excelReader.loadWorkbook();
    const sheetName = "GuestUserItemsList";
    const excelData = await excelReader.getData(sheetName);

    // Hover on category, click on subcategory (if present), Adding products to the cart 
    for (const data1 of excelData) {
      console.log("Extracting data from excel and adding products to the cart");
      console.log();

      await dashboardPage.navigateAndAddProductsToCart(data1);
      console.log("available products added in the cart");
      console.log();

    }

    // Proceed to checkout after iterating through all the test data
    const productListingPage = poManager.getProductListingPage();
    console.log("Clicking on Proceed To Checkout button from shopping cart icon");
    console.log();

    await productListingPage.proceedToCheckout();

   
    //Selecting orderType and adding billing or shipping address and checking out
    console.log("selecting order type radio button, adding addresses and checking out");
    console.log();

    const orderSummaryPage = poManager.getOrderSummaryPage();

    const sheetName2 = 'GuestUserBillingShippingAddress';
    const excelData2 = await excelReader.getData(sheetName2);
  for (const address of excelData2) {
    await orderSummaryPage.enableGuestUserOrderTypeRadioBtnAndCheckout(address);
    }
   

    const paymentDetailsPage = poManager.getPaymentDetailsPage();
    console.log("Entering card details");
    console.log();

    await paymentDetailsPage.fillPaymentCardDetails();
    const orderNo =
      await paymentDetailsPage.getGuestUserPaymentSuccessOrderID();
      console.log("Payment successful!! orderNo is generated.");
    console.log(`Order No is: ${orderNo}`);
    console.log();

    

    //capturing the entity key for email scenario
    const entity_Id = String(orderNo).slice(6, orderNo.length);
    console.log(entity_Id);

    console.log(
      `Congratulations you've successfully placed an order with orderId: ${orderNo}`
    );
  });
}
