//  @ts-check
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
  test("Valid login and adding products to the cart and checkout by Store pickup", async ({
    page,
  }) => {
    await page.goto(data.url);
  const poManager = new POManager(page);
    const dashboardPage = poManager.getDashBoardPage();

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

    const excelReader = new ExcelReader('LC_Workbook.xlsx');
    await excelReader.loadWorkbook();
    const sheetName = 'ValidUserItemsList';
    const excelData = await excelReader.getData(sheetName);

    console.log("Extracting data from excel and adding products to the cart");
    console.log();
    for (const data1 of excelData) {
      await dashboardPage.navigateAndAddProductsToCart(data1);
    }
    console.log("available products added in the cart");
    console.log();

    // Proceed to checkout after iterating through all the test data
    const productListingPage = poManager.getProductListingPage();
    console.log("Clicking on Proceed To Checkout button from shopping cart icon");
    console.log();

    await productListingPage.proceedToCheckout();

    //selecting order type
    const orderSummaryPage = poManager.getOrderSummaryPage();
    console.log("selecting order type");
    console.log();

    await orderSummaryPage.enableOrderTypeRadioBtn("Store Pickup")

    //checking billing address and proceed to checkout
    console.log("validating address and proceeding to checkout");
    console.log();

    await orderSummaryPage.checkBillingAddressThenProceedToCheckout(
      data.billingAddress
    );

    const paymentDetailsPage = poManager.getPaymentDetailsPage();
    console.log("Entering card details");
    console.log();

    await paymentDetailsPage.fillPaymentCardDetails();

    const orderNo = await paymentDetailsPage.getPaymentSuccessOrderId();
    console.log("Payment successful!! orderNo is generated.");
    console.log(`Order No is: ${orderNo}`);
    console.log();


    //capturing the entity key for email scenario
    const entity_Id = String(orderNo).slice(6, orderNo.length);
   
    console.log("Navigating to My Orders page and extracting addresses and pricing details");
    console.log();

    await paymentDetailsPage.navigateToMyOrdersPage();
    const myOrdersPage = poManager.getMyOrdersPage();

    //extracting values and printing--------------------------------------->>>>>>>
    const expectedItemsData =
      await myOrdersPage.extractOrderedItemDetailsDataMyOrdersPage();

    // printing pricing details--------------------------------------->>>>>>>
    const expectedPricing =
      await myOrdersPage.extractOrderedItemsPricingDataMyOrdersPage();

    
    console.log("checking Before/After status from My Accounts Page");
    console.log();

    //navigating to MyAccount page
    await dashboardPage.NavigateToMyAccountPage();

    //checking status before and after after confirmation or reject action on orderNo
    const myAccountsPage = poManager.getMyAccountsPage();
    const beforeActionStatus = await myAccountsPage.checkOrderStatus(orderNo);
    console.log("Before Action status:" + beforeActionStatus);

    const confirmationPage = poManager.getConfirmationPage();
    const actualItemsData =
      await confirmationPage.navigateToConfirmationPageAndPerformAction(
        entity_Id,
        "confirm"
      );
      
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

    await page.waitForTimeout(5000);
    await page.reload();
    await dashboardPage.NavigateToMyAccountPage();

    const afterActionStatus = await myAccountsPage.checkOrderStatus(orderNo);
    console.log("After Action status:" + afterActionStatus);
    console.log();

    console.log("Congratulations you've successfully placed an order!!");
  });
}

//addidng product to cart using SKU value
// await dashboardPage.findAndAddProductToCartUsingSKU("859516004077");
// const skuProductSuccessMsg =
//   await productListingPage.getDynamicProductAddedMsg();
// console.log(skuProductSuccessMsg);
// expect(skuProductSuccessMsg).toContain(
//   `You added ${data.skuProductName} to your shopping cart.`
// );

// //fetching all the addresses
// const allAddresses = page.locator("div.shipping-address-items>div");

// const allAddressesCount = await page
//   .locator("div.shipping-address-items>div")
//   .count();
// for (let i = 0; i < allAddressesCount; i++) {
//   console.log(await allAddresses.nth(i).textContent());
// }

/**
 * 1. valid login and add products to cart and checkout ||Done
 * 2. guest user and add products to cart and checkout  ||Done
 * 3. valid login and add sku value products and checkout
 * 1. Search Panel ||P2
 * 2. Quick Checkout ||P1 Done
 * 3. Header Validation  ||P1 Done
 * 4. New User Registration||P2
 * 5. Menu  Validation ||P2
 * 6. Buy a product ||Done
 * 7. My account/edit/change password/ ||P2
 * 8. Cart Validation settings/edit ||P2
 *
 *
 */
