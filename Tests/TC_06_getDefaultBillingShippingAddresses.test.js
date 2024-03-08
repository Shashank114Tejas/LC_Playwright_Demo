/*
These test cases involve retrieving default billing/shipping addresses entries from the user's address book.
 The flow includes:
- Navigating to the specified URL.
- Signing in with the provided credentials.
- Navigating to the My Account page.
- Navigating to the Address Book page.
- Retrieving default billing and shipping addresses in the first test case.
- Logging the default billing and shipping addresses.
*/

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
        test("Get Default Billing/Shipping Addresses", async ({ page }) => {
            
            test.info().annotations.push({
                type: 'Description',
                description: `This test involves retrieving default billing/shipping addresses entries from the user's address book.
                The flow includes:
                - Navigating to the specified URL.
                - Signing in with the provided credentials.
                - Navigating to the My Account page.
                - Navigating to the Address Book page.
                - Retrieving default billing and shipping addresses in the first test case.
                - Logging the default billing and shipping addresses.`
            });

            logTestCaseStart("=>=>=> Get Default Billing/Shipping Addresses. <=<=<=");

            // Step: Navigate to the specified URL
            await test.step("Navigate to the specified URL", async () => {
                await page.goto(data.url);
            });

            const poManager = new POManager(page);
            const dashboardPage = poManager.getDashBoardPage();

            logger.info("Signing in...");
            await test.step("login with valid credentials", async () => {
                await dashboardPage.clickOnSignInLink();

                // Login with provided credentials
                const loginPage = poManager.getLoginPage();
    
                const heading = await loginPage.getCustomerLoginHeading();
                expect(heading?.trim()).toBe("Customer Login");
                await loginPage.validLogin(data.email, data.password);
                await page.waitForLoadState("networkidle");
    
                logger.info("User Signed in Successfully!");
    
            });
           
            // Step: Navigate to My Account page
            await test.step("Navigate to My Account page", async () => {
                await dashboardPage.NavigateToMyAccountPage();
            });

            const myAccountsPage = poManager.getMyAccountsPage();
            await test.step("Navigate to My address page", async () => {
                await myAccountsPage.navigateToAddressBookPage();
            });
            const addressBookPage = poManager.getMyAddressbookPage();

            // Retrieve default billing and shipping addresses
            await test.step("Retrieve default billing and shipping addresses", async () => {
                const billingAddress = await addressBookPage.getDefaultBillingAddress();
                const shippingAddress = await addressBookPage.getDefaultShippingAddress();
    
                // Log default billing and shipping addresses
                logger.info(`Default Billing address is: ${billingAddress}`);
                logger.info(`Default Shipping address is: ${shippingAddress}`);            });
          

        });
    }
    logTestCaseEnd("=>=>=> Get Default Billing/Shipping Addresses. <=<=<=");


});
