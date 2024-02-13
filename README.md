![RemosysLogo](Screenshots\JS-Playwright_Remosys.png)

# Remosys Project - Playwright Test Automation Framework

This project is a Playwright test automation framework developed by RemoSys Technologies. It is designed to automate end-to-end testing of a web application, providing comprehensive test coverage and robust validation of application functionalities.


## Application Under Test
We are using `LiquorCart` as the Application Under Test.

[URL](https://qa-josephsbeverage-teststore.epicommercestore.com/)
OS  : Windows 10
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
