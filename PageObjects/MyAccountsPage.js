class MyAccountsPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    /**
     * Generates a confirmation page URL and performs an action.
    *
    * @param {string} entityId - The ID of the entity.
    * @param {'confirm' | 'reject'} action - The action to perform.
    */

  
    constructor(page) {
        this.page = page;
        this.viewAllOrdersLink = page.locator("div.block-title.order a.action.view>span")
        this.allOrdersRowInsinglePage = page.locator("table.data.table.table-order-items.history tbody>tr")
        this.paginationNextBtn = page.locator("a.action.next")
    }

    async checkOrderStatus(orderNo) {
        // Click on the view all orders link
        await this.viewAllOrdersLink.click();
    
        let maxIterations = 100; 
        let iteration = 0;
        let hasNextPage = true;
    
        while (hasNextPage && iteration < maxIterations) {
            const count = await this.allOrdersRowInsinglePage.count();
            console.log(count);
    
            for (let i = 0; i < count; ++i) {
                const orderNoElement = this.allOrdersRowInsinglePage.nth(i).locator("td").first();
                const orderNoText = await orderNoElement.textContent();
    
                if (orderNoText === orderNo) {
                    const statusElement = this.allOrdersRowInsinglePage.nth(i).locator("td.col.status");
                    const status = await statusElement.textContent();
                    return status;
                }
            }
    
            // Check for pagination next button
            hasNextPage = await this.paginationNextBtn.isVisible();
    
            // If the next page exists, click on it
            if (hasNextPage) {
                await this.paginationNextBtn.click();
            }
    
            iteration++;
        }
    
        // If the order is not found after all iterations, throw an error
        throw new Error(`Order ${orderNo} not found on any page.`);
    }
    
    
   
    
    
    
  

    
   
    
   
      
       
        
}
 

export{MyAccountsPage};