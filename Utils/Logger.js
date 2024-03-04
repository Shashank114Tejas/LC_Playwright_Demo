import fs from 'fs';
import path from 'path';
import log4js from 'log4js';

// File path for storing run data
const runDataFilePath = path.resolve("Utils", 'runData.json');
const logsFolderPath = path.resolve("logs");

// Ensure logs directory exists
if (!fs.existsSync(logsFolderPath)) {
  fs.mkdirSync(logsFolderPath);
}

// Delete all existing log files
fs.readdirSync(logsFolderPath).forEach(file => {
  const filePath = path.join(logsFolderPath, file);
  fs.unlinkSync(filePath);
});

// Generate a unique filename for the log file
const currentTimestamp = new Date().toISOString().replace(/:/g, "-");
const logFileName = `${currentTimestamp}.log`;
const logFilePath = path.join(logsFolderPath, logFileName);

// Configure log4js
log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: logFilePath,
      maxLogSize: 10485760, // 10MB
      backups: 3,
      compress: true
    }
  },
  categories: {
    default: { appenders: ['file'], level: 'info' } // Capture both INFO and ERROR levels
  }
});

const logger = log4js.getLogger();

// Function to save run data to file (if needed)
function saveRunData() {
  // You can add code here to save run data if required
}

// Hook into process exit event to save run data before exiting
process.on('exit', () => {
  saveRunData();
});

function logTestCaseStart(testName) {
  logger.info(`\n🚀 Starting test case: ${testName} 🚀\n`);
}

function logTestCaseEnd(testName) {
  logger.info(`\n✅ Finished test case: ${testName} ✅\n`);
}

export { logger, logTestCaseStart, logTestCaseEnd };
