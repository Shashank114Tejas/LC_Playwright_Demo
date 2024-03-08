/*
This test case involves validating products through the search panel using SKU values. The flow includes:
- Navigating to the specified URL.
- Loading the test data from an Excel file.
- Extracting SKU values from the Excel sheet.
- Iterating through each SKU value.
- Using the SKU value to search for and add the corresponding product to the cart.
- Logging the process of searching for and adding products using SKU values.
*/

// Importing necessary dependencies and utilities
import { test, expect } from '@playwright/test'
import { POManager } from '../PageObjects/POManager';
import { ExcelReader } from "../Utils/ExcelReader";
import { addLoggingHooks } from '../Utils/TestUtils';
import { logger, logTestCaseStart, logTestCaseEnd } from '../Utils/Logger';

test.describe("Test Case Title", () => {

    // Loading test data from a JSON file
    const dataset = JSON.parse(
        JSON.stringify(require("../Utils/ClientAppTestData.json"))
    );

    // Adding logging hooks for better test reporting
    addLoggingHooks(test);

    // Iterating through each set of test data
    for (const data of dataset) {
        test("Product Validation Through Search Panel Using SKU Values", async ({ page }) => {

            test.info().annotations.push({
                type: 'Description',
                description: `This test case involves validating products through the search panel using SKU values. The flow includes:
                - Navigating to the specified URL.
                - Loading the test data from an Excel file.
                - Extracting SKU values from the Excel sheet.
                - Iterating through each SKU value.
                - Using the SKU value to search for and add the corresponding product to the cart.
                - Logging the process of searching for and adding products using SKU values.`
            });
        
            logTestCaseStart("=>=>=> Product Validation Through Search Panel Using SKU Values. <=<=<=");

            // Step: Navigate to the specified URL
            await test.step("Navigate to the specified URL", async () => {
                await page.goto(data.url);
                await page.waitForLoadState("domcontentloaded");
            });

            const poManager = new POManager(page);
            const dashboardPage = poManager.getDashBoardPage();

            // Load data from an Excel file
            const excelReader = new ExcelReader("LC_Workbook.xlsx");
            await excelReader.loadWorkbook();
            const sheetName = "SearchPanelList";
            const excelData = await excelReader.getData(sheetName);
        
            // Step: Iterating through each data row from the Excel sheet
            await test.step("Iterating through each row from the Excel sheet and adding to cart if qty is available", async () => {
                logger.info("Adding products to the cart from Excel data...");
                for (const data of excelData) {
                    logger.info(`Looking for ${data.SKU_Values} SKU value`);
                    // Adding products to cart using SKU value
                    await dashboardPage.findAndAddProductToCartUsingSKU(data.SKU_Values);
                }
                logger.info("All available products are added in the cart through SKU values");
            });

            logTestCaseEnd("=>=>=> Product Validation Through Search Panel Using SKU Values. <=<=<=");
        })
    }

});
