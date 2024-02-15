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

// Loading test data from a JSON file
const dataset = JSON.parse(
  JSON.stringify(require("../Utils/ClientAppTestData.json"))
);

// Adding logging hooks for better test reporting
addLoggingHooks(test);

// Iterating through each set of test data
for (const data of dataset) {
    test("Get Default Billing/Shipping Addresses", async ({ page }) => {
        // Navigate to the specified URL
        await page.goto(data.url);
        const poManager = new POManager(page);
        const dashboardPage = poManager.getDashBoardPage();

        console.log("The user is signing in");
        console.log();
        await dashboardPage.clickOnSignInLink();

        // Login with provided credentials
        const loginPage = poManager.getLoginPage();
        const heading = await loginPage.getCustomerLoginHeading();
        expect(heading?.trim()).toBe("Customer Login");
        await loginPage.validLogin(data.email, data.password);
        await page.waitForLoadState("networkidle");

        console.log("User Signed in Succesfully!");
        console.log();

        // Navigate to My Account page
        await dashboardPage.NavigateToMyAccountPage();

        const myAccountsPage = poManager.getMyAccountsPage();
        await myAccountsPage.navigateToAddressBookPage();
        const addressBookPage = poManager.getMyAddressbookPage();

        // Retrieve default billing and shipping addresses
        const billingAddress = await addressBookPage.getDefaultBillingAddress();
        const shippingAddress = await addressBookPage.getDefaultShippingAddress();

        // Log default billing and shipping addresses
        console.log(`Default Billing address is :- ${billingAddress}`);
        console.log();
        console.log(`Default Shipping address is:- ${shippingAddress}`);
    });


   
}
