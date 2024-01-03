import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashBoardPage';
import { ProductListingPage } from './ProductListingPage';
import { OrderSummaryPage } from './OrderSummaryPage';


class POManager{
/**
   * @param {import('@playwright/test').Page} page
   */

    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.productListingPage= new ProductListingPage(this.page)
        this.orderSummaryPage=new OrderSummaryPage(this.page)
        
 
    }

    getLoginPage() {
       return this.loginPage 
    }
    getDashBoardPage() {
        return this.dashboardPage
    }
    getProductListingPage(){
        return this.productListingPage
    }
    getOrderSummaryPage(){
        return this.orderSummaryPage
    }

}
export { POManager };
