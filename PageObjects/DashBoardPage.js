import { log } from "console";
import { parse } from "path";

class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.signInLink = page.locator(
      "div.panel.header .header.links li.link.authorization-link a"
    );
    //this.allCategoryList=page.locator("nav.navigation>ul>li")
    this.menuItemsLocator = '[role="menuitem"][name="${name}"]';
    this.allhrefs = page.locator("ul#ui-id-1>li"); //13
    this.searchBarSKU = page.locator("div.field.search input#search");
    this.searchBarSKUseachIcon = page
      .locator("div.actions button[type=submit]")
      .first();
    this.allProductsList = page.locator("ol.products li");
    this.logo = page.locator("a[title=LiquorCart]>img");
  }

  async clickOnSignInLink() {
    await this.signInLink.click();
  }

  async hoverOnCategoryAndThenClickOnSubCategory(
    categoryName,
    subcategoryName
  ) {
    const count = await this.allhrefs.count();

    for (let i = 0; i < count; i++) {
      const href = await this.allhrefs
        .nth(i)
        .locator("a")
        .first()
        .getAttribute("href");

      if (href.includes(categoryName.toLowerCase())) {
        await this.allhrefs.nth(i).locator("a").first().hover();

        const isCategoryExpanded = await this.page
          .locator("ul[aria-expanded=true]")
          .getAttribute("aria-expanded");

        if (isCategoryExpanded === "true") {
          const subCategoryList = await this.page.locator(
            "ul[aria-expanded=true]>li"
          );
          const subcategoryCount = await subCategoryList.count();

          let subcategoryFound = false;

          for (let j = 0; j < subcategoryCount; j++) {
            const subcategoryText = await subCategoryList
              .nth(j)
              .locator("a>span")
              .innerText();

            if (subcategoryText === subcategoryName) {
              await subCategoryList.nth(j).locator("span").click();
              subcategoryFound = true;
              break;
            }
          }

          if (!subcategoryFound) {
            console.log("Subcategory not found, clicking on the category");
            await this.allhrefs.nth(i).locator("a").first().click();
          }
        }
      }
    }
  }

  async findAndAddProductToCartUsingSKU(SKU_Value) {
    await this.searchBarSKU.fill(SKU_Value);
    await this.searchBarSKUseachIcon.click();
    if ((await this.allProductsList.count()) > 0) {
      await this.allProductsList.locator("button").click();
      console.log("product added by SKU Value ");
    } else {
      console.log(`Did not found any product with the SKU value ${SKU_Value}`);
    }
  }
}
export { DashboardPage };
