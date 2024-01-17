
import { test, expect } from '@playwright/test'
import { POManager } from '../PageObjects/POManager';


const dataset = JSON.parse(
    JSON.stringify(require("../Utils/ClientAppTestData.json"))
  );
for (const data of dataset) {
    test("Header validation", async ({ page }) => {
        await page.goto(data.url);
        await page.waitForLoadState("domcontentloaded");
        const poManager = new POManager(page);
        const dashboardPage = poManager.getDashBoardPage();

        //Asserting Header Texts, Logo Presence and Functionalities
        expect(await dashboardPage.getMerchantNameAndAddress()).toStrictEqual([
            "Josephs Beverage Center-test\n\n4129 Talmadge RD\n\nToledo, Ohio, 43623",
        ]);
        expect(
            await dashboardPage.getMerchantphoneHoursDeliveryLocator()
        ).toContainText(
            "(631) 494-3506 Open from 9:00 am to 6:00 pm • Store-Pickup • Delivery"
        );
        // expect(await dashboardPage.getEmptyCartText()).toBe("You have no items in your shopping cart.")
        expect(await dashboardPage.isLogoVisible()).toBeTruthy();
        expect(await dashboardPage.isShoppingCartIconVisible()).toBeTruthy();
        expect(
            await dashboardPage.isLogoFunctionalityWorkingFine(data.url)
        ).toBeTruthy();
        expect(
            await dashboardPage.isAccountFunctionalityWorkingFine()
        ).toBeTruthy();

        //Validating Singing-In and Signing-Out functionalities
        await dashboardPage.clickOnSignInLink();

        // Expects page to have a heading with Customer Login.
        const loginPage = poManager.getLoginPage();
        const heading = await loginPage.getCustomerLoginHeading();
        expect(heading?.trim()).toBe("Customer Login");

        // valid login
        await loginPage.validLogin(data.email, data.password);
        await page.waitForLoadState("networkidle");
        // expect(await dashboardPage.validateHiGuestTextPresent()).toBe("Hi, Guest")

        expect(await dashboardPage.isSignOutFunctionalityWorkingFine()).toBeTruthy;
        console.log("Congratulations All Header Validation is Successful");
    });
}