import { test, expect } from "@playwright/test";
import { POManager } from "../PageObjects/POManager";
import { addLoggingHooks } from "../Utils/TestUtils";

const dataset = JSON.parse(
  JSON.stringify(require("../Utils/ClientAppTestData.json"))
);
addLoggingHooks(test);
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
    console.log(
      "Store info is being displayed as : Josephs Beverage Center-test, 4129 Talmadge RD, Toledo, Ohio, 43623"
    );
    console.log();
    expect(
      await dashboardPage.getMerchantphoneHoursDeliveryLocator()
    ).toContainText(
      "(631) 494-3506 Open from 9:00 am to 6:00 pm • Store-Pickup • Delivery"
    );
    console.log();
    console.log(
      "Merchant's phone and hours info is being displayed as : (631) 494-3506 Open from 9:00 am to 6:00 pm"
    );
    // expect(await dashboardPage.getEmptyCartText()).toBe("You have no items in your shopping cart.")
    console.log();
    expect(await dashboardPage.isLogoVisible()).toBeTruthy();
    console.log("Logo is displayed on the homepage of the application");
    console.log();

    expect(await dashboardPage.isShoppingCartIconVisible()).toBeTruthy();
    console.log("Shopping Cart icon is displayed");
    console.log();

    expect(
      await dashboardPage.isLogoFunctionalityWorkingFine(data.url)
    ).toBeTruthy();
    console.log("Logo functionality is working fine");
    console.log();

    expect(
      await dashboardPage.isAccountFunctionalityWorkingFine()
    ).toBeTruthy();
    console.log(
      "The Account functions is not functioning properly as it is  displayed on the homepage for users who are not logged in."
    );
    console.log();

    //validating cart functionality when no product is added
    const emptyCartText = await dashboardPage.getEmptyCartText();
    expect(emptyCartText).toBe("You have no items in your shopping cart.");
    console.log();
    console.log(
      "Shopping cart functionality is working fine when no product is added"
    );

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
    console.log();

    // expect(await dashboardPage.validateHiGuestTextPresent()).toBe("Hi, Guest")

    expect(await dashboardPage.isSignOutFunctionalityWorkingFine()).toBeTruthy;
    console.log("Sign out functionality is working fine, User is logged out");
    console.log();

    console.log("Congratulations!! All Header Validation is Successful");
  });
}
