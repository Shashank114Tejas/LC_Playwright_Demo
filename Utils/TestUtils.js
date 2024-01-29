// testUtils.js
function addLoggingHooks(test) {
  test.beforeAll(async ({ }, testRunInfo) => {
    console.log();
    console.log(`***************Test Case Start: ${testRunInfo.title}***************`);
    console.log();
  });

  test.afterAll(async ({ }, testRunInfo) => {
    console.log();
    console.log(`***************Test Case Teardown: ${testRunInfo.title}***************`);
    console.log();
  });
}

export { addLoggingHooks };

