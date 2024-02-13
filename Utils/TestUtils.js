/*
This file contains a utility function `addLoggingHooks` used to enhance the logging in Playwright test cases.

- addLoggingHooks(test): Adds custom logging hooks to the Playwright test cases. It logs messages before each test case execution
  and after each test case execution for better visibility and debugging.

Note: This function is intended to be used with Playwright test framework.
*/
// testUtils.js
function addLoggingHooks(test) {
  // Log before each test case execution
  test.beforeAll(async ({ }, testRunInfo) => {
    console.log();
    console.log(`🚀 Test Case Start: ${testRunInfo.title} 🚀`);
    console.log();
  });

  // Log after each test case execution
  test.afterAll(async ({ }, testRunInfo) => {
    console.log();
    console.log(`✅ Test Case Teardown: ${testRunInfo.title} ✅`);
    console.log();
  });
}

export { addLoggingHooks };
