import { test, expect } from '@playwright/test'
import { POManager } from '../PageObjects/POManager';
import { ExcelReader } from "../Utils/excelReader";
import { addLoggingHooks } from '../Utils/TestUtils';


const dataset = JSON.parse(
    JSON.stringify(require("../Utils/ClientAppTestData.json"))
);
addLoggingHooks(test)
for (const data of dataset) {
    test("Product Validation Through Search Panel Using SKU Values", async ({ page }) => {
        await page.goto(data.url);
        await page.waitForLoadState("domcontentloaded");
        const poManager = new POManager(page);
        const dashboardPage = poManager.getDashBoardPage();


        const excelReader = new ExcelReader("LC_Workbook.xlsx");
        await excelReader.loadWorkbook();
        const sheetName = "SearchPanelList";
        const excelData = await excelReader.getData(sheetName);
        
        console.log("Extracting data from excel and adding products to the cart");
        console.log();
        
        // Hover on category, click on subcategory (if present), Adding products to the cart 
        for (const data of excelData) {
            console.log();
            console.log(`looking for ${data.SKU_Values} SKU value`);
            // Adding products to cart using SKU value
            await dashboardPage.findAndAddProductToCartUsingSKU(data.SKU_Values);
        }
        console.log();
        console.log("All available products are added in the cart through SKU values");



    })
}