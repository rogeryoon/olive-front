import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { DeviceDetectorService } from 'ngx-device-detector';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from '../../../core/i18n/en';
import { LookupListerSetting } from 'app/core/interfaces/lister-setting';
import { AlertService } from '@quick/services/alert.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { Utilities } from '@quick/services/utilities';
import { OliveUtilities } from 'app/core/classes/utilities';
import { OliveDialogSetting } from 'app/core/classes/dialog-setting';
import { OliveEditDialogComponent } from '../edit-dialog/edit-dialog.component';

const Id = 'id';
const Code = 'code';
const Name = 'name';

@Component({
  selector: 'olive-lookup-dialog',
  templateUrl: './lookup-dialog.component.html',
  styleUrls: ['./lookup-dialog.component.scss']
})
export class OliveLookupDialogComponent implements OnInit {
  
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  items: any;

  loadingIndicator: boolean;
  selectedAll: any;
  searhKeyword = '';

  selectedItems: any = [];

  defaultCodeColumns: any = [
    { data: Code, name: 'Code', width: '50px', align: 'center' },
    { data: Name, name: 'Name', width: '100%', align: 'justify' }
  ];

  defaultIdColumns: any = [
    { data: Id, name: 'ID', width: '50px', align: 'center' },
    { data: Name, name: 'Name', width: '100%', align: 'justify' }
  ];

  constructor(
    protected dialog: MatDialog,
    public dialogRef: MatDialogRef<OliveLookupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public setting: LookupListerSetting,
    private translater: FuseTranslationLoaderService,
    private alertService: AlertService,
    private messageHelper: OliveMessageHelperService,
    private deviceService: DeviceDetectorService
  ) {
    this.initializeComponent();
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      serverSide: true,
      processing: true,
      scrollX: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.setting.dataService.getItems(dataTablesParameters)
          .subscribe(response => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;

            this.items = response.model;

            callback({
              recordsTotal: response.itemsCount,
              recordsFiltered: response.itemsCount,
              data: []
            });
          },
            error => {
              this.alertService.stopLoadingMessage();
              this.loadingIndicator = false;

              this.messageHelper.showLoadFaild(error);
            });
      },
      columns: this.tableColumns,
      dom: 'lftip',
      columnDefs: [
        { targets: 'nosort', orderable: false }
      ],
      order: [[this.checkBoxEnable ? 1 : 0, 'desc']]
    };

    const filterInputId = `#${this.setting.dataTableId}_filter input`;

    $('.olive-datatable').css('width', '100%');

    setTimeout(() => {
      $(filterInputId).unbind();

      const params = {
        deviceService: this.deviceService,
        dataTableId: this.setting.dataTableId
      };

      $(filterInputId).bind('keyup', params, this.onSearch);
      $(filterInputId).bind('blur', params, this.onSearch);
    }, 10);
  }

  onSearch(event: any) {
    const param = event.data;
    if ( (param.deviceService.isDesktop() && event.key === 'Enter') ||
        param.deviceService.isMobile() || event.type === 'blur') {
          $('#' + param.dataTableId).DataTable().search(event.target.value).draw();
    }
  }

  initializeComponent() {
    this.translater.loadTranslations(english);

    this.setting.dataTableId = OliveUtilities
      .splitStickyWords(this.setting.name, '-')
      .toLowerCase() + '-table';

    if (this.checkBoxEnable) {
      this.tableColumns.unshift({ data: 'selected' });
    }
  }

  get checkBoxEnable() {
    return this.setting.maxSelectItems > 1;
  }

  get itemsSelected() {
    return this.checkBoxEnable && this.selectedItems.length > 0;
  }

  private get tableColumns(): any {
    let returnColumns = this.setting.columns;
    if (this.setting.columns === Code) {
      returnColumns = this.defaultCodeColumns;
    }
    else if (this.setting.columns === Id) {
      returnColumns = this.defaultIdColumns;
    }
    return returnColumns;
  }

  private clickItem(item?: any, event?: Event) {
    if (event && event.srcElement.getAttribute('type') === 'checkbox') { return; }

    item.selected = !item.selected;
    this.saveToSelectedItems(item);

    if (this.setting.maxSelectItems === 1) {
      this.select();
    }
  }

  private saveToSelectedItems(item: any) {
    if (item.selected) {
      const notExists = this.selectedItems.every(function (checkItem: any) {
        return checkItem.id !== item.id;
      });

      if (notExists) {
        this.selectedItems.push(item);
      }
    }
    else {
      for (let i = 0; i < this.selectedItems.length; i++) {
        if (this.selectedItems[i].id === item.id) {
          this.selectedItems.splice(i, 1);
        }
      }
    }
  }

  select(): void {
    this.dialogRef.close(this.selectedItems);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  newItem(): void {
    const setting = new OliveDialogSetting(
      this.setting.newComponent,
      {
        itemType: this.setting.itemType,
        managePermission: this.setting.managePermission,
        translateTitleId: this.setting.translateTitleId
      }
    );

    const dialogRef = this.dialog.open(
      OliveEditDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: setting
      });

    dialogRef.afterClosed().subscribe(item => {
      if (item) {
        this.items.push(item);
        this.selectedItems.push(item);
        this.select();
      }
    });
  }

  renderItem(item: any, columnName: string): string {
    if (this.setting.renderCallback) {
      return this.setting.renderCallback(item, columnName);
    }
    else {
      let retValue = '';
      switch (columnName) {
        case Id:
          retValue = OliveUtilities.convertToBase36(item.id);
          break;

        case Code:
          retValue = item.code;
          break;

        case Name:
          retValue = item.name;
          break;
      }
      return retValue;
    }
  }

  selectAll() {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].selected = this.selectedAll;
      this.saveToSelectedItems(this.items[i]);
    }
  }

  checkAllSelected(checkItem: any) {
    this.saveToSelectedItems(checkItem);

    this.selectedAll = this.items.every(function (item: any) {
      return item.selected === true;
    });
  }

  renderStyle(styleString: any) {
    return Utilities.TestIsUndefined(styleString) ? '' : styleString;
  }

  get dataColumns() {
    return this.tableColumns.filter(c => c.data !== 'selected');
  }
}
