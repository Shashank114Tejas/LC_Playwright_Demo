class MyAddressBookPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    

  
    constructor(page) {
        this.page = page
        this.defaultBillingAddress= page.locator("div.box.box-address-billing div.box-content>address")
        this.defaultShippingAddress= page.locator("div.box.box-address-shipping div.box-content>address")
        this.allAdditionalAddressesEntries=page.locator("div.block.block-addresses-list tbody>tr")
    }

    async  formatData(input) {
        const lines = input.trim().split('\n').map(line => line.trim().replace(/\s+/g, ' '));
        return lines.join(', ');
    }
      
    async getDefaultBillingAddress() {
        const billAddress = await this.defaultBillingAddress.textContent()
        console.log(billAddress);
        return this.formatData(billAddress)
    }

    async getDefaultShippingAddress() {
        const shipAddress = await this.defaultShippingAddress.textContent()
        return this.formatData(shipAddress)

    }
    async getAdditionalAddressesEntries() {
        const addresses = [];
        for (let i = 0; i < await this.allAdditionalAddressesEntries.count(); i++) {
            addresses.push(await this.formatData(await this.allAdditionalAddressesEntries.nth(i).textContent()));
        }
        return addresses;
    }
    

}
 

export{MyAddressBookPage};