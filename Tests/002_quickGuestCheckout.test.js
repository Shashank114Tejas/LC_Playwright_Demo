import { test, expect } from "@playwright/test";
import { POManager } from "../PageObjects/POManager";
import { ExcelReader } from "../Utils/excelReader";

const dataset = JSON.parse(
  JSON.stringify(require("../Utils/ClientAppTestData.json"))
);
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
      await dashboardPage.NavigateAndAddProductsToCart(data1);
    }

    // Proceed to checkout after iterating through all the test data
    const productListingPage = poManager.getProductListingPage();
    await productListingPage.proceedToCheckout();

   
    //Selecting orderType and adding billing or shipping address and checking out
    const orderSummaryPage = poManager.getOrderSummaryPage();

    const sheetName2 = 'GuestUserBillingShippingAddress';
    const excelData2 = await excelReader.getData(sheetName2);
  for (const address of excelData2) {
    await orderSummaryPage.enableGuestUserOrderTypeRadioBtnAndCheckout(address);
    }
   

    const paymentDetailsPage = poManager.getPaymentDetailsPage();
    await paymentDetailsPage.fillPaymentCardDetails();
    const orderNo =
      await paymentDetailsPage.getGuestUserPaymentSuccessOrderID();
    console.log(orderNo);

    //capturing the entity key for email scenario
    const entity_Id = String(orderNo).slice(6, orderNo.length);
    console.log(entity_Id);

    console.log(
      `Congratulations you've successfully placed an order with orderId: ${orderNo}`
    );
  });
}
