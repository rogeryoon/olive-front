import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import * as Excel from 'exceljs/dist/exceljs.js';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AlertService } from '@quick/services/alert.service';

import { locale as english } from '../../core/i18n/en';

@Injectable()
export class OliveDocumentService {

  onImportTableRendered: Subject<any> = new Subject;

  constructor(
    private translater: FuseTranslationLoaderService,
    private alertService: AlertService
  ) {
    this.translater.loadTranslations(english);
  }

  private css(): string {
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

  private noItemSelected(): boolean {
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

  exportExcel(fileName: string, tableId: string): void {
    if (this.noItemSelected()) { return; }

    const workbook = new Excel.Workbook();

    const worksheet = workbook.addWorksheet(fileName);
    worksheet.views = [
      { state: 'frozen', xSplit: 0, ySplit: 1 }
    ];

    const table = $(`#${tableId}`);

    const columns = [];

    let excelColumnCharIndex = '@';

    table.children('thead').find('th').each(function (): void {
      if (this.classList.contains('print')) {
        excelColumnCharIndex = String.fromCharCode(excelColumnCharIndex.charCodeAt(0) + 1);

        const columnTitle = this.textContent.trim();

        let colWidth = 10;
        let style;
        for (let i = 0, l = this.classList.length; i < l; ++i) {
          if (/-ex-type-.*/.test(this.classList[i])) {
            const columnType = this.classList[i].replace('-ex-type-', '');

            if (columnType === 'id') {
              colWidth = 10;
              style = { alignment: { vertical: 'middle', horizontal: 'center' } };
            }
            else
              if (columnType === 'money') {
                colWidth = 10;
                style = { alignment: { vertical: 'middle', horizontal: 'right' } };
              }
              else
                if (columnType === 'text') {
                  style = { alignment: { vertical: 'middle', horizontal: 'left', indent: 1 } };
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

        const columnDefinition = { header: columnTitle, key: columnTitle, width: colWidth };

        if (style) {
          columnDefinition['style'] = style;
        }

        columns.push(columnDefinition);
      }
    });

    worksheet.autoFilter = `A1${excelColumnCharIndex}1`;
    worksheet.columns = columns;

    const headerRow = worksheet.getRow(1);
    headerRow.font = { name: 'Calibri', family: 4, size: 12, bold: true, color: { argb: 'FF335EFF' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 25;

    let rowIndex = 1;
    const rows = [];

    table.children('tbody').find('tr').each(function (): void {
      rowIndex++;
      const $this = $(this);

      if (this.classList.contains('print')) {

        const checkBoxes = $this.children('td').find('input');

        if (
          checkBoxes.length === 1 &&
          checkBoxes[0].classList.contains('select') &&
          (<HTMLInputElement>checkBoxes[0]).checked
        ) {

          const newRow = worksheet.getRow(rowIndex);
          newRow.font = { name: 'Calibri', family: 4, size: 10 };
          newRow.height = 20;

          const rowCols = [];

          let colIndex = 0;
          $this.children('td').each(function (): void {
            if (this.classList.contains('print')) {
              colIndex++;

              const columnValue = this.textContent.trim();

              for (let i = 0, l = this.classList.length; i < l; ++i) {
                if (/-ex-type-.*/.test(this.classList[i])) {
                  const columnType = this.classList[i].replace('-ex-type-', '');

                  if (columnType === 'money') {
                    let amount = parseFloat(columnValue.replace(/,/g, ''));
                    if (isNaN(amount)) { amount = 0.0; }
                    newRow.getCell(colIndex).value = amount;
                  }
                  else {
                    newRow.getCell(colIndex).value = columnValue;
                  }
                  break;
                }
              }
            }
          });
        }
      }
    });

    worksheet.addRows(rows);

    const buff = workbook.xlsx.writeBuffer().then(function (data): void {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, `${fileName}.xlsx`);
    });
  }

  printTable(documentTitle: string, tableId: string): void {
    if (this.noItemSelected()) { return; }

    const pwin = window.open('');

    pwin.document.write(`<html><head><title>${documentTitle}</title>`);
    pwin.document.write(this.css());
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

  uploadExcel(event: any, tableId: string): void {
    const tableIdExp = `#${tableId}`;

    $(tableIdExp).empty();

    const fileName = $('#excelfile').val().toString().toLowerCase();
    const regex = /\.(xlsx|xls)$/;

    if (regex.test(fileName)) {
      const files = event.target.files;

      if (!files || files.length === 0) {
        this.alertService.showMessageBox(
          this.translater.get('common.title.errorOccurred'),
          this.translater.get('common.message.invalidSelectedFiles')
        );
      }

      const outThis = this;
      const excelFile = event.target.files[0];

      // Checks whether the browser supports HTML5
      if (typeof (FileReader) !== 'undefined') {
        const reader = new FileReader();
        let exceljson;

        reader.onload = function (e: any): void {
          const data = e.target.result;

          // pre-process data
          let binary = '';
          const bytes = new Uint8Array(e.target.result);
          const length = bytes.byteLength;
          for (let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }

          const workbook = XLSX.read(binary, {type: 'binary', cellDates: true, cellStyles: true});

          const sheetNames = workbook.SheetNames;

          const target = document.querySelector('#import-table');
          
          // Browser Thread 동적 Table Append Redering이 끝난후 Datatable을 Render해야 한다.
          // create an observer instance
          const observer = new MutationObserver(function(mutations): void {
            $('#import-table').DataTable().destroy(); 
            $('#import-table').DataTable(); 

            $(tableIdExp).show();

            observer.disconnect();

            outThis.onImportTableRendered.next(exceljson);
          });
          
          // configuration of the observer:
          const config = { attributes: true, childList: true, characterData: true };
          // pass in the target node, as well as the observer options
          observer.observe(target, config);          

          $(tableIdExp).hide();

          let cnt = 0;
          sheetNames.forEach(function (y): void {
            exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);

            if (exceljson.length > 0 && cnt === 0) {
              outThis.bindTable(exceljson, tableIdExp);
              cnt++;
            }
          });
        };

        reader.readAsArrayBuffer(excelFile);
      }
      else {
        this.alertService.showMessageBox(
          this.translater.get('common.title.errorOccurred'),
          this.translater.get('common.message.notSupportHtml5')
        );
      }
    }
    else {
      this.alertService.showMessageBox(
        this.translater.get('common.title.notSelected'),
        this.translater.get('common.message.noExcelFile')
      );
    }
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
