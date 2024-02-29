/*
This test suite involves validating various functionalities related to the shopping cart, including:
1. Validating the quantities update functionality for products in the shopping cart at once.
2. Validating the remove functionality from the minicart by removing the first item.
3. Validating the remove functionality in the shopping cart by removing all products.

The test suite also utilizes session storage to store user login information for efficient testing.
*/

// Importing necessary dependencies and utilities
// @ts-check
import { test, expect } from "@playwright/test";
import { POManager } from "../PageObjects/POManager";
import { ExcelReader } from "../Utils/ExcelReader";
import { addLoggingHooks } from "../Utils/TestUtils";
import { logger, logTestCaseStart, logTestCaseEnd } from '../Utils/Logger';


// Variable to store the browser context with session storage
let webContext;

// Flag to check if session storage has been initialized
let sessionStorageInitialized = false;



// Loading test data from a JSON file
const dataset = JSON.parse(
  JSON.stringify(require("../Utils/ClientAppTestData.json"))
);

// Hook to perform actions before all tests run
test.beforeAll(async ({ browser }) => {
  webContext = await browser.newContext();
  if (!sessionStorageInitialized) {
    const page = await webContext.newPage();

    // Loop through each set of test data
    for (const data of dataset) {
      await page.goto(data.url);
      const poManager = new POManager(page);
      const dashboardPage = poManager.getDashBoardPage();

      logger.info("The user is signing in");
      await dashboardPage.clickOnSignInLink();

      const loginPage = poManager.getLoginPage();
      const heading = await loginPage.getCustomerLoginHeading();
      expect(heading?.trim()).toBe("Customer Login");

      await loginPage.validLogin(data.email, data.password);
      await page.waitForLoadState("networkidle");

      logger.info("User Signed in Successfully!");

      await page.waitForLoadState("networkidle");
      await webContext.storageState({ path: "state.json" });
      sessionStorageInitialized = true;
    }
  }
});

// Adding logging hooks for better test reporting
addLoggingHooks(test);

// Iterating through each set of test data
for (const data of dataset) {
  // Test case: Validate the quantities update functionality for products in the shopping cart at once
  test("Validate Quantities Update Functionality", async () => {
    logTestCaseStart("=>=>=> Purchase Flow with Delivery Option and Order Rejection. <=<=<=");

    const page = await webContext.newPage();
    await page.goto(data.url);
    const poManager = new POManager(page);
    const dashboardPage = poManager.getDashBoardPage();

    const excelReader = new ExcelReader("LC_Workbook.xlsx");
    await excelReader.loadWorkbook();
    const sheetName = "ShoppingCartSettingsList";
    const excelData = await excelReader.getData(sheetName);

    logger.info("Extracting data from excel and adding products to the cart");
    for (const data1 of excelData) {
      await dashboardPage.navigateAndAddProductsToCart(data1);
    }
    logger.info("All available products added in the cart");
    // Navigating to shopping cart
    await dashboardPage.navigateToShoppingCart();

    const shoppingCartPage = poManager.getShoppingCartPage();
    const beforeQtyUpdate = await shoppingCartPage.getGrandTotal();
    logger.info(beforeQtyUpdate);

    await shoppingCartPage.updateQuantitiesOfAllProducts();
    const afterQtyUpdate = await shoppingCartPage.getGrandTotal();
    logger.info(afterQtyUpdate);

    expect(Number(beforeQtyUpdate) === Number(afterQtyUpdate)).toBeFalsy();
    logger.info("All quantities are increased for products available in the cart");
    logTestCaseEnd("=>=>=> Validate Quantities Update Functionality. <=<=<=");

  });

  // Test case: Validating Remove functionality from minicart by removing first item
  test("Validate Remove Single Product From Minicart Functionality", async () => {
    logTestCaseStart("=>=>=> Validate Remove Single Product From Minicart Functionality. <=<=<=");

    const page = await webContext.newPage();
    await page.goto(data.url);
    const poManager = new POManager(page);
    const dashboardPage = poManager.getDashBoardPage();
    await dashboardPage.removeFirstItemFromMinicart();
    logger.info("Congratulation! first product has been removed from the cart. The remove button is working fine.");
    logTestCaseEnd("=>=>=> Validate Remove Single Product From Minicart Functionality. <=<=<=");

  });

  // Test case: Validating Remove Functionality in shopping cart
  test("Validate All Products Remove Functionality", async () => {
    logTestCaseStart("=>=>=> Validate All Products Remove Functionality. <=<=<=");

    const page = await webContext.newPage();
    await page.goto(data.url);
    const poManager = new POManager(page);
    const dashboardPage = poManager.getDashBoardPage();

    await dashboardPage.navigateToShoppingCart();
    const shoppingCartPage = poManager.getShoppingCartPage();
    await shoppingCartPage.removeAllProductsFromCart();
    expect(await shoppingCartPage.getEmptyCartTextAfterDeletion()).toBe("You have no items in your shopping cart.");
    logger.info("Congratulation! all products have been removed from the cart.");
    logTestCaseEnd("=>=>=> Validate All Products Remove Functionality. <=<=<=");

   
  });
}
