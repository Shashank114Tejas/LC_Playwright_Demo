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
        test("Edit User Firstname And Lastname", async ({ page }) => {
            
            test.info().annotations.push({
                type: 'Description',
                description: `This test case edits the user's first name and last name on the account page. It involves:
                - Navigating to the specified URL.
                - Signing in with the provided credentials.
                - Navigating to the My Account page.
                - Retrieving the current first name, last name, and email.
                - Logging the current first name and last name.
                - Editing the first name and last name.
                - Retrieving the updated first name and last name.
                - Logging the updated first name and last name.
                - Asserting that the updated first name and last name match the expected values.`
            });

            logTestCaseStart("=>=>=> Edit User Firstname And Lastname. <=<=<=");

            // Step: Navigate to the specified URL
            await test.step("Navigate to the specified URL", async () => {
                await page.goto(data.url);
            });

            const poManager = new POManager(page);
            const dashboardPage = poManager.getDashBoardPage();
            await test.step("Login with valid credentials", async () => {
                logger.info("Signing in...");
                await dashboardPage.clickOnSignInLink();
    
                // Login with provided credentials
                const loginPage = poManager.getLoginPage();
                const heading = await loginPage.getCustomerLoginHeading();
                expect(heading?.trim()).toBe("Customer Login");
                await loginPage.validLogin(data.email, data.password);
                await page.waitForLoadState("networkidle");
    
                logger.info("User Signed in Succesfully!");
                          });
          
            // Step: Navigate to My Account page
            await test.step("Navigate to My Account page", async () => {
                await dashboardPage.NavigateToMyAccountPage();
            });

            const myAccountsPage = poManager.getMyAccountsPage();
            
            // Step: Retrieve current first name, last name, and email
            await test.step("Retrieve current first name, last name, and email", async () => {
                const [firstname, lastname] = await myAccountsPage.getMyAccountFirstNameLastNameEmail();
                logger.info(`Before editing account firstname, lastname is --> ${firstname} ${lastname}`);            });
           

            // Step: Edit first name and last name
            await test.step("Edit first name and last name", async () => {
                await myAccountsPage.editMyAccountFirstNameAndLastName();
            });

            // Step: Retrieve updated first name and last name
            await test.step("Retrieve updated first name, last name, ", async () => {
            const [firstName, lastName] = await myAccountsPage.getMyAccountFirstNameLastNameEmail();
                logger.info(`After editing account firstname, lastname is --> ${firstName} ${lastName}`);
                 // Step: Assert that updated first name and last name match expected values
            await test.step("Assert that updated first name and last name match expected values", async () => {
                expect(["QARemo", "John"]).toContain(firstName);
                expect(["Sys", "Doe"]).toContain(lastName);
            });
                
            });
            
            
            logTestCaseEnd("=>=>=> Edit User Firstname And Lastname. <=<=<=");

        })
    }

});
