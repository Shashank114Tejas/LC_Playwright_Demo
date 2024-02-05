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
  async getDynamicProductAddedMsg() {//dynamic
    return await this.dynamicProductAddedMsg.textContent()
  }
  
  
  
  async proceedToCheckout() {
    await new Promise(resolve => setTimeout(resolve, 2000));

    await this.shoppingCartIcon.click();
    await this.proceedToCheckoutBtn.click();
    
    await this.page.waitForLoadState("domcontentloaded");
}


       
        

 
}
export{ProductListingPage};