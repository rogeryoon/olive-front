import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import * as Excel from 'exceljs/dist/exceljs.js';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AlertService } from '@quick/services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class OliveDocumentService {

  onImportTableRendered: Subject<any> = new Subject;

  constructor(
    private translater: FuseTranslationLoaderService,
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

  private get noItemSelected(): boolean {
    const selectedCheckboxExists = $('input[name="select"]:checked').length > 0;

    if (!selectedCheckboxExists) {
      this.alertService.showMessageBox(
        this.translater.get('common.title.notSelected'),
        this.translater.get('common.message.selectItem')
      );
      return true;
    }

    return false;
  }

  exportExcel(fileName: string, tableId: string, selectable = true, summaries: string[] = []): void {
    if (selectable && this.noItemSelected) { return; }

    const workbook = new Excel.Workbook();

    const worksheet = workbook.addWorksheet(fileName);

    const table = $(`#${tableId}`);

    let rowIndex = this.setExcelSummaries(worksheet, summaries);

    rowIndex = this.setExcelColsHeader(table, worksheet, rowIndex);

    this.setExcelTbodyTable(table, worksheet, selectable, rowIndex);

    workbook.xlsx.writeBuffer().then(function (data): void {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, `${fileName}.xlsx`);
    });
  }

  private setExcelSummaries(worksheet: any, summaries: string[]) {
    let rowIndex = 0;
    summaries.forEach(summary => {
      rowIndex++;
      worksheet.mergeCells(`A${rowIndex}:B${rowIndex}`);
      worksheet.getCell(`A${rowIndex}`).value = summary;
    });
    return rowIndex;
  }

  private setExcelColsHeader(table: any, worksheet: any, rowIndex: number) {
    if (rowIndex === 0) {
      worksheet.views = [
        { state: 'frozen', xSplit: 0, ySplit: 1 }
      ];
    }

    const columns = [];
    const columnTitles = [];
    let excelColumnCharIndex = '@';

    table.children('thead').find('th').each(function (): void {
      if (this.classList.contains('print')) {
        excelColumnCharIndex = String.fromCharCode(excelColumnCharIndex.charCodeAt(0) + 1);

        const columnTitle = this.textContent.trim();
        columnTitles.push(columnTitle);

        let colWidth = 10;
        let style;
        for (let i = 0, l = this.classList.length; i < l; ++i) {
          if (/-ex-type-.*/.test(this.classList[i])) {
            const columnType = this.classList[i].replace('-ex-type-', '');

            if (columnType === 'id') {
              colWidth = 10;
              style = { alignment: { vertical: 'middle', horizontal: 'center' } };
            }
            else if (columnType === 'number') {
              colWidth = 10;
              style = { alignment: { vertical: 'middle', horizontal: 'right' } };
            }
            else if (columnType === 'text') {
              style = { alignment: { vertical: 'middle', horizontal: 'left', indent: 1, wrapText: true } };
            }
            else {
              style = { alignment: { vertical: 'middle', horizontal: 'center' } };
            }
          }
          else
            if (/-ex-width-.*/.test(this.classList[i])) {
              colWidth = Number(this.classList[i].replace('-ex-width-', ''));
            }
        }

        const columnDefinition = { key: columnTitle, width: colWidth };

        if (style) {
          columnDefinition['style'] = style;
        }

        columns.push(columnDefinition);
      }
    });

    if (rowIndex === 0) {
      worksheet.autoFilter = `A1${excelColumnCharIndex}1`;
    }
    worksheet.columns = columns;

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

  private setExcelTbodyTable(table: any, worksheet: any, selectable: boolean, rowIndex: number) {
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
                    newRow.getCell(colIndex).value = columnValue.toString();
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

  printPage(documentTitle: string, styleId: string, bodyId: string) {
    const pwin = window.open('');

    pwin.document.write(`<html><head><title>${documentTitle}</title>`);
    for (let i = $('style').length - 1; i >= 0; i--) {
      if ($('style')[i].outerHTML.indexOf(styleId) !== -1) {
        pwin.document.write($('style')[i].outerHTML);
        break;
      }
    }
    pwin.document.write('</head><body>');
    pwin.document.write($(`#${bodyId}`).html());
    pwin.document.write('</body></html>');

    pwin.print();
    pwin.close();
  }

  printTable(documentTitle: string, tableId: string): void {
    if (this.noItemSelected) { return; }

    const pwin = window.open('');

    pwin.document.write(`<html><head><title>${documentTitle}</title>`);
    pwin.document.write(this.stylesheet);
    pwin.document.write('</head><body>');
    pwin.document.write('<table>');

    pwin.document.write('<thead><tr>');

    const table = $(`#${tableId}`);

    table.children('thead').find('th').each(function (): void {
      if (this.classList.contains('print')) {
        pwin.document.write(`<th>${this.textContent}</th>`);
      }
    });
    pwin.document.write('</tr></thead>');

    pwin.document.write('<tbody>');

    table.children('tbody').find('tr').each(function (): void {
      const $this = $(this);

      if (this.classList.contains('print')) {

        const checkBoxes = $this.children('td').find('input');

        if (
          checkBoxes.length === 1 &&
          checkBoxes[0].classList.contains('select') &&
          (<HTMLInputElement>checkBoxes[0]).checked
        ) {
          pwin.document.write('<tr>');

          $this.children('td').each(function (): void {
            if (this.classList.contains('print')) {
              let style = '';
              if (this.classList.contains('left')) {
                style = ' class="left"';
              }
              else if (this.classList.contains('right')) {
                style = ' class="right"';
              }

              pwin.document.write(`<td${style}>${this.textContent}</td>`);
            }
          });

          pwin.document.write('</tr>');
        }
      }
    });

    pwin.document.write('</tbody>');
    pwin.document.write('</table>');
    pwin.document.write('</body></html>');

    pwin.print();
    pwin.close();
  }

  public static numToAlpha(num: number): string {
    let alpha = '';
  
    for (; num >= 0; num = parseInt((num / 26).toString(), 10) - 1) {
      alpha = String.fromCharCode(num % 26 + 0x41) + alpha;
    }
  
    return alpha;
  }

  uploadExcel(event: any, tableId: string, renameToAlphaColumns: boolean): void {
    const tableIdExp = `#${tableId}`;

    $(tableIdExp).empty();

    const files = event.target.files;
    const outThis = this;    

    if (!files || files.length === 0) {
      outThis.onImportTableRendered.next(this.translater.get('common.message.invalidSelectedFiles'));
      return;
    }

    const excelFile = event.target.files[0];

    const reader = new FileReader();

    // Checks whether the browser supports HTML5
    if (typeof (FileReader) === 'undefined') {
      outThis.onImportTableRendered.next(this.translater.get('common.message.notSupportHtml5'));
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
        const colIndex = OliveDocumentService.numToAlpha(columnCount);
        const value = sheet[colIndex + '1'] ? sheet[colIndex + '1'].v.toLowerCase().trim() : '';
        columnNames.push(value);
        columnCount++;
        serialNonValueColumnCount = value === '' ? serialNonValueColumnCount + 1 : 0;
      }
      columnNames.splice(columnNames.length - 10, 10);
      /////////////////////////////////////////////////////////

      // 컬럼이름을 A B C와 같은 알파벳 이름으로 변경
      for (let i = 0; i < columnNames.length; i++) {
        const colIndex = OliveDocumentService.numToAlpha(i);
        sheet[colIndex + '1'] = { t: 's' /* type: string */, v: colIndex /* value */ };
      }

      const target = document.querySelector(tableIdExp);

      if (columnNames.length === 0) {
        outThis.onImportTableRendered.next(this.translater.get('common.message.emptyFile'));
        return;
      }


      // Browser Thread 동적 Table Append Redering이 끝난후 Datatable을 Render해야 한다.
      // create an observer instance
      const observer = new MutationObserver(function (mutations): void {
        $(tableIdExp).DataTable().destroy();
        $(tableIdExp).DataTable();
        $(tableIdExp).show();

        observer.disconnect();

        outThis.onImportTableRendered.next({excelJson : excelJson, columnNames: columnNames});
      });

      // configuration of the observer:
      const config = { attributes: true, childList: true, characterData: true };
      // pass in the target node, as well as the observers options
      observer.observe(target, config);

      $(tableIdExp).hide();

      let cnt = 0;
      sheetNames.forEach(function (y): void {
        excelJson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);

        if (excelJson.length > 0 && cnt === 0) {
          outThis.bindTable(excelJson, tableIdExp);
          cnt++;
        }
      });
    };

    reader.readAsArrayBuffer(excelFile);
  }

  private bindTable(jsondata, tableid): void {
    const columns = this.bindTableHeader(jsondata, tableid);
    const tbody$ = $('<tbody/>');
    for (let i = 0; i < jsondata.length; i++) {
      const row$ = $('<tr/>');
      for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        let cellValue = jsondata[i][columns[colIndex]];
        if (cellValue === null) {
          cellValue = '';
        }
        row$.append($('<td/>').html(cellValue));
      }
      tbody$.append(row$);
    }
    $(tableid).append(tbody$);
  }

  private bindTableHeader(jsondata, tableid): any {
    const columnSet = [];
    const headerTr$ = $('<tr/>');
    for (let i = 0; i < jsondata.length; i++) {
      const rowHash = jsondata[i];
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
    $(tableid).append(headerThead$);
    return columnSet;
  }
}
