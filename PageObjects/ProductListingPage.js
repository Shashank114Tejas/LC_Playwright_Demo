class ProductListingPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
  
    constructor(page) {
      this.page = page;
     
      this.allProductslistInsinglePage = page.locator("ol.products li");
      this.shoppingCartIcon=page.locator("a.action.showcart")
      this.shoppingCartCountLabel=page.locator("a.action.showcart span.counter-number")
      this.proceedToCheckoutBtn=page.locator("button#top-cart-btn-checkout")
      this.dynamicProductAddedMsg = page.locator('#custommessage:visible')
      this.paginationNextBtn=page.locator("ul.items a.action.next")
    }
  async getDynamicProductAddedMsg() {
    return await this.dynamicProductAddedMsg.textContent()
  }
  
  
  async addProductsToCartByName(productName_SameInApp) {
    let hasNextPage = true;
  
    while (hasNextPage) {
      const count = await this.allProductslistInsinglePage.count();
      console.log(count);
  
      for (let i = 0; i < count; ++i) {
        const productName = await this.allProductslistInsinglePage.nth(i).locator("strong > a").textContent();
        const pName = productName?.trim();
  
        if (pName.includes(productName_SameInApp)) {
          await this.allProductslistInsinglePage.nth(i).locator("button").click();
          const msg = await this.getDynamicProductAddedMsg();
  
          if (msg.includes(`You added ${productName_SameInApp} to your shopping cart.`)) {
            console.log(`${productName_SameInApp} added in cart`);
            return; // exit the function if product is added
          } else {
            console.log("The requested qty is not available");
          }
        }
      }
  
      // Check for pagination next button
      hasNextPage = await this.paginationNextBtn.isVisible();
  
      // If next page exists, click on it
      if (hasNextPage) {
        await this.paginationNextBtn.click();
      }
    }
  
    console.log(`Product ${productName_SameInApp} not found on any page.`);
  }
  



       async proceedToCheckout() {
          this.shoppingCartIcon.click();
          this.proceedToCheckoutBtn.click()
        }

       
        

 
}
export{ProductListingPage};