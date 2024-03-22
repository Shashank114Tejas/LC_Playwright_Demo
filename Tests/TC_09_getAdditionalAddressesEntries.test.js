/*
These test cases involve retrieving additional addresses entries from the user's address book.
 The flow includes:
- Navigating to the specified URL.
- Signing in with the provided credentials.
- Navigating to the My Account page.
- Navigating to the Address Book page.
- Retrieving additional address entries in the second test case.
- Logging the additional address entries.
*/

// Importing necessary dependencies and utilities
// Importing necessary dependencies and utilities
import { test, expect } from "@playwright/test";
import { POManager } from "../PageObjects/POManager";
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
    test("Get Additional Addresses Entries", async ({ page }) => {
    
      test.info().annotations.push({
        type: 'Description',
        description: `These test cases involve retrieving additional addresses entries from the user's address book.
      The flow includes:
      - Navigating to the specified URL.
      - Signing in with the provided credentials.
      - Navigating to the My Account page.
      - Navigating to the Address Book page.
      - Retrieving additional address entries.
      - Logging the additional address entries.`
      });

      logTestCaseStart("=>=>=> Get Additional Addresses Entries. <=<=<=");

      // Step: Navigate to the specified URL
      await test.step("Navigate to the specified URL", async () => {
        await page.goto(data.url);
        logger.info(`Navigated to URL: ${data.url}`);
      });

      const poManager = new POManager(page);
      const dashboardPage = poManager.getDashBoardPage();

      // Step: Signing in
      await test.step("Signing in", async () => {
        logger.info("Signing in...");
        await dashboardPage.clickOnSignInLink();

        // Login with provided credentials
        const loginPage = poManager.getLoginPage();
        const heading = await loginPage.getCustomerLoginHeading();
        expect(heading?.trim()).toBe("Customer Login");
        await loginPage.validLogin(data.email, data.password);
        await page.waitForLoadState("networkidle");
      });

      // Step: Navigate to My Account page
      await test.step("Navigate to My Account page", async () => {
        await dashboardPage.NavigateToMyAccountPage();
      });

      const myAccountsPage = poManager.getMyAccountsPage();
      const addressBookPage = poManager.getMyAddressbookPage();

      // Step: Navigate to Address Book page
      await test.step("Navigate to Address Book page", async () => {
        await myAccountsPage.navigateToAddressBookPage();
      });

      // Step: Retrieve additional address entries
      await test.step("Retrieve additional address entries", async () => {
        const additionalAddresses = await addressBookPage.getAdditionalAddressesEntries();
        logger.info(`Additional addresses: ${additionalAddresses}`);
      });

      logTestCaseEnd("=>=>=> Get Additional Addresses Entries. <=<=<=");
    });
  }

});
