
import { test, expect } from '@playwright/test'
import { POManager } from '../PageObjects/POManager';


const dataset = JSON.parse(
    JSON.stringify(require("../Utils/ClientAppTestData.json"))
);
test.beforeAll(() => {
    console.log('=== Test Case Start ===');
  });

  test.afterAll(() => {
    console.log('=== Test Case Teardown ===');
  });

for (const data of dataset) {
    test("Header Validation on HomePage before sign-In", async ({ page }) => {
        await page.goto(data.url);
        await page.waitForLoadState("domcontentloaded");
        const poManager = new POManager(page);
        const dashboardPage = poManager.getDashBoardPage();

        //Asserting Header Texts, Logo Presence and Functionalities
        expect(await dashboardPage.getMerchantNameAndAddress()).toStrictEqual([
            "Josephs Beverage Center-test\n\n4129 Talmadge RD\n\nToledo, Ohio, 43623",
        ]);
        console.log("Store info is being displayed as : Josephs Beverage Center-test, 4129 Talmadge RD, Toledo, Ohio, 43623");
        expect(
            await dashboardPage.getMerchantphoneHoursDeliveryLocator()
        ).toContainText(
            "(631) 494-3506 Open from 9:00 am to 6:00 pm • Store-Pickup • Delivery"
        );
        console.log("Merchant's phone and hours info is being displayed as : (631) 494-3506 Open from 9:00 am to 6:00 pm");
        // expect(await dashboardPage.getEmptyCartText()).toBe("You have no items in your shopping cart.")
        expect(await dashboardPage.isLogoVisible()).toBeTruthy();
        console.log("Logo is displayed on the homepage of the application");

        expect(await dashboardPage.isShoppingCartIconVisible()).toBeTruthy();
        console.log("Shopping Cart icon is displayed");

        expect(
            await dashboardPage.isLogoFunctionalityWorkingFine(data.url)
        ).toBeTruthy();
        console.log("Logo functionality is working fine");

        expect(
            await dashboardPage.isAccountFunctionalityWorkingFine()
        ).toBeTruthy();
        console.log("The Account functions is not functioning properly as it is  displayed on the homepage for users who are not logged in.");
       
        //Validating Singing-In and Signing-Out functionalities
        await dashboardPage.clickOnSignInLink();
        // Expects page to have a heading with Customer Login.
        const loginPage = poManager.getLoginPage();
        const heading = await loginPage.getCustomerLoginHeading();
        expect(heading?.trim()).toBe("Customer Login");


        // valid login
        await loginPage.validLogin(data.email, data.password);
        await page.waitForLoadState("networkidle");
        console.log("Sign in Functionality is working fine, User is logged in");

        // expect(await dashboardPage.validateHiGuestTextPresent()).toBe("Hi, Guest")

        expect(await dashboardPage.isSignOutFunctionalityWorkingFine()).toBeTruthy;
        console.log("Sign out functionality is working fine, User is logged out");

        console.log("Congratulations!! All Header Validation is Successful");

    });
}