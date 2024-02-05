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
  test("Valid Login, add items to cart, opt for Delivery at checkout, and reject the order", async ({
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
    const sheetName = 'ValidUserDeliveryList';
    const excelData = await excelReader.getData(sheetName);

    console.log("Extracting data from excel and adding products to the cart");
    console.log();
    for (const data1 of excelData) {
      await dashboardPage.navigateAndAddProductsToCart(data1);
    }
    console.log("All available products added in the cart");
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

    await orderSummaryPage.enableOrderTypeRadioBtn("Delivery")
    //checking billing address and proceed to checkout
    console.log();
    console.log("validating address and proceeding to checkout");
    console.log();

    await orderSummaryPage.checkBillingAddressThenProceedToCheckout(
      data.billingAddress
    );

    const paymentDetailsPage = poManager.getPaymentDetailsPage();
    console.log("Entering card details and making payment");
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
    expect(beforeActionStatus).toBe("Processing")


    const confirmationPage = poManager.getConfirmationPage();
    const actualItemsData =
      await confirmationPage.navigateToConfirmationPageAndPerformAction(
        entity_Id,
        "reject"
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
    expect(afterActionStatus).toBe("Canceled")

    console.log("Congratulations! you've successfully Canceled the order!!");
  });
}