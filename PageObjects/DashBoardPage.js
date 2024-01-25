import { log } from 'console';


class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.signInLink = page.locator("div.panel.header .header.links li.link.authorization-link a");
    this.menuItemsLocator = '[role="menuitem"][name="${name}"]';
    this.allhrefs = page.locator("nav.navigation ul#ui-id-1>li"); //13
    this.searchBarSKU = page.locator("div.field.search input#search");
    this.searchBarSKUseachIcon = page.locator("div.actions button[type=submit]").first();
    this.allProductsList = page.locator("ol.products li");
    this.logo = page.locator("a[title=LiquorCart]>img");
    this.dynamicProductAddedMsg = page.locator('#custommessage:visible')
    this.allProductslistInsinglePage = page.locator("ol.products li");
    this.paginationNextBtn = page.locator("ul.items a.action.next")
    this.headerAccountLink = page.locator("header.page-header ul.header.links li.link.my-account-link>a")
    this.merchantNameAddressHeader = page.locator("div.merchant-nameAddress")
    this.merchantphoneHoursDeliveryHeader = page.locator("div.merchant-phoneHoursDeliveryOptions")
    this.merchantphnHoursAddressHeader=page.getByRole('banner')
    this.shoppingCartIcon=page.locator("a.action.showcart")
    this.shoppingCartCountLabel=page.locator("a.action.showcart span.counter-number")
    this.proceedToCheckoutBtn = page.locator("button#top-cart-btn-checkout")
    this.accountLink = page.locator("header.page-header li.link.my-account-link a")
    this.signOutLink=page.locator("div.panel.header li.link.authorization-link a")
    this.myAccountPageHeader = page.locator("div.page-title-wrapper h1>span")
    this.hiGuestText = page.locator("div.panel.header span.not-logged-in")
    this.empytCartPopuptext = page.locator("div.panel.header div.block-content strong")
    this.closeEmptyCartPopup=page.locator("div.panel.header div.block-content button#btn-minicart-close")


  }

  async clickOnSignInLink() {
    await this.signInLink.click();
  }

  async getEmptyCartText() {
    await this.shoppingCartIcon.click()
    const text = await this.empytCartPopuptext.textContent()
    return text;
  }
  
  async validateHiGuestTextPresent() {
   return await this.hiGuestText.textContent()
  }
  async getMerchantNameAndAddress(){
   return this.merchantNameAddressHeader.allInnerTexts()
  }
  async getMerchantphoneHoursDeliveryLocator() {
    return this.merchantphnHoursAddressHeader;
  }
  async isLogoVisible() {
   return this.logo.isVisible()
  }
  async isShoppingCartIconVisible() {
    return this.shoppingCartIcon.isVisible()
  }

  async isLogoFunctionalityWorkingFine(expectedUrl) { 
    if (this.logo.isEnabled()) {
      await this.logo.click();
      if (this.page.url() === expectedUrl)
        return true;
    }
    return false;
  }
 
  async isAccountFunctionalityWorkingFine() {
    if (this.accountLink.isEnabled()) {
      await this.accountLink.click();
      if (await this.myAccountPageHeader.textContent() === 'Customer Login'|| await this.myAccountPageHeader.textContent()==='My Account') {
        return true;
      }
        return false;
    }
  }
  async isSignOutFunctionalityWorkingFine() {
    if (this.signOutLink.isEnabled()) {
      await this.signOutLink.click();
      if (this.page.url().includes("logoutSuccess")) {
        return true;
      }
      else return false;

   }
 }

  async getDynamicSuccessfulProductAddedMsg() {
    try {
      const successmsg = await this.dynamicProductAddedMsg.textContent();
      if (successmsg != null) {
        return successmsg;
      } else {
        console.log("No message found");
        return null; 
      }
    } catch (error) {
      console.error("Catch block: Item qty not available");
      return null;
    }
  }
  
  async assertDynamicProductAddedMsg(productName) {
    const successfulProductAddedMsg = await this.getDynamicSuccessfulProductAddedMsg();
     return (successfulProductAddedMsg).includes(`You added ${productName} to your shopping cart.`);
  }
  
  async addProductsToCartByNames(productName) {
    let hasNextPage = true;
  
    while (hasNextPage) {
      const count = await this.allProductslistInsinglePage.count();
      
  
      for (let i = 0; i < count; ++i) {
        const productNameElement = await this.allProductslistInsinglePage
          .nth(i)
          .locator("strong > a");
        const productNameText = await productNameElement.textContent();
        const trimmedProductName = productNameText?.trim();
  
        if (trimmedProductName.includes(productName)) { 
          const currentURL = await this.page.url();
          await this.allProductslistInsinglePage.nth(i).locator("button").click();
          await this.page.waitForTimeout(2000)
          const newURL = await this.page.url();
           console.log(currentURL,newURL);
          if (currentURL !== newURL) {
            console.log("Item qty not available, skipping this product");
            return;
          }
          else {
          
            const msg = await this.getDynamicSuccessfulProductAddedMsg();
         
          
            if (msg) {
              if (msg.includes(`You added ${productName} to your shopping cart.`)) {
                console.log(`${productName} added in cart`);
  
                // Asserting the success message
                if(await this.assertDynamicProductAddedMsg(productName))
                return; // exit the function if the product is added
              } else {
                console.log("1st else block: The requested qty is not available");
              }
            } else {
              console.log("2nd else block: The requested qty is not available and I am on product listing page");
              // Exit the function if no message is found
              return;
            }
          }
        }
       
        }
  
        // Check for pagination next button
        hasNextPage = await this.paginationNextBtn.isVisible();
  
        // If the next page exists, click on it
        if (hasNextPage) {
          await this.paginationNextBtn.click();
        }
      }
  
      console.log(`Product ${productName} not found on any page.`);
    }
  
  




  // Updated hoverOnCategoryAndThenClickOnSubCategory method
  async navigateAndAddProductsToCart(data) {
    const { CategoryName, SubCategoryName, ProductName } = data;
    console.log(`Data received: ${JSON.stringify(data)}`);
    console.log(`Checking categoryName: ${JSON.stringify(CategoryName)}`);
    console.log(`Checking subcategoryName: ${JSON.stringify(SubCategoryName)}`);
    console.log(`Checking productName: ${JSON.stringify(ProductName)}`);

    const count = await this.allhrefs.count();
    // console.log(`Number of Categories: ${count}`); 
  
    for (let i = 0; i < count; i++) {
      const href = await this.allhrefs
        .nth(i)
        .locator("a")
        .first()
        .getAttribute("href");
  
      if (href) {
        // console.log(`Checking category: ${href}`); 
        const lastIndex = JSON.stringify(data.CategoryName).indexOf(JSON.stringify(data.CategoryName).length - 1);
        // console.log(href.includes((JSON.stringify(data.CategoryName).slice(1,lastIndex).toLowerCase())));

         if (href.trim().includes((JSON.stringify(data.CategoryName).slice(1,lastIndex).toLowerCase().trim()))){
          console.log(`Category matched: ${JSON.stringify(data.CategoryName).toLowerCase()}`); 
  
          await this.allhrefs.nth(i).locator("a").first().hover();
  
          const isCategoryExpanded = await this.page
            .locator("ul[aria-expanded=true]")
            .getAttribute("aria-expanded");
  
          if (isCategoryExpanded === "true") {
            console.log("Category is expanded"); 
  
            const subCategoryList = this.page.locator(
              "ul[aria-expanded=true]>li"
            );
            const subcategoryCount = await subCategoryList.count();
  
            let subcategoryFound = false;
  
            for (let j = 0; j < subcategoryCount; j++) {
              const subcategoryText = await subCategoryList
                .nth(j)
                .locator("a>span")
                .innerText();
  
              if (subcategoryText.toLowerCase() === `${JSON.stringify(SubCategoryName).replace(/"/g, '')}`.toLowerCase()) {
                console.log(`Subcategory matched:${JSON.stringify(SubCategoryName)}`); 
  
                await subCategoryList.nth(j).locator("span").click();
                subcategoryFound = true;
                break;
              }
            }
  
            if (!subcategoryFound) {
              console.log("Subcategory not found, clicking on the category");
              await this.allhrefs.nth(i).locator("a").first().click();
            }
            await this.addProductsToCartByNames(`${JSON.stringify(ProductName)}`.replace(/"/g, '')); 
             break;
          }
        }
      }
    }
  }
  
  
 
  
  async NavigateToMyAccountPage() {
   this.headerAccountLink.click()
 }


  async findAndAddProductToCartUsingSKU(SKU_Value) {
    await this.searchBarSKU.fill(SKU_Value);
    await this.searchBarSKUseachIcon.click();
    if ((await this.allProductsList.count()) > 0) {
      await this.allProductsList.locator("button").click();
      try {
        const successmsg = getDynamicSuccessfulProductAddedMsg()
        if (successmsg != null)
          console.log(successmsg);
      }
      catch (error) {
        console.error("Item qty not available");
        throw new Error("Item qty not available");
      }
      console.log("product added by SKU Value");
    } else {
      console.log(`Did not found any product with the SKU value ${SKU_Value}`);
    }
  }
}
export { DashboardPage };
