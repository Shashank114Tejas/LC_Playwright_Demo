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
    test("Get Default Billing/Shipping Addresses", async ({ page }) => {
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
        await myAccountsPage.navigateToAddressBookPage();
        const addressBookPage = poManager.getMyAddressbookPage();

        const billingAddress=await addressBookPage.getDefaultBillingAddress()
        const shippingAddress = await addressBookPage.getDefaultShippingAddress()
        
        console.log(`Default Billing address is :- ${billingAddress}`);
        console.log();
        console.log(`Default Shipping address is:- ${shippingAddress}`);
    })


    test("Get Additional Address Entries", async ({page}) => {
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
        await myAccountsPage.navigateToAddressBookPage();
        const addressBookPage = poManager.getMyAddressbookPage();

        const additionalAddresses = await addressBookPage.getAdditionalAddressesEntries();
        console.log(additionalAddresses);

})
}
