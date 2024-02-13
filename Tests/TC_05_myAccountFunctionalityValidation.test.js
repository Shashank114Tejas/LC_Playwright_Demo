/*
This test case edits the user's first name and last name on the account page. It involves:
- Navigating to the specified URL.
- Signing in with the provided credentials.
- Navigating to the My Account page.
- Retrieving the current first name, last name, and email.
- Logging the current first name and last name.
- Editing the first name and last name.
- Retrieving the updated first name and last name.
- Logging the updated first name and last name.
- Asserting that the updated first name and last name match the expected values.
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
    test("Edit User Firstname And Lastname", async ({
        page,
    }) => {
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
        console.log();
        
        // Retrieve current first name, last name, and email
        const [firstname, lastname] = await myAccountsPage.getMyAccountFirstNameLastNameEmail();
        console.log();
        console.log(`Before editing account firstname, lastname is --> ${firstname} ${lastname}`);
        console.log();

        // Edit first name and last name
        await myAccountsPage.editMyAccountFirstNameAndLastName();

        // Retrieve updated first name and last name
        const [firstName, lastName] = await myAccountsPage.getMyAccountFirstNameLastNameEmail();
        console.log();
        console.log(`After editing account firstname, lastname is --> ${firstName} ${lastName}`);

        // Assert that updated first name and last name match expected values
        expect(["QARemo", "John"]).toContain(firstName);
        expect(["Sys","Doe"]).toContain(lastName);
    })
}
