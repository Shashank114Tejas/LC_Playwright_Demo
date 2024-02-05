//  @ts-check
import { test, expect } from "@playwright/test";
import { POManager } from "../PageObjects/POManager";
import { addLoggingHooks } from "../Utils/TestUtils";


//passing data from Json Object
const dataset = JSON.parse(
  JSON.stringify(require("../Utils/ClientAppTestData.json"))
);

 addLoggingHooks(test)
for (const data of dataset) {
    test("Edit User Firstname And Lastname", async ({
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

        await dashboardPage.NavigateToMyAccountPage();

        const myAccountsPage = poManager.getMyAccountsPage();
        console.log();
        
        const [firstname, lastname] = await myAccountsPage.getMyAccountFirstNameLastNameEmail();
        console.log();

        console.log(`Before editing account firstname,lastname is --> ${firstname} ${lastname}`);
        console.log();

        await myAccountsPage.editMyAccountFirstNameAndLastName()

        const [firstName, lastName] = await myAccountsPage.getMyAccountFirstNameLastNameEmail();
        console.log();
        console.log(`After editing account firstname,lastname is --> ${firstName} ${lastName}`);
        expect(["QARemo", "John"]).toContain(firstName);
        expect(["Sys","Doe"]).toContain(lastName);


      



    })
}
