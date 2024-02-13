/**
 * This class is responsible for managing all page objects in the test suite.
 *  It provides methods to access each individual page object.
 */
// Importing page classes

import { LoginPage } from "./LoginPage";
import { DashboardPage } from "./DashBoardPage";
import { ProductListingPage } from "./ProductListingPage";
import { OrderSummaryPage } from "./OrderSummaryPage";
import { PaymentDetailsPage } from "./PaymentDetailsPage";
import { MyOrdersPage } from "./MyOrdersPage";
import { MyAccountsPage } from "./MyAccountsPage";
import { ConfirmationPage } from "./ConfirmationPage";
import { MyAddressBookPage } from "./MyAddressBookpage";
import { ShoppingCartPage } from "./ShoppingCartPage";

class POManager {
  /**
   * Creates an instance of POManager.
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   */
  constructor(page) {
    this.page = page;
    // Initialize page objects
    this.loginPage = new LoginPage(this.page);
    this.dashboardPage = new DashboardPage(this.page);
    this.productListingPage = new ProductListingPage(this.page);
    this.orderSummaryPage = new OrderSummaryPage(this.page);
    this.paymentDetailsPage = new PaymentDetailsPage(this.page);
    this.myOrdersPage = new MyOrdersPage(this.page);
    this.myAccountsPage = new MyAccountsPage(this.page);
    this.confirmationPage = new ConfirmationPage(this.page);
    this.addressBookPage = new MyAddressBookPage(this.page);
    this.shoppingCartPage = new ShoppingCartPage(this.page);
  }

  /**
   * Gets the LoginPage object.
   * @returns {LoginPage} The LoginPage object.
   */
  getLoginPage() {
    return this.loginPage;
  }

  /**
   * Gets the DashboardPage object.
   * @returns {DashboardPage} The DashboardPage object.
   */
  getDashBoardPage() {
    return this.dashboardPage;
  }

  /**
   * Gets the ProductListingPage object.
   * @returns {ProductListingPage} The ProductListingPage object.
   */
  getProductListingPage() {
    return this.productListingPage;
  }

  /**
   * Gets the OrderSummaryPage object.
   * @returns {OrderSummaryPage} The OrderSummaryPage object.
   */
  getOrderSummaryPage() {
    return this.orderSummaryPage;
  }

  /**
   * Gets the PaymentDetailsPage object.
   * @returns {PaymentDetailsPage} The PaymentDetailsPage object.
   */
  getPaymentDetailsPage() {
    return this.paymentDetailsPage;
  }

  /**
   * Gets the MyOrdersPage object.
   * @returns {MyOrdersPage} The MyOrdersPage object.
   */
  getMyOrdersPage() {
    return this.myOrdersPage;
  }

  /**
   * Gets the MyAccountsPage object.
   * @returns {MyAccountsPage} The MyAccountsPage object.
   */
  getMyAccountsPage() {
    return this.myAccountsPage;
  }

  /**
   * Gets the ConfirmationPage object.
   * @returns {ConfirmationPage} The ConfirmationPage object.
   */
  getConfirmationPage() {
    return this.confirmationPage;
  }

  /**
   * Gets the MyAddressBookPage object.
   * @returns {MyAddressBookPage} The MyAddressBookPage object.
   */
  getMyAddressbookPage() {
    return this.addressBookPage;
  }

  /**
   * Gets the ShoppingCartPage object.
   * @returns {ShoppingCartPage} The ShoppingCartPage object.
   */
  getShoppingCartPage() {
    return this.shoppingCartPage;
  }
}

// Export the POManager class
export { POManager };
