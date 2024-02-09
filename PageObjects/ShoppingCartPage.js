class ShoppingCartPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
  
    constructor(page) {
      this.page = page;
        this.allAddedProductslist = page.locator("table#shopping-cart-table tr.item-info") 
        this.updateShoppingCartBtn = page.locator("div.cart.main.actions button[name=update_cart_action]>span")
        this.orderTotal = page.locator("div.cart-summary td.amount>strong>span")
        this.firstProductRemovebtn = page.locator("tr.item-actions a[title='Remove item']").first()
        this.noItemsInCartText=page.locator("div.cart-empty>p").first()
    }

    async updateQuantitiesOfAllProducts() {
        for (let i = 0; i <await  this.allAddedProductslist.count(); i++) {
            const inputField = this.allAddedProductslist.nth(i).locator("input");
            await inputField.click();
            await inputField.clear();
            await inputField.fill(String(i + 2));
        }
        await this.updateShoppingCartBtn.click();
        await this.page.waitForEvent("load")
    }
    
    async getGrandTotal() {
        const total = await this.orderTotal.textContent()
        return total.replace("$", "")
    }

    async removeAllProductsFromCart() {
        let count = await this.allAddedProductslist.count();
        while (count !== null && count !== 0) {
            await this.firstProductRemovebtn.click();
            count = await this.allAddedProductslist.count(); // Update count after removing a product
        }

        
    }
    async getEmptyCartTextAfterDeletion() {
            return this.noItemsInCartText.textContent()
    }
    
}
export{ ShoppingCartPage};