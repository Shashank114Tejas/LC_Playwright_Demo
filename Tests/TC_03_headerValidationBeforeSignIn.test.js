/*
This test case validates the header section of the homepage before user sign-in. It includes:
- Asserting header texts, such as merchant name, address, phone, hours, and delivery options.
- Checking the visibility and functionality of the logo, shopping cart icon, and account functions.
- Validating the behavior of the shopping cart when no products are added.
- Testing sign-in and sign-out functionalities.
*/

import { test, expect } from "@playwright/test";
import { POManager } from "../PageObjects/POManager";
import { addLoggingHooks } from "../Utils/TestUtils";
import { logger, logTestCaseStart, logTestCaseEnd } from "../Utils/Logger";

test.describe("Test Case Title", () => {
  // Loading test data from a JSON file
  const dataset = JSON.parse(
    JSON.stringify(require("../Utils/ClientAppTestData.json"))
  );


  // Adding logging hooks for better test reporting
  addLoggingHooks(test);


  // Iterating through each set of test data
  for (const data of dataset) {
    test("Header Validation on Homepage Before Sign-In.", async ({ page }) => {
      test.info().annotations.push({
        type: "Description",
        description: `This test case validates the header section of the homepage before user sign-in. It includes:\n
        - Asserting header texts, such as merchant name, address, phone, hours, and delivery options.\n
        - Checking the visibility and functionality of the logo, shopping cart icon, and account functions.\n
        - Validating the behavior of the shopping cart when no products are added.\n
        - Testing sign-in and sign-out functionalities.`,
      });

      logTestCaseStart(
        "=>=>=> Header Validation on Homepage Before Sign-In. <=<=<="
      );

      // Step 1: Navigate to the specified URL
      await test.step("Navigate to the specified URL", async () => {
        await page.goto(data.url);
        await page.waitForLoadState("domcontentloaded");
      });

      // Step 2: Initialize Page Object Manager
      const poManager = new POManager(page);
      const dashboardPage = poManager.getDashBoardPage();

      // Step 3: Assert header texts, logo presence, and functionalities
      await test.step("Assert header texts, logo presence, and functionalities", async () => {
        expect(
          await dashboardPage.getMerchantNameAndAddress(),
          "Merchant name and address mismatch"
        ).toStrictEqual([
          "Josephs Beverage Center-test\n\n4129 Talmadge RD\n\nToledo, Ohio, 43623",
        ]);
        logger.info(
          "Store info is being displayed as : Josephs Beverage Center-test, 4129 Talmadge RD, Toledo, Ohio, 43623"
        );

        expect(
          await dashboardPage.getMerchantphoneHoursDeliveryLocator(),
          "Phone and hours info mismatch"
        ).toContainText(
          "(631) 494-3506 Open from 9:00 am to 6:00 pm • Store-Pickup • Delivery"
        );
        logger.info(
          "Merchant's phone and hours info is being displayed as : (631) 494-3506 Open from 9:00 am to 6:00 pm"
        );

        expect(
          await dashboardPage.isLogoVisible(),
          "Logo is not displayed on the homepage"
        ).toBeTruthy();
        logger.info("Logo is displayed on the homepage of the application");

        expect(
          await dashboardPage.isShoppingCartIconVisible(),
          "Shopping Cart icon is not displayed"
        ).toBeTruthy();
        logger.info("Shopping Cart icon is displayed");

        expect(
          await dashboardPage.isLogoFunctionalityWorkingFine(data.url),
          "Logo functionality is not working as expected"
        ).toBeTruthy();
        logger.info("Logo functionality is working fine");

        expect(
          await dashboardPage.isAccountFunctionalityWorkingFine(),
          "Account functionality is working unexpectedly before login"
        ).toBeTruthy();
        logger.info(
          "The Account functions is not functioning properly as it is displayed on the homepage for users who are not logged in."
        );
      });

      // Step 4: Validate cart functionality when no product is added
      await test.step("Validate cart functionality when no product is added", async () => {
        const emptyCartText = await dashboardPage.getEmptyCartText();
        expect(emptyCartText,`Cart is not empty as expected: ${emptyCartText}`).toBe("You have no items in your shopping cart.");
        logger.info(
          "Shopping cart functionality is working fine when no product is added"
        );
      });

      // Step 5: Validate sign-in and sign-out functionalities
      await test.step("Validate sign-in and sign-out functionalities", async () => {
        await dashboardPage.clickOnSignInLink();
        const loginPage = poManager.getLoginPage();
        const heading = await loginPage.getCustomerLoginHeading();
        expect(heading?.trim(),`Heading mismatch : ${heading?.trim()}`).toBe("Customer Login");
        await loginPage.validLogin(data.email, data.password);
        await page.waitForLoadState("networkidle");
        logger.info("Sign in Functionality is working fine, User is logged in");

        expect(
          await dashboardPage.isSignOutFunctionalityWorkingFine(),`Sign-out functionality is not working as expected`
        ).toBeTruthy();
        logger.info(
          "Sign out functionality is working fine, User is logged out"
        );

        logger.info("Congratulations!! All Header Validation is Successful");
        logTestCaseEnd(
          "=>=>=> Header Validation on Homepage Before Sign-In <=<=<="
        );
      });
    });
  }
});
