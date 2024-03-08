import log4js from 'log4js';

// Configure log4js to append logs to the existing file
log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: 'logs/test.log', // Log file location
      maxLogSize: 10485760, // 10MB
      backups: 3,
      compress: true,
      alwaysIncludePattern: true, // Append logs to the existing file
      pattern: 'yyyy-MM-dd', // Pattern for creating the log file with date
      keepFileExt: true // Keep the file extension when rolling over
    }
  },
  categories: {
    default: { appenders: ['file'], level: 'info' } // Capture INFO level logs to file only
  }
});

const logger = log4js.getLogger();

function logTestCaseStart(testName) {
  logger.info(`\n🚀 Starting test case: ${testName} 🚀\n`);
}

function logTestCaseEnd(testName) {
  logger.info(`\n✅ Finished test case: ${testName} ✅\n`);
}

export { logger, logTestCaseStart, logTestCaseEnd };
