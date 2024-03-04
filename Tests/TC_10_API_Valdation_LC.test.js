import { test, expect, request } from "@playwright/test";
import { logger } from "../Utils/Logger";

test("LC_SKU_API_Status_Validation", async () => {
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

    // const responseBody = await apiResponse.json();
      expect(apiResponse.status()).toBe(200)
      logger.info("Congratulation! LC API's are Up and Running.")
    // expect(responseBody.someProperty).toBe(expectedValue);
  } catch (error) {
    console.error("Error occurred:", error);
    // Fail the test if an error occurs
    throw error;
  }
});
