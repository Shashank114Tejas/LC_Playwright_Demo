/*This test case verifies the status of the LC API endpoint by sending a GET request.*/

import { test, expect, request } from "@playwright/test";
import { addLoggingHooks } from "../Utils/TestUtils";
import { logger, logTestCaseStart, logTestCaseEnd } from "../Utils/Logger";

test.describe("Test Case Title", () => {

  // Adding logging hooks for better test reporting
  addLoggingHooks(test);

  test("LC SKU API Status Validation", async () => {
    test.info().annotations.push({
      type: 'Description',
      description: "This test case verifies the status of the LC API endpoint by sending a GET request."
    });

    logTestCaseStart("=>=>=> LC SKU API Status Validation. <=<=<=");

    await test.step("Verify LC SKU API Status", async () => {
      const apiContext = await request.newContext();

      try {
        const apiResponse = await apiContext.get(
          "https://services-dev.poscloud.com/ExatouchRestAPI/api/items/liquorcart/999999999000090/sku/008807616448",
          {
            headers: {
              "Auth-Key": "3rzonriaG1IJcgk/+blNjsvWLVuyp0oZAsIeeAJ6ZmzCBwBIYAZbeKBdQb2oZRjygs8KQE1aq4fV0idWnp4CpqmJFTAREJkLDV34mxEvqB0="
            }
          }
        );

        logger.info("Response status:", apiResponse.status());
        logger.info("Response status text:", apiResponse.statusText());

        expect(apiResponse.status(), "API response status is not as expected").toBe(200);
        logger.info("Congratulations! LC API's are Up and Running.");

      } catch (error) {
        // Log the error
        logger.error("Error occurred:", error);
        // Fail the test and log the error if an error occurs
        throw error;
      }
    });

    logTestCaseEnd("=>=>=> LC SKU API Status Validation. <=<=<=");
  });
});
