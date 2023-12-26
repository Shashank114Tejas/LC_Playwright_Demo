// @ts-check
import { test, expect } from '@playwright/test';

test('check title', async ({ page }) => {
  await page.goto('https://qa-josephsbeverage-teststore.epicommercestore.com/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Home page");
});

const dataset = JSON.parse(
  JSON.stringify(require("../Utils/ClientAppTestData.json"))
);

for (const data of dataset) {
test.only('Valid Login, Adding products to cart and checkout', async ({ page }) => {
  await page.goto( data.url);

  // Click the Sign In link.
  await page.locator('div.panel.header .header.links li.link.authorization-link a').click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();

await page.locator(".control>#email").fill(data.username);
await page.locator(".control>#pass").first().fill(data.password);
await page.locator("button#send2").first().click()
// await page.pause()

await page.locator("nav.navigation>ul#ui-id-1 li.level0.nav-7>a>span").first().hover();
await page.locator("li.level0.nav-7 li.level1.nav-7-10>a>span").click();

 const products=page.locator("ol.products li");
  await page.locator("ol.products>li strong>a").last().waitFor();
  const count = await products.count();
  console.log(count);

  console.log(await products.locator("strong>a").allTextContents());

  for (let i = 9; i < count; ++i) {
   
   const text=await products.nth(i).locator("strong>a").textContent();
   const anotherText=text?.trim();
   console.log(anotherText);
   console.log(text);
  
   
    if (anotherText==('RED BULL DRAGON FRUIT 12OZ')||anotherText==('RED BULL DRAGON FRUIT 8.4OZ')) 
    {
      await products.nth(i).locator(" button").click();
      console.log(await products.nth(i).locator("strong>a").textContent()+"Selected");
      
    }
  }
  await page.locator("a.action.showcart span.counter-number").hover();

 const cartQty= await page.locator("a.action.showcart span.counter-number").textContent()
 const actualQty=cartQty?.trim();
  expect(actualQty).toEqual("2");


    // await page.pause()
  await page.locator("div.field.search input#search").type(" SKU 811538010580");
  await page.locator("div.actions button[type=submit]").first().click();
  const name =await page.locator("div.product.details a").textContent();
  const actualName=name?.trim();
  console.log(actualName);
  expect(actualName).toBe("KRAKEN BLACK SPICED RUM - 5488F");
  await page.locator("div.product.details button").click();

  await page.waitForTimeout(4000)

 
  await page.waitForSelector("a.action.showcart span.counter-label")
  await page.locator("a.action.showcart span.counter-number").hover()
  const cartQty2 = await page
   .locator("a.action.showcart span.counter-number")
   .textContent();
   const actualQty2 = cartQty2?.trim();
   console.log(actualQty2);
  //  await page.pause()
   expect(actualQty2).toEqual("3")

 await page.locator("a.action.showcart span.counter-label").click();
 await page.locator("button#top-cart-btn-checkout").click();
 await page.locator("button.button.action.continue.primary").waitFor();
 await page.locator("input[value=flatrate_flatrate]").click();
 const addressText=await page.locator("div.shipping-address-items>div").nth(1).textContent();
 console.log(addressText);
 await page.locator("button.action.action-select-shipping-item>span").nth(1).click();
 await page.locator("button.button.action.continue.primary").click();
 await page.locator("input[name=billing-address-same-as-shipping]").uncheck();
 await page.locator("div.field.field-select-billing div.control>select").selectOption({label:"QARemo Sys, 8607 Co Rd 30, Iberia, Ohio 43623, United States"})
 await page.locator("button.action.action-update").click();
 await page.locator("div.actions-toolbar button.action.primary.checkout").click();
 await page.locator("button#btnSubmit").waitFor()
 await page.screenshot({path:"Screenshots/Beforescreenshot.png"})
 await page.frameLocator('iframe[name="tx_iframe_tokenExIframeDiv"]').getByLabel('Data').fill("4111 1111 1111 1111 ");
 await page.locator(" input[name=name]").fill("Sonal Kashyap",{timeout:1000});
 await page.frameLocator('iframe[name="tx_iframe_cvv_iframe-cvc"]').getByLabel('CVV').fill("123");
 await page.locator('#expiry').pressSequentially("1224",{delay:100})
 await page.screenshot({path:"Screenshots/Afterscreenshot.png"})

 await page.pause()


})};