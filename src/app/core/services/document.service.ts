import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import * as Excel from 'exceljs/dist/exceljs.js';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AlertService } from '@quick/services/alert.service';
import { ExcelColumn } from '../models/excel-column';
import { SearchUnit } from '../models/search-unit';
import { replaceValue } from '../utils/string-helper';
import { convertToBase26 } from '../utils/encode-helpers';

@Injectable({
  providedIn: 'root'
})
export class OliveDocumentService {

  onImportTableRendered: Subject<any> = new Subject;

  constructor(
    private translator: FuseTranslationLoaderService,
    private alertService: AlertService
  ) {
  }

  private get stylesheet(): string {
    return '<style>' +
      '@media print {' +
      'body {' +
      'font-family: verdana, arial, sans-serif;' +
      'font-size: 12px;' +
      '}' +
      'table {' +
      'width: 100%;' +
      '}' +
      'th,' +
      'td {' +
      'padding: 4px 4px 4px 4px;' +
      'text-align: center;' +
      '}' +
      'th {' +
      'border-bottom: 2px solid #333333;' +
      '}' +
      'td {' +
      'border-bottom: 1px dotted #999999;' +
      '}' +
      'td.right {' +
      'text-align: right; !important;' +
      '}' +
      'td.left {' +
      'text-align: left; !important;' +
      '}' +
      'tfoot td {' +
      'border-bottom-width: 0px;' +
      'border-top: 2px solid #333333;' +
      'padding-top: 20px;' +
      '}' +
      'thead,' +
      'tfoot {' +
      'display: table-header-group;' +
      '}' +
      '}' +
      '</style>';
  }

  get noItemsSelected(): boolean {
    return $('input[name="select"]:checked').length === 0;
  }

  exportExcel(fileName: string, columns: ExcelColumn[], rows: any[], sheetName: string = null) {
    const workbook = new Excel.Workbook();

    const worksheet = workbook.addWorksheet(sheetName ? sheetName : fileName);

    let rowIndex = 0;

    rowIndex = this.setExcelColumnsHeader(columns, worksheet, rowIndex);

    this.setExcelBody(worksheet, rowIndex, columns, rows);

    this.saveExcelWorkbook(fileName, workbook);
  }

  private setExcelBody(worksheet: any, rowIndex: number, columns: ExcelColumn[], rows: any[]) {

    for (const row of rows) {
      rowIndex++;

      const newRow = worksheet.getRow(rowIndex);
      newRow.font = { name: 'Calibri', family: 4, size: 10 };
      newRow.height = 25;

      let colIndex = 0;
      for (const column of columns) {
        colIndex++;

        const columnValue = row[column.propertyName];

        if (columnValue) {
          if (column.type === 'number') {
            let amount = parseFloat(columnValue.replace(/,/g, ''));
            if (isNaN(amount)) { amount = 0.0; }
            newRow.getCell(colIndex).value = amount;
          }
          else {
            newRow.getCell(colIndex).value = columnValue.toString();
          }
        }
        else {
          newRow.getCell(colIndex).value = '';
        }

        newRow.eachCell(function (cell) {
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      }
    }
  }

  private setExcelColumnsHeader(columns: ExcelColumn[], worksheet: any, rowIndex: number): number {
    this.setExcelHeaderSticky(worksheet, rowIndex);

    const columnDefinitions = [];
    const columnTitles = [];
    let excelColumnCharIndex = '@';

    for (const header of columns) {
      excelColumnCharIndex = String.fromCharCode(excelColumnCharIndex.charCodeAt(0) + 1);
      columnTitles.push(header.headerTitle);

      let colWidth = 10;
      let style;

      if (header.type === 'id') {
        style = { alignment: { vertical: 'middle', horizontal: 'center' } };
      }
      else if (header.type === 'number') {
        style = { alignment: { vertical: 'middle', horizontal: 'right' } };
      }
      else if (header.type === 'text') {
        style = { alignment: { vertical: 'middle', horizontal: 'left', indent: 1, wrapText: true } };
        colWidth = 20;
      }
      else {
        style = { alignment: { vertical: 'middle', horizontal: 'center' } };
        colWidth = 20;
      }

      if (header.width) {
        colWidth = header.width;
      }

      const columnDefinition = { key: header.headerTitle, width: colWidth };

      if (style) {
        columnDefinition['style'] = style;
      }

      columnDefinitions.push(columnDefinition);
    }

    return this.buildHeaderRow(rowIndex, worksheet, excelColumnCharIndex, columnDefinitions, columnTitles);
  }

  private buildHeaderRow(rowIndex: number, worksheet: any, excelColumnCharIndex: string, columnDefinitions: any[], columnTitles: any[]): number {
    if (rowIndex === 0) {
      worksheet.autoFilter = `A1${excelColumnCharIndex}1`;
    }
    worksheet.columns = columnDefinitions;

    rowIndex++;

    worksheet.getRow(rowIndex).values = columnTitles;
    const headerRow = worksheet.getRow(rowIndex);
    headerRow.font = { name: 'Calibri', family: 4, size: 12, bold: true, color: { argb: 'FF335EFF' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 30;

    headerRow.eachCell(function (cell) {
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    return rowIndex;
  }

  private saveExcelWorkbook(fileName: string, workbook: Excel.Workbook) {
    workbook.xlsx.writeBuffer().then(function (data): void {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, `${fileName}.xlsx`);
    });
  }

  private setExcelHeaderSticky(worksheet: any, rowIndex: number) {
    if (rowIndex === 0) {
      worksheet.views = [
        { state: 'frozen', xSplit: 0, ySplit: 1 }
      ];
    }
  }

  exportHtmlTableToExcel(fileName: string, tableId: string, selectable = true, 
    summaries: string[] = [], replaces: SearchUnit[] = []): void {
    if (selectable && this.noItemsSelected) { console.error('No Items Selected'); return; }

    const workbook = new Excel.Workbook();

    const worksheet = workbook.addWorksheet('Sheet1');

    const table = $(`#${tableId}`);

    let rowIndex = this.setExcelSummaries(worksheet, summaries);

    rowIndex = this.setExcelColumnsHeaderForHtmlTable(table, worksheet, rowIndex);

    this.setExcelTbodyTable(table, worksheet, selectable, rowIndex, replaces);

    this.saveExcelWorkbook(fileName, workbook);
  }

  private setExcelSummaries(worksheet: any, summaries: string[]): number {
    if (!summaries) {
      return 0;
    }

    let rowIndex = 0;
    summaries.forEach(summary => {
      rowIndex++;
      worksheet.mergeCells(`A${rowIndex}:B${rowIndex}`);
      worksheet.getCell(`A${rowIndex}`).value = summary;
    });
    return rowIndex;
  }

  private setExcelColumnsHeaderForHtmlTable(table: any, worksheet: any, rowIndex: number) {
    this.setExcelHeaderSticky(worksheet, rowIndex);

    const headerColumns: ExcelColumn[] = [];

    table.children('thead').find('th').each(function (): void {
      if (this.classList.contains('print')) {

        const headerColumn = { headerTitle: this.textContent.trim() } as ExcelColumn;

        for (let i = 0, l = this.classList.length; i < l; ++i) {
          if (/-ex-type-.*/.test(this.classList[i])) {
            const columnType = this.classList[i].replace('-ex-type-', '');

            if (columnType) {
              headerColumn.type = columnType;
            }
          }

          if (/-ex-width-.*/.test(this.classList[i])) {
            headerColumn.width = Number(this.classList[i].replace('-ex-width-', ''));
          }
        }

        headerColumns.push(headerColumn);
      }
    });

    return this.setExcelColumnsHeader(headerColumns, worksheet, rowIndex);
  }

  private setExcelTbodyTable(table: any, worksheet: any, selectable: boolean, rowIndex: number, replaces: SearchUnit[]) {
    let makeRow = false;

    table.children('tbody').find('tr').each(function (): void {
      rowIndex++;
      const $this = $(this);

      if (this.classList.contains('print')) {
        const checkBoxes = $this.children('td').find('input');

        makeRow = !selectable ||
          (selectable &&
            checkBoxes.length === 1 &&
            checkBoxes[0].classList.contains('select') &&
            (<HTMLInputElement>checkBoxes[0]).checked
          );

        if (makeRow) {
          const newRow = worksheet.getRow(rowIndex);
          newRow.font = { name: 'Calibri', family: 4, size: 10 };
          newRow.height = 25;

          let colIndex = 0;
          $this.children('td').each(function (): void {
            if (this.classList.contains('print')) {
              colIndex++;

              const columnValue = this.textContent.trim();

              for (let i = 0, l = this.classList.length; i < l; ++i) {
                if (/-ex-type-.*/.test(this.classList[i])) {
                  const columnType = this.classList[i].replace('-ex-type-', '');

                  if (columnType === 'number') {
                    let amount = parseFloat(columnValue.replace(/,/g, ''));
                    if (isNaN(amount)) { amount = 0.0; }
                    newRow.getCell(colIndex).value = amount;
                  }
                  else {
                    newRow.getCell(colIndex).value = replaceValue(columnValue.toString(), replaces, colIndex);
                  }
                  break;
                }
              }
            }
          });

          newRow.eachCell(function (cell) {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          });
        }
      }
    });
  }

  /**
   * Prints page
   * @param documentTitle 
   * @param styleId
   * @param bodyId 
   */
  printPage(documentTitle: string, styleId: string, bodyId: string) {
    const printerWindow = window.open('');

    printerWindow.document.write(`<html><head><title>${documentTitle}</title>`);
    for (let i = $('style').length - 1; i >= 0; i--) {
      if ($('style')[i].outerHTML.indexOf(styleId) !== -1) {
        printerWindow.document.write($('style')[i].outerHTML);
        break;
      }
    }
    printerWindow.document.write('</head><body>');
    printerWindow.document.write($(`#${bodyId}`).html());
    printerWindow.document.write('</body></html>');

    printerWindow.print();
    printerWindow.close();
  }

  printTable(documentTitle: string, tableId: string, selectable = true): void {
    if (selectable && this.noItemsSelected) { console.error('No Items Selected'); return; }

    const pWindow = window.open('');

    // pWindow.document.onreadystatechange = function () {
    //   if (this.readyState === 'complete') {
    //     this.onreadystatechange = function () { };
    //     pWindow.focus();
    //     pWindow.print();
    //     pWindow.close();
    //   }
    // }

    pWindow.document.write(`<html><head><title>${documentTitle}</title>`);
    pWindow.document.write(this.stylesheet);
    pWindow.document.write('</head><body>');
    pWindow.document.write('<table>');

    pWindow.document.write('<thead><tr>');

    const table = $(`#${tableId}`);

    table.children('thead').find('th').each(function (): void {
      if (this.classList.contains('print')) {
        pWindow.document.write(`<th>${this.textContent}</th>`);
      }
    });
    pWindow.document.write('</tr></thead>');

    pWindow.document.write('<tbody>');

    table.children('tbody').find('tr').each(function (): void {
      const $this = $(this);

      if (this.classList.contains('print')) {

        const checkBoxes = $this.children('td').find('input');

        if (
          checkBoxes.length === 1 &&
          checkBoxes[0].classList.contains('select') &&
          (<HTMLInputElement>checkBoxes[0]).checked
        ) {
          pWindow.document.write('<tr>');

          $this.children('td').each(function (): void {
            if (this.classList.contains('print')) {
              let style = '';
              if (this.classList.contains('left')) {
                style = ' class="left"';
              }
              else if (this.classList.contains('right')) {
                style = ' class="right"';
              }

              pWindow.document.write(`<td${style}>${this.textContent}</td>`);
            }
          });

          pWindow.document.write('</tr>');
        }
      }
    });

    pWindow.document.write('</tbody>');
    pWindow.document.write('</table>');
    pWindow.document.write('</body></html>');
    pWindow.document.close();

    setTimeout(() => {
      pWindow.print();
      pWindow.close();
    });
  }

  uploadExcel(event: any, tableId: string, renameToAlphaColumns: boolean): void {
    const tableIdExp = `#${tableId}`;

    $(tableIdExp).empty();

    const files = event.target.files;
    const outThis = this;

    if (!files || files.length === 0) {
      outThis.onImportTableRendered.next(this.translator.get('common.message.invalidSelectedFiles'));
      return;
    }

    const excelFile = event.target.files[0];

    const reader = new FileReader();

    // Checks whether the browser supports HTML5
    if (typeof (FileReader) === 'undefined') {
      outThis.onImportTableRendered.next(this.translator.get('common.message.notSupportHtml5'));
      return;
    }

    let excelJson;
    reader.onload = (e: any) => {
      const data = e.target.result;

      // pre-process data
      let binary = '';
      const bytes = new Uint8Array(e.target.result);
      const length = bytes.byteLength;
      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }

      const workbook = XLSX.read(binary, { type: 'binary', cellDates: true, cellStyles: true });

      const sheetNames = workbook.SheetNames;

      const sheet = workbook.Sheets[sheetNames[0]];

      let serialNonValueColumnCount = 0;

      ////////////////////////////////////////////////////////
      // 컬럼 이름 스캔
      // 컬럼 이름을 모두 스캔하고 넉넉하게 10열정도 값이 있는지 확인한후
      // 10행까지 값이 없을경우 작업을 마감하고 10행 EMPTY값을 제거한다.
      const columnNames = [];
      let columnCount = 0;
      while (serialNonValueColumnCount < 10) {
        const colIndex = convertToBase26(columnCount + 1);
        const value = sheet[colIndex + '1'] ? sheet[colIndex + '1'].v.toLowerCase().trim() : '';
        columnNames.push(value);
        columnCount++;
        serialNonValueColumnCount = value === '' ? serialNonValueColumnCount + 1 : 0;
      }
      columnNames.splice(columnNames.length - 10, 10);
      /////////////////////////////////////////////////////////

      // 컬럼이름을 A B C와 같은 알파벳 이름으로 변경
      for (let i = 0; i < columnNames.length; i++) {
        const colIndex = convertToBase26(i + 1);
        sheet[colIndex + '1'] = { t: 's' /* type: string */, v: colIndex /* value */ };
      }

      const target = document.querySelector(tableIdExp);

      if (columnNames.length === 0) {
        outThis.onImportTableRendered.next(this.translator.get('common.message.emptyFile'));
        return;
      }


      // Browser Thread 동적 Table Append ReRendering이 끝난후 Datatable을 Render해야 한다.
      // create an observer instance
      const observer = new MutationObserver(function (mutations): void {
        $(tableIdExp).DataTable().destroy();
        $(tableIdExp).DataTable();
        $(tableIdExp).show();

        observer.disconnect();

        outThis.onImportTableRendered.next({ excelJson: excelJson, columnNames: columnNames });
      });

      // configuration of the observer:
      const config = { attributes: true, childList: true, characterData: true };
      // pass in the target node, as well as the observers options
      observer.observe(target, config);

      $(tableIdExp).hide();

      excelJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);

      if (excelJson.length > 0) {
        outThis.bindTable(excelJson, tableIdExp);
      }
    };

    reader.readAsArrayBuffer(excelFile);
  }

  private bindTable(jsonData, tableId): void {
    const columns = this.bindTableHeader(jsonData, tableId);
    const tbody$ = $('<tbody/>');
    for (let i = 0; i < jsonData.length; i++) {
      const row$ = $('<tr/>');
      for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        let cellValue = jsonData[i][columns[colIndex]];
        if (cellValue === null) {
          cellValue = '';
        }
        row$.append($('<td/>').html(cellValue));
      }
      tbody$.append(row$);
    }
    $(tableId).append(tbody$);
  }

  private bindTableHeader(jsonData, tableId): any {
    const columnSet = [];
    const headerTr$ = $('<tr/>');
    for (let i = 0; i < jsonData.length; i++) {
      const rowHash = jsonData[i];
      for (const key in rowHash) {
        if (rowHash.hasOwnProperty(key)) {
          if ($.inArray(key, columnSet) === -1) {
            columnSet.push(key);
            headerTr$.append($('<th/>').html(key));
          }
        }
      }
    }
    const headerThead$ = $('<thead/>').append(headerTr$);
    $(tableId).append(headerThead$);
    return columnSet;
  }
}
