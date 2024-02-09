//  @ts-check
import { test, expect } from "@playwright/test";
import { POManager } from "../PageObjects/POManager";
import { ExcelReader } from "../Utils/excelReader";
import { addLoggingHooks } from "../Utils/TestUtils";



let webContext;
//passing data from Json Object
const dataset = JSON.parse(
  JSON.stringify(require("../Utils/ClientAppTestData.json"))
);

//This technique will login first and store a session storage for you and later on we can inject that data in our program
//alternative of webAPI injection choose based upon the project requirement
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  for (const data of dataset) {
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
 
    await page.waitForLoadState("networkidle");
    await context.storageState({ path: "state.json" });//Returns storage state for this browser context, contains current cookies and local storage snapshot.
     webContext = await browser.newContext({ storageState: "state.json" });
  }
});

 addLoggingHooks(test)
for (const data of dataset) {
  test("Validate the quantities update functionality for products in the shopping cart at once.", async () => {
    const page = await webContext.newPage();
    await page.goto(data.url)
    const poManager = new POManager(page);
    const dashboardPage = poManager.getDashBoardPage();

    const excelReader = new ExcelReader('LC_Workbook.xlsx');
    await excelReader.loadWorkbook();
    const sheetName = 'ShoppingCartSettingsList';
    const excelData = await excelReader.getData(sheetName);

    console.log("Extracting data from excel and adding products to the cart");
    console.log();
    for (const data1 of excelData) {
      await dashboardPage.navigateAndAddProductsToCart(data1);
    }
    console.log("All available products added in the cart");
    console.log();
    //Navigating to shopping cart
    await dashboardPage.navigateToShoppingCart();
    
    const shoppingCartPage = poManager.getShoppingCartPage();
    const beforeQtyUpdate = await shoppingCartPage.getGrandTotal()

    await shoppingCartPage.updateQuantitiesOfAllProducts()
    const afterQtyUpdate = await shoppingCartPage.getGrandTotal()

    expect((Number(beforeQtyUpdate)) === (Number(afterQtyUpdate))).toBeFalsy()
    console.log("All quantities are increased for products availble in the cart");
    console.log();
  });

  test("Validating Remove functionality from minicart by removing first item", async () => {
    const page = await webContext.newPage();
    await page.goto(data.url);
    const poManager = new POManager(page);
    const dashboardPage = poManager.getDashBoardPage();
    await dashboardPage.removeFirstItemFromMinicart()
    console.log("Congratulation! first product has been removed from the cart. The remove button is working fine.");
  })


  test("Validating Remove Functionality in shopping cart", async () => {
    const page = await webContext.newPage();
    await page.goto(data.url);
    const poManager = new POManager(page);
    const dashboardPage = poManager.getDashBoardPage();
    
    await dashboardPage.navigateToShoppingCart();
    const shoppingCartPage = poManager.getShoppingCartPage();
    await shoppingCartPage.removeAllProductsFromCart()
    expect(await shoppingCartPage.getEmptyCartTextAfterDeletion()).toBe("You have no items in your shopping cart.")
    console.log("Congratulation! all products has been removed from the cart.");
    await page.pause()

  })

 
}



