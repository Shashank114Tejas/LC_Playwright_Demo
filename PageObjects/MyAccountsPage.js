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
        this.myAccountEditBtn = page.locator("div.block.block-dashboard-info a.action.edit>span")
        this.contactInfoNameEmail = page.locator("div.block.block-dashboard-info div.box-content>p")
        this.pageHeader = page.locator("h1>span")
        this.editFirstnameField=page.locator("form#form-validate div.control>input#firstname")
        this.editLastnameField = page.locator("form#form-validate div.control>input#lastname")
        this.editAccountInfoSaveBtn = page.locator("form#form-validate div.primary>button.action.save.primary>span")
        this.editSuccessMsg = page.locator("main#maincontent div[data-ui-id='message-success']>div")
        this.sidebarAddressBookLink=page.locator("div.sidebar.sidebar-main li>a[href*='address']")
    }

    async checkOrderStatus(orderNo) {
        // Click on the view all orders link
        await this.viewAllOrdersLink.click();
    
        let maxIterations = 100; 
        let iteration = 0;
        let hasNextPage = true;
    
        while (hasNextPage && iteration < maxIterations) {
            const count = await this.allOrdersRowInsinglePage.count();
    
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
    
    async getMyAccountFirstNameLastNameEmail() {
        const firstLastNameEmail = await this.contactInfoNameEmail.textContent();
        const infoArr = firstLastNameEmail.split(" ");
        const contactInfo = infoArr.filter((val) => val.trim() !== "").map((val) => val.trim());
        return contactInfo;
    }
    
   
    async editMyAccountFirstNameAndLastName() {        
        const [firstName, lastName, email] =await this.getMyAccountFirstNameLastNameEmail()
      

        await this.myAccountEditBtn.click()
        if (await this.pageHeader.textContent() == "Edit Account Information") {
            if (firstName === 'QARemo' && lastName === 'Sys') {
                await this.editFirstnameField.fill("John");
                await this.editLastnameField.fill("Doe");
            }
            else
            {
                await this.editFirstnameField.fill("QARemo");
                await this.editLastnameField.fill("Sys");  
                }
        }
        await this.editAccountInfoSaveBtn.click();
        const editSuccess = await this.editSuccessMsg.textContent()
        if (editSuccess.trim() === 'You saved the account information.') {
           console.log("User's Account firstname and lastname are changed");
        }
        else {
            console.log("-> User's Account firstname and lastname are not changed");
        }


    }      
    
    async navigateToAddressBookPage() {
        await this.sidebarAddressBookLink.click()
    }
}
 

export{MyAccountsPage};