![RemosysLogo](https://imgur.com/a/DaRzLnY)

# Remosys Project - Playwright Test Automation Framework

This project is a Playwright test automation framework developed by RemoSys Technologies. It is designed to automate end-to-end testing of a web application, providing comprehensive test coverage and robust validation of application functionalities.

## Application Under Test

We are using `LiquorCart` as the Application Under Test.

[URL](https://qa-josephsbeverage-teststore.epicommercestore.com/)
OS : Windows 10
IDE : Visual Studio Code

## Overview

The Remosys project consists of the following components:

- **PageObjects**: Contains classes representing different pages of the web application under test. Each page object encapsulates the behavior and elements of a specific page.
- **Utils**: Contains utility functions and helpers used across the test automation framework. This includes functions for reading data from Excel files, custom logging hooks, and other helper functions.
- **Tests**: Contains test cases written using the Playwright test framework. Test cases cover various scenarios and functionalities of the web application.

## Features

- **Modular Design**: The framework follows a modular design, separating concerns such as page objects, utilities, and tests for better organization and maintainability.
- **Custom Logging Hooks**: Custom logging hooks are implemented to provide enhanced logging before and after each test case execution, improving visibility and debugging.
- **Data-Driven Testing**: Test cases utilize external data sources such as JSON files and Excel sheets for data-driven testing, allowing for easy parameterization and scalability.
- **Page Object Model (POM)**: The framework adopts the Page Object Model design pattern to improve code reusability, readability, and maintenance of tests.

## Usage

To run the tests, ensure that Node.js and Playwright are installed. Clone the repository and install dependencies using `npm install`. Then, execute the tests using `npm test`.

## Dependencies

- [Playwright](https://playwright.dev/): A Node.js library for automating browsers.
- [ExcelJS](https://github.com/exceljs/exceljs): A library for reading and writing Excel files in JavaScript.

## Scenario

### Test Case: Purchase Flow with Store Pickup and Order Confirmation

Description:
This test case validates the purchase flow on an e-commerce platform.

It involves the following steps:

- Logging in with valid credentials.
- Adding multiple products to the cart from an Excel sheet.
- Proceeding to checkout, opting for store pickup.
- Entering payment details and completing the purchase.
- Verifying the order details on the My Orders page.
- Confirming the order and checking the updated status on My Account page.

Test File Name: TC_01_e2eCheckoutByStorePickupAndConfirm.test.js

Scenario:
A user logs into the e-commerce website, adds products to the cart, selects store pickup at checkout, completes the payment process, verifies order details, and confirms the order. This scenario ensures the smooth functioning of the purchase flow and order confirmation process.

### Test Case: Purchase Flow with Delivery Option and Order Rejection

Description:
This test case validates the purchase flow on an e-commerce platform, specifically testing the delivery option at checkout.

It involves the following steps:

- Logging in with valid credentials.
- Adding multiple products to the cart from an Excel sheet.
- Proceeding to checkout, opting for delivery.
- Entering payment details and completing the purchase.
- Verifying the order details on the My Orders page.
- Rejecting the order from the My Account page and confirming the cancellation.

Test File Name: TC_02_e2eCheckoutByDeliveryAndReject.test.js

Scenario:
A user logs into the e-commerce website, adds products to the cart, selects delivery option at checkout, completes the payment process, verifies order details, rejects the order, and confirms the cancellation. This scenario ensures the proper functioning of the purchase flow with the delivery option and order rejection.

### Test Case: Header Validation on Homepage Before Sign-In

Description:
This test case validates the header section of the homepage before user sign-in.

It includes the following steps:
- Asserting header texts, such as merchant name, address, phone, hours, and delivery options.
- Checking the visibility and functionality of the logo, shopping cart icon, and account functions.
- Validating the behavior of the shopping cart when no products are added.
- Testing sign-in and sign-out functionalities.

Test File Name: TC_03_headerValidationBeforeSignIn.test.js

Scenario:
A user navigates to the homepage of the e-commerce website and verifies the header section. The test ensures that all the necessary information, such as merchant details and delivery options, are correctly displayed. It also checks the visibility and functionality of the logo, shopping cart icon, and account functions. Additionally, it validates the behavior of the shopping cart when no products are added and tests the sign-in and sign-out functionalities.

### Test Case: Quick Guest Checkout with Flat Rate Order Type

Description:
This test case performs a quick guest checkout using the flat rate order type.

It involves the following steps:
- Navigating to the homepage.
- Adding products to the cart extracted from an Excel sheet.
- Proceeding to checkout and selecting the order type.
- Adding billing or shipping addresses from an Excel sheet and checking out.
- Entering payment card details.
- Capturing and logging the generated order number.
- Confirming the successful placement of the order.

Test File Name: TC_04_quickGuestCheckoutFlatRate.test.js

Scenario:
A guest user visits the e-commerce website's homepage and adds products to the cart. After selecting the flat rate order type, the guest user proceeds to checkout and provides billing or shipping addresses as per the data from an Excel sheet. The user then enters payment card details to complete the checkout process. Upon successful payment, the order number is captured and logged, confirming the successful placement of the order.

### Test Case: Edit User Firstname And Lastname

Description:
This test case edits the user's first name and last name on the account page.

It involves the following steps:
- Navigating to the specified URL.
- Signing in with the provided credentials.
- Navigating to the My Account page.
- Retrieving the current first name, last name, and email.
- Logging the current first name and last name.
- Editing the first name and last name.
- Retrieving the updated first name and last name.
- Logging the updated first name and last name.
- Asserting that the updated first name and last name match the expected values.

Test File Name: TC_05_editUserFirstnameLastname.test.js

Scenario:
A user navigates to the e-commerce website's homepage and signs in using provided credentials. After signing in, the user navigates to the My Account page to edit their first name and last name. The test retrieves the current first name and last name, edits them, and verifies that the changes were successfully applied by checking the updated first name and last name against the expected values.

### Test Case: Get Default Billing/Shipping Addresses

Description:
These test cases involve retrieving default billing and shipping addresses from the user's address book.

The flow includes:
- Navigating to the specified URL.
- Signing in with the provided credentials.
- Navigating to the My Account page.
- Navigating to the Address Book page.
- Retrieving default billing and shipping addresses.
- Logging the default billing and shipping addresses.

Test File Name: TC_06_getDefaultBillingShippingAddresses.test.js

Scenario:
A user navigates to the e-commerce website's homepage and signs in using provided credentials. After signing in, the user navigates to the My Account page and then to the Address Book page. In the first test case, the user retrieves and logs the default billing and shipping addresses. In the second test case, the user retrieves and logs additional address entries from the address book.

### Test Case: Product Validation Through Search Panel Using SKU Values

Description:
This test case involves validating products through the search panel using SKU values.

The flow includes:
- Navigating to the specified URL.
- Loading test data from an Excel file.
- Extracting SKU values from the Excel sheet.
- Iterating through each SKU value.
- Using the SKU value to search for and add the corresponding product to the cart.
- Logging the process of searching for and adding products using SKU values.

Test File Name: TC_07_productValidationSearchPanelSKU.test.js

Scenario:
A user navigates to the e-commerce website's homepage and initiates a product validation process through the search panel using SKU values. The test case iterates through a list of SKU values extracted from an Excel sheet. For each SKU value, the test searches for the corresponding product and adds it to the cart. The process is logged to provide visibility into the validation of products using SKU values.

### Test Suite: Shopping Cart Functionality Validation

Description:
This test suite involves validating various functionalities related to the shopping cart,

including:

- Validating the quantities update functionality for products in the shopping cart at once.
- Validating the remove functionality from the minicart by removing the first item.
- Validating the remove functionality in the shopping cart by removing all products.
- The test suite also utilizes session storage to store user login information for efficient testing.

Test File Name: TC_08_shoppingCartFunctionalityValidation.test.js

Scenarios:

Validate Quantities Update Functionality

- A user logs in and navigates to the shopping cart.
- Products are added to the cart, and their quantities are updated.
- The quantities update functionality is validated by comparing the grand total before and after the update.
- Validate Remove Functionality from Minicart

- A user logs in and navigates to the homepage.
- The first item is removed from the minicart.
- The successful removal of the first item is confirmed.
- Validate Remove Functionality in Shopping Cart

- A user logs in and navigates to the shopping cart.
- All products are removed from the cart.
- The successful removal of all products from the cart is confirmed.

## Contributors

- Sonal Kashyap
- Shubham Srivastava
- Kriti Shukla
- Supriya Kirasur
- Mayur Takalikar
- Akash Dwarkadas Dilwale
- Shashank Kumar

## About RemoSys Technologies

RemoSys Technologies is a leading software development company specializing in providing cutting-edge solutions for businesses worldwide. With a focus on innovation and quality, RemoSys Technologies delivers bespoke software products and services tailored to meet the unique requirements of its clients.
