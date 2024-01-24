import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashBoardPage';
import { ProductListingPage } from './ProductListingPage';
import { OrderSummaryPage } from './OrderSummaryPage';
import { PaymentDetailsPage } from './PaymentDetailsPage';
import { MyOrdersPage } from './MyOrdersPage';
import { MyAccountsPage } from './MyAccountsPage';
import { ConfirmationPage } from './ConfirmationPage';


class POManager{
/**
   * @param {import('@playwright/test').Page} page
   */

    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.productListingPage= new ProductListingPage(this.page)
        this.orderSummaryPage = new OrderSummaryPage(this.page)
        this.paymentDetailsPage = new PaymentDetailsPage(this.page)
        this.myOrdersPage= new MyOrdersPage(this.page)
        this.myAccountsPage = new MyAccountsPage(this.page)
        this.confirmationPage=new ConfirmationPage(this.page)
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
    getPaymentDetailsPage() {
        return this.paymentDetailsPage
    }
    getMyOrdersPage() {
        return this.myOrdersPage
    }
    getMyAccountsPage() {
        return this.myAccountsPage
    }
    getConfirmationPage() {
        return this.confirmationPage
    }

}
export { POManager };
