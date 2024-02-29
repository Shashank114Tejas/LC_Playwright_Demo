import fs from 'fs';
import path from 'path';
import log4js from 'log4js';

// File path for storing run data
const runDataFilePath = path.resolve(__dirname, 'runData.json');

// Load run data from file or initialize if file doesn't exist
let { lastRunDate, runCount } = { lastRunDate: '', runCount: 0 };
if (fs.existsSync(runDataFilePath)) {
  try {
    const data = fs.readFileSync(runDataFilePath, 'utf8');
    if (data) {
      const parsedData = JSON.parse(data);
      lastRunDate = parsedData.lastRunDate || '';
      runCount = parsedData.runCount || 0;
    }
  } catch (error) {
    console.error('Error loading run data:', error);
  }
}

// Function to save run data to file
function saveRunData() {
  try {
    const data = JSON.stringify({ lastRunDate, runCount });
    fs.writeFileSync(runDataFilePath, data, 'utf8');
  } catch (error) {
    console.error('Error saving run data:', error);
  }
}

// Function to check if the current date is different from the last run date
function isNewDay() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const currentDateStr = `${year}-${month}-${day}`;
  return currentDateStr !== lastRunDate;
}

// Increment run count and handle new day logic
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');
const currentDateStr = `${year}-${month}-${day}`;
if (isNewDay()) {
  lastRunDate = currentDateStr;
  runCount = 1; // Reset run count to 1 for a new day
} else {
  runCount++; // Increment run count for the same day
}

// Generate unique identifier
const uniqueId = `${lastRunDate}_${runCount}`;

// Configure log4js
log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: `logs/${uniqueId}.log`, // Include unique identifier in the filename
      maxLogSize: 10485760, // 10MB
      backups: 3,
      compress: true,
      layout: {
        type: 'pattern',
        pattern:'%p - %m' // Include log level (%p) and message (%m) without timestamp
      }
    }
  },
  categories: {
    default: { appenders: ['file'], level: 'info' } // Capture both INFO and ERROR levels
  }
});

const logger = log4js.getLogger();

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
