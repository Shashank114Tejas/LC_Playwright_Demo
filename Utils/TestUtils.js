// testUtils.js
function addLoggingHooks(test) {
  test.beforeAll(async ({}, testRunInfo) => {
    console.log(`=== Test Case Start: ${testRunInfo.title} ===`);
  });

  test.afterAll(async ({}, testRunInfo) => {
    console.log(`=== Test Case Teardown: ${testRunInfo.title} ===`);
  });
}

export { addLoggingHooks };

