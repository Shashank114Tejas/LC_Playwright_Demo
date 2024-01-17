import { Workbook } from 'exceljs';

class ExcelReader {
  constructor(filePath) {
    this.filePath = filePath;
    this.workbook = new Workbook();
  }

  async loadWorkbook() {
    await this.workbook.xlsx.readFile(this.filePath);
  }

  async getData(sheetName) {
    const worksheet = this.workbook.getWorksheet(sheetName);
    const data = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {
        const rowData = {};
        row.eachCell((cell, colNumber) => {
          rowData[worksheet.getCell(1, colNumber).value] = cell.value;
        });
        data.push(rowData);
      }
    });

    return data;
  }
}

export { ExcelReader };
