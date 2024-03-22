import { test, expect } from "@playwright/test";
import { POManager } from "../PageObjects/POManager";
import { addLoggingHooks } from "../Utils/TestUtils";
import { logger, logTestCaseStart, logTestCaseEnd } from "../Utils/Logger";

// Loading test data from a JSON file
const dataset = JSON.parse(
  JSON.stringify(require("../Utils/ClientAppTestData.json"))
);

// Adding logging hooks for better test reporting
addLoggingHooks(test);

test.describe("Test Case Title", () => {
  // Common setup outside the loop
  logTestCaseStart("=>=>=>UI Validation <=<=<=");

  // Iterating through each set of test data
  for (const data of dataset) {
    test(`Visual comparison `, async ({ page }) => {
      test.info().annotations.push({
        type: "Description",
        description: `Thinking`,
      });
      const poManager = new POManager(page);
      await page.pause();

      try {
        // Navigate to the LandingPage
        await test.step("LandingPage", async () => {
          await page.goto(data.url);
          expect(await page.screenshot({ fullPage: true })).toMatchSnapshot("LandingPage.png");
        });

        // Navigate to the LoginPage
        await test.step("LoginPage", async () => {
          const dashboardPage = poManager.getDashBoardPage();
          await dashboardPage.clickOnSignInLink();
          expect(await page.screenshot({ fullPage: true })).toMatchSnapshot("LoginPage.png");
        });

        // Login and navigate to the DashboardPage
        await test.step("DashboardPage", async () => {
          const loginPage = poManager.getLoginPage();
          await loginPage.validLogin(data.email, data.password);
          expect(await page.screenshot({ fullPage: true })).toMatchSnapshot("DashboardPage.png");
        });

        // Navigate to the MyAccountPage
        await test.step("MyAccountPage", async () => {
          const dashboardPage = poManager.getDashBoardPage();
          await dashboardPage.NavigateToMyAccountPage();
          expect(await page.screenshot({ fullPage: true })).toMatchSnapshot("MyAccountPage.png");
        });
           // Navigate to the AddressBookPage
        await test.step("AddressBookPage", async () => {
            const myAccountsPage = poManager.getMyAccountsPage();
            await myAccountsPage.navigateToAddressBookPage();
            expect(await page.screenshot({ fullPage: true })).toMatchSnapshot("AddressBookPage.png");
          });
          
          
      } catch (error) {
        // Handle errors
        logger.error(`An error occurred: ${error}`);
      } finally {
        logTestCaseEnd("=>=>=> Order Recently Ordered Products. <=<=<=");
      }
    });
  }
});
