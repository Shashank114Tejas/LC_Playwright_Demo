class OrderSummaryPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
  
    constructor(page) {
      this.page = page;
      this.storePickupRadioBtn=page.locator("input[value=amstorepickup_amstorepickup]")
      this.flatRateRadioBtn=page.locator("input[value=flatrate_flatrate]")
      this.nextButton=page.locator("button.button.action.continue.primary")
    }

    async enableOrderTypeRadioBtn(orderType){
    if(orderType=="Store Pickup")
    {
       this.storePickupRadioBtn.check()
    }
    else{
       this.flatRateRadioBtn.check()
    }
    console.log(`clicked ${orderType} ordertype radio btn`);
    }

   
}
export{OrderSummaryPage};