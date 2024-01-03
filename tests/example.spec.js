// @ts-check
import { test, expect } from "@playwright/test";
import { POManager } from "../PageObjects/POManager";

//passing data from Json Object
let webContext;
const dataset = JSON.parse(
  JSON.stringify(require("../Utils/ClientAppTestData.json"))
);
for (const data of dataset) {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(data.url);

    // Click the Sign In link.
    const poManager = new POManager(page);
    const dashboardPage = poManager.getDashBoardPage();
    await dashboardPage.clickOnSignInLink();

    // Expects page to have a heading with Customer Login.
    const loginPage = poManager.getLoginPage();
    const heading = await loginPage.getCustomerLoginHeading();
    expect(heading?.trim()).toBe("Customer Login");

    //valid login
    await loginPage.validLogin(data.email, data.password);
    await page.waitForLoadState("networkidle");
    await context.storageState({ path: "state.json" }); //Returns storage state for this browser context, contains current cookies and local storage snapshot.
    webContext = await browser.newContext({ storageState: "state.json" });
  });

  test("Navigate to login page", async ({}) => {
    const page = await webContext.newPage();
    await page.goto(data.url);
    await page.locator("a#ui-id-107").waitFor();
    // Click the Sign In link.
    const poManager = new POManager(page);
    const dashboardPage = poManager.getDashBoardPage();

    //  expect(await page.locator("li.greet.welcome>span").first().textContent()).toBe("Hi, QARemo!")

    //Hover on category and click on subcategory
    await dashboardPage.hoverOnCategoryAndThenClickOnSubCategory(
      "POP",
      "RED BULL"
    );

    //click on any product by name present on that page
    const productListingPage = poManager.getProductListingPage();

    await productListingPage.addProductsToCartByName(data.productName1);
    const successfulProductAddedMsg1 =
      await productListingPage.getDynamicProductAddedMsg();
    console.log(successfulProductAddedMsg1);

    expect(successfulProductAddedMsg1).toContain(
      `You added ${data.productName1} to your shopping cart.`
    );

    await dashboardPage.hoverOnCategoryAndThenClickOnSubCategory(
      "OH-LIQUOR",
      "BRANDY"
    );
    //   // "productName2":"RAYNAL NAPOLEON VSOP - 8354B",


    await productListingPage.addProductsToCartByName(data.productName2);

    const successfulProductAddedMsg2 =
      await productListingPage.getDynamicProductAddedMsg();
    console.log(successfulProductAddedMsg2);
    expect(successfulProductAddedMsg2).toContain(
      `You added ${data.productName2} to your shopping cart.`
    );

    //addidng product to cart using SKU value
    await dashboardPage.findAndAddProductToCartUsingSKU("859516004077");
    const skuProductSuccessMsg =
      await productListingPage.getDynamicProductAddedMsg();
    console.log(skuProductSuccessMsg);
    expect(skuProductSuccessMsg).toContain(
      `You added ${data.skuProductName} to your shopping cart.`
    );

    await productListingPage.proceedToCheckout();

    //selecting order type
    const orderSummaryPage = poManager.getOrderSummaryPage();
    await page.waitForTimeout(4000);
    await orderSummaryPage.enableOrderTypeRadioBtn("Flat Rate");
    await page.pause();

    //fetching all the addresses
    const allAddresses = page.locator("div.shipping-address-items>div");

    const allAddressesCount = await page
      .locator("div.shipping-address-items>div")
      .count();
    for (let i = 0; i < allAddressesCount; i++) {
      console.log(await allAddresses.nth(i).textContent());
    }

    //  await page.locator("button.action.action-select-shipping-item>span").nth(1).click();
    //  await page.locator("button.button.action.continue.primary").click();
    //  await page.locator("input[name=billing-address-same-as-shipping]").uncheck();
    //  await page.locator("div.field.field-select-billing div.control>select").selectOption({label:"QARemo Sys, 8607 Co Rd 30, Iberia, Ohio 43623, United States"})
    //  await page.locator("button.action.action-update").click();
    //  await page.locator("div.actions-toolbar button.action.primary.checkout").click();
    //  await page.locator("button#btnSubmit").waitFor()
    //  await page.screenshot({path:"Screenshots/Beforescreenshot.png"})
    //  await page.frameLocator('iframe[name="tx_iframe_tokenExIframeDiv"]').getByLabel('Data').fill("4111 1111 1111 1111 ");
    //  await page.locator(" input[name=name]").fill("Sonal Kashyap",{timeout:1000});
    //  await page.frameLocator('iframe[name="tx_iframe_cvv_iframe-cvc"]').getByLabel('CVV').fill("123");
    //  await page.locator('#expiry').pressSequentially("1224",{delay:100})
    //  await page.screenshot({path:"Screenshots/Afterscreenshot.png"})

    //  await page.pause()
  });
}
