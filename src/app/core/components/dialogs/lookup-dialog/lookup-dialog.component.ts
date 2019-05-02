import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { DeviceDetectorService } from 'ngx-device-detector';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';

import { LookupListerSetting } from 'app/core/interfaces/lister-setting';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveUtilities } from 'app/core/classes/utilities';
import { OliveDialogSetting } from 'app/core/classes/dialog-setting';
import { OliveEditDialogComponent } from '../../dialogs/edit-dialog/edit-dialog.component';
import { OliveChipInputComponent } from '../../entries/chip-input/chip-input.component';
import { IIDName } from 'app/core/models/id-name';
import { NameValue } from 'app/core/models/name-value';
import { OliveBaseComponent } from '../../extends/base/base.component';

const Id = 'id';
const Code = 'code';
const Name = 'name';

@Component({
  selector: 'olive-lookup-dialog',
  templateUrl: './lookup-dialog.component.html',
  styleUrls: ['./lookup-dialog.component.scss']
})
export class OliveLookupDialogComponent extends OliveBaseComponent implements OnInit {
  @ViewChild(OliveChipInputComponent)
  chipInput: OliveChipInputComponent;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  items: any;

  loadingIndicator: boolean;
  searhKeyword = '';

  selectedItems: any = [];

  oForm: FormGroup;

  codeColumns: any = [
    { data: Code, name: 'Code', width: '50px', align: 'center' },
    { data: Name, name: 'Name', orderable: false, align: 'justify' }
  ];

  idColumns: any = [
    { data: Id, name: 'ID', width: '50px', align: 'center' },
    { data: Name, name: 'Name', orderable: false, align: 'justify' }
  ];

  tableColumns: any;

  constructor(
    protected dialog: MatDialog,
    protected formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<OliveLookupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public setting: LookupListerSetting,
    translater: FuseTranslationLoaderService,
    protected alertService: AlertService,
    protected messageHelper: OliveMessageHelperService,
    protected deviceService: DeviceDetectorService
  ) {
    super(translater);
    this.initializeComponent();
  }

  ngOnInit() {
    this.initTable();
    this.initChip();
  }

  initChip() {
    this.oForm = this.formBuilder.group({
      chips: null
    });
  }

  initTable() {
    this.setTableColumns();

    if (this.checkBoxEnable) {
      this.tableColumns.unshift({ data: 'selected' });
    }

    this.dtOptions = {
      pageLength: 5,
      pagingType: 'full_numbers',
      serverSide: true,
      processing: true,
      scrollX: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        dataTablesParameters['extsearch'] = this.getExtraSearch();

        this.setting.dataService.getItems(dataTablesParameters)
          .subscribe(response => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;

            this.items = response.model;
            this.setItemsSelected();

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
      dom: this.setting.disableSearchInput ? 'tip' : 'ftip',
      columnDefs: [
        { targets: 'nosort', orderable: false }
      ],
      order: [[this.checkBoxEnable ? 1 : 0, 'desc']]
    };

    const filterInputId = `#${this.setting.dataTableId}_filter input`;

    $('.olive-datatable').css('min-width', '700px'); // .css('width', '100%');

    if (this.setting.disableSearchInput) {
      setTimeout(() => {
        $(filterInputId).unbind();
  
        const params = {
          deviceService: this.deviceService,
          dataTableId: this.setting.dataTableId
        };
  
        $(filterInputId).bind('keyup', params, this.onSearch);
        $(filterInputId).bind('blur', params, this.onSearch);
      }, 100);
    }
  }

  onSearch(event: any) {
    const param = event.data;
    if ((param.deviceService.isDesktop() && event.key === 'Enter') ||
      param.deviceService.isMobile() || event.type === 'blur') {
      $('#' + param.dataTableId).DataTable().search(event.target.value).draw();
    }
  }

  protected getExtraSearch(): NameValue[] { 
    if (!this.setting.extraSearches) { return []; }
    return this.setting.extraSearches; 
  }
  protected createChip(item: any) { return item; }

  private initializeComponent() {
    this.setting.dataTableId = OliveUtilities
      .splitStickyWords(this.setting.itemType.name, '-')
      .toLowerCase() + '-table';
  }

  chipRemoved(chip: IIDName) {
    const found = this.items.find(i => i.id === chip.id);

    if (found) {
      found.selected = false;
    }

    this.removeItemOnSelectedItems(chip, false);    
  }

  private setItemsSelected() {
    this.items.forEach(item => {
      this.selectedItems.forEach(sItem => {
        if (item.id === sItem.id) {
          item.selected = true;
        }
      });
    });
  }

  get checkBoxEnable() {
    return this.setting.maxSelectItems > 1;
  }

  get itemsSelected() {
    return this.checkBoxEnable && this.selectedItems.length > 0;
  }

  get trMouseCursor(): string {
    return this.setting.trMouseCursor ? this.setting.trMouseCursor : '';
  }

  protected getCustomTableColumns(): any {
    return null;
  }

  protected onCustomClick(item?: any) {}

  private setTableColumns() {
    switch (this.setting.columnType) {
      case Code:
        this.tableColumns = this.codeColumns;
        break;

      case Id:
        this.tableColumns = this.idColumns;
        break;

      default:
        this.tableColumns = this.getCustomTableColumns();
        break;
    }
  }

  select(): void {
    this.dialogRef.close(this.selectedItems);
  }

  clickItem(item?: any, event?: any) {
    if (event && event.srcElement.getAttribute('type') === 'checkbox' || this.setting.maxSelectItems === 0) { return; }

    if (this.setting.customClick) {
      this.onCustomClick(item);
    }
    else {
      item.selected = !item.selected;
      this.saveToSelectedItems(item);
      this.closeDialogMaxItemsIsOneItem();
    }
  }

  private closeDialogMaxItemsIsOneItem() {
    if (this.setting.maxSelectItems === 1) {
      this.dialogRef.close(this.selectedItems);
    }
  }

  private removeItemOnSelectedItems(item: any, chipRemove: boolean) {
    for (let i = 0; i < this.selectedItems.length; i++) {
      if (this.selectedItems[i].id === item.id) {
        this.selectedItems.splice(i, 1);

        if (chipRemove) {
          this.chipInput.remove(item, true);
        }
      }
    }
  }

  private saveToSelectedItems(item: any) {
    if (item.selected) {
      const notExists = this.selectedItems.every(function (checkItem: any) {
        return checkItem.id !== item.id;
      });

      if (notExists) {
        this.selectedItems.push(Object.assign(item));

        if (this.chipInput) {
          this.chipInput.addChip(this.createChip(item));
        }
      }
    }
    else {
      this.removeItemOnSelectedItems(item, true);
    }
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
        this.selectedItems.push(Object.assign(item));
        this.closeDialogMaxItemsIsOneItem();
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
          retValue = this.id36(item.id);
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

  renderStyle(styleString: any) {
    return this.isNull(styleString) ? '' : styleString;
  }

  get dataColumns() {
    if (this.tableColumns === null) { return null; }
    return this.tableColumns.filter(c => c.data !== 'selected');
  }
}
