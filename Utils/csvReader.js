// csvReader.js
const fs = require('fs');
const { parse } = require('csv-parse');

async function readTestData(filePath) {
  const csvData = fs.readFileSync(filePath, 'utf-8');

  return new Promise((resolve, reject) => {
    parse(csvData, { columns: true, relax_column_count: true }, (err, records) => {
      if (err) {
        reject(err);
      } else {
        resolve(records);
      }
    });
  });
}


export { readTestData }
