import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { String } from 'typescript-string-operations';
import * as _ from 'lodash';

import { DataTableDirective } from 'angular-datatables';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService, DialogType } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveDialogSetting } from '../../../classes/dialog-setting';
import { OliveImportFileDialogComponent } from '../../dialogs/import-file-dialog/import-file-dialog.component';
import { OliveSearchDialogComponent } from '../../dialogs/search-dialog/search-dialog.component';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveDocumentService } from 'app/core/services/document.service';
import { NameValue } from 'app/core/models/name-value';
import { OliveDataService } from 'app/core/interfaces/data-service';
import { ListerSetting } from 'app/core/interfaces/setting/lister-setting';
import { OliveEditDialogComponent } from '../../dialogs/edit-dialog/edit-dialog.component';
import { OliveBaseComponent } from '../../extends/base/base.component';
import { OliveOnEdit } from 'app/core/interfaces/on-edit';
import { OliveConstants } from 'app/core/classes/constants';
import { OliveBackEndErrors } from 'app/core/classes/back-end-errors';
import { trimStringByMaxLength, splitStickyWords } from 'app/core/utils/string-helper';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { hasTextSelection } from 'app/core/utils/olive-helpers';

@Component({
  selector: 'olive-entity-list',
  template: '',
  animations: fuseAnimations
})
export class OliveEntityListComponent extends OliveBaseComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  tdId: string;

  items: any[];
  recordsTotal: number;
  sourceItem: any;

  loadingIndicator: boolean;
  selectedAll: any;

  keywordFilter: FormControl;

  _setting: ListerSetting;

  constructor(translator: FuseTranslationLoaderService, protected alertService: AlertService, 
    protected accountService: AccountService, protected messageHelper: OliveMessageHelperService, 
    protected documentService: OliveDocumentService, protected dialog: MatDialog, 
    protected dataService: OliveDataService) {
    super(translator);
  }

  get title() {
    return this.listTitle();
  }

  get setting(): ListerSetting {
    return this._setting;
  }
  set setting(theSetting: ListerSetting) {
    this._setting = theSetting;
    this._setting.dataTableId = 
      splitStickyWords(this.setting.itemType.name, '-')
      .toLowerCase() + '-table';
  }

  get canManageItems() {
    if (this.isNull(this.setting.managePermission)) { return true; }
    return this.accountService.userHasPermission(this.setting.managePermission);
  }

  get visibleContextMenu(): boolean {
    if (!this.setting.disabledContextMenus) { return true; }

    if (this.setting.disabledContextMenus.find(f => f === OliveConstants.contextMenu.all)) { return false; }

    if (this.setting.disabledContextMenus.length === 4) { return false; }

    return true;
  }

  listTitle() {
    return this.translator.get(this.setting.translateTitleId);
  }

  contextButtonVisible(name: string): boolean {
    if (!this.visibleContextMenu) { return false; }
    if (!this.setting.disabledContextMenus) { return true; }
    return this.setting.disabledContextMenus.find(f => f === name) == null;
  }

  /**
   * Initializes child component 
   * : virtual - ngOnInit()에서 Call됨
   */
  initializeChildComponent() { }

  icon(item: any, columnName: string) { return false; }
  iconName(item: any, columnName: string) { return ''; }
  onTdClick(event: any, item: any, columnName: string): void { return;  }
  getEditorCustomTitle(item: any): string { return null; }
  convertModel(model: any): any { return model; }
  getEditDialogReadOnly(item: any): boolean { return this.setting.isEditDialogReadOnly; }
  getEditDialogDeleteDisabled(item: any): boolean { return false; }
  navigateDetailPage(item: any) { }
  onDestroy() { }
  onItemsLoaded() { }
  onSaved(model: any) { }
  customContextMenu(id: string) { }

  renderItem(item: any, columnName: string): string { return ''; }
  renderFooterItem(column: any): string { return ''; }

  setTdId(id: number, columnName: string) {
    this.tdId = id.toString() + columnName;
  }

  private initializeComponent() {
  }

  ngOnInit() {
    this.initializeComponent();
    this.initializeChildComponent();
    this.initKeywordFilter();
    this.initializeDataTable();
  }

  initializeDataTable() {
    if (!this.setting) { return; }

    this.dtOptions = {
      pagingType: 'full_numbers',
      serverSide: true,
      processing: true,
      scrollX: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        dataTablesParameters['extsearch'] = this.getExtraSearch();

        this.loadItems(dataTablesParameters, callback);
      },
      columns: this.dataTableColumns,
      dom: 'ltip',
      ordering: !this.setting.hideSortArrow,
      order: this.dataTableOrders
    };

    $(document).ready(function () {
      $('.olive-datatable').css('width', '100%');
    });
  }

  /**
   * Gets data only columns
   */
  get dataOnlyColumns(): any[] {
    return this.setting.columns.filter(c => c.data !== OliveConstants.constant.selected);
  }

  /**
   * Gets need to add checkboxes
   */
  get needToAddCheckboxes(): boolean {
    return !this.setting.hideSelectCheckBox && !this.setting.columns.find(x => x.data === OliveConstants.constant.selected);
  }

  /**
   * Gets data table columns
   */
  get dataTableColumns(): any[] {
    // 체크박스 옵션이라면 컬럼에 Checkbox 추가
    if (this.needToAddCheckboxes) {
      return [{ data: OliveConstants.constant.selected, orderable: false }].concat(this.setting.columns);
    }

    return this.setting.columns;
  }

  /**
   * Gets data table orders
   */
  get dataTableOrders(): any[] {
    const returnOrders: any[] = [];
    const orders = this.setting.orders ? this.setting.orders : [];

    // 정렬을 하지 않았다면 기본정렬을 만든다.
    if (orders.length === 0) {
      for (const column of this.dataTableColumns) {
        const columnName = column.data.toLowerCase();
        if (columnName === 'id') {
          orders.push([columnName, 'desc']);
          break;
        }
        else if (columnName === 'createdUtc'.toLowerCase()) {
          orders.push([columnName, 'desc']);
          break;
        }
      }

      if (orders.length === 0) {
        console.error('dataTableOrder has no order');
      }
    }

    for (const order of orders) {
      let colIndex = 0;
      for (const column of this.dataTableColumns) {
        if (order[0].toLowerCase() === column.data.toLowerCase()) {
          returnOrders.push([colIndex, order[1]]);
        }
        colIndex++;
      }
    }

    return returnOrders;
  }

  /**
   * Inits keyword filter
   */
  initKeywordFilter() {
    this.keywordFilter = new FormControl(null, null);

    this.keywordFilter.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((value: string) => {
        $('#' + this.setting.dataTableId).DataTable().search(value).draw();
      });
  }

  itemsLoader(getItemsService: any, callback): void {
    getItemsService.subscribe(response => {
      this.alertService.stopLoadingMessage();
      this.loadingIndicator = false;

      this.items = this.convertModel(response.model);

      this.recordsTotal = response.itemsCount;

      this.onItemsLoaded();

      callback({
        recordsTotal: response.itemsCount,
        recordsFiltered: response.itemsCount,
        data: []
      });
    },
      error => {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.messageHelper.showLoadFailedSticky(error);
      });
  }

  loadItems(dataTablesParameters: any, callback) {
    this.itemsLoader(this.dataService.getItems(dataTablesParameters), callback);
  }

  protected getExtraSearch(): NameValue[] {
    if (!this.setting.extraSearches) { return []; }
    return this.setting.extraSearches;
  }

  dataTable(): any {
    return $('#' + this.setting.dataTableId).DataTable();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.onDestroy();
  }

  reRender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.clear().destroy();
      // Call the dtTrigger to reRender again
      this.dtTrigger.next();
    });
  }

  private updateItem(item: any) {
    if (this.sourceItem) {
      if (Array.isArray(item)) {
        Object.assign(this.sourceItem, item[0]);

        // id 형식
        if (item[0].id) {
          let itemIndex = this.items.findIndex(x => x.id === item[0].id);
          for (let index = 1; index < item.length; index++) {
            itemIndex++;
            this.items.splice(itemIndex, 0, item[index]);
          }
        }
        else { // id 형식이 아니면 그냥 삽입
          for (let index = 1; index < item.length; index++) {
            this.items.push(item[index]);
          }
        }
      }
      else {
        Object.assign(this.sourceItem, item);
      }
      this.sourceItem = null;
    }
    else {
      this.items.push(item);
    }

    this.onSaved(item);
  }

  protected editItem(item?: any, event?: any, startTabIndex = 0) {
    if (hasTextSelection()) {
      return;
    }

    if (event && event.srcElement && event.srcElement.getAttribute('type') === 'checkbox') { return; }

    if (!this.setting.editComponent) {
      if (this.setting.navigateDetailPage) {
        this.navigateDetailPage(item);
      }
      return;
    }

    if
      (
      // NewItem
      (!item && !event) ||
      // TD Click과 TR Click이 이중으로 Fire되어서 TD Click 'ov-td-click' Class를 추가
      // TD Click을 Custom Function으로 사용했을 경우 TR Click은 Fire하지 않는다.
      (event && event.srcElement && !event.srcElement.classList.contains('ov-td-click')) ||
      // Manual Event / Custom Event
      item && event && event.type && event.type === 'custom'
    ) {
      this.sourceItem = item;

      if (item && this.setting.loadDetail && !item.loadDetail) {
        this.loadingIndicator = true;

        this.dataService.getItem(item.id).subscribe(
          response => {
            this.loadingIndicator = false;

            response.model.loadDetail = true;

            Object.assign(this.sourceItem, response.model);

            this.openDialog(startTabIndex);
          },
          error => {
            this.loadingIndicator = false;
            this.messageHelper.showLoadFailedSticky(error);
          }
        );
      }
      else {
        this.openDialog(startTabIndex);
      }
    }
  }

  openDialog(startTabIndex) {
    const setting = new OliveDialogSetting(
      this.setting.editComponent,
      {
        item: _.cloneDeep(this.sourceItem),
        itemType: this.setting.itemType,
        managePermission: this.setting.managePermission,
        customTitle: this.getEditorCustomTitle(this.sourceItem),
        startTabIndex: startTabIndex,
        readOnly: this.getEditDialogReadOnly(this.sourceItem),
        deleteDisabled: this.getEditDialogDeleteDisabled(this.sourceItem),
        customButtons: this.setting.editCustomButtons
      } as OliveOnEdit
    );

    const dialogRef = this.dialog.open(
      OliveEditDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: setting,
        autoFocus: false
      });

    dialogRef.afterClosed().subscribe(item => {
      if (item && this.canManageItems) {
        if (typeof item === 'object') {
          this.updateItem(item);
        }
        else {
          this.items = this.items.filter(p => p.id !== item);
        }
      }
    });
  }

  openSearchDialog() {
    const dialog = new OliveDialogSetting(this.setting.searchComponent, null);
    const dialogRef = this.dialog.open(
      OliveSearchDialogComponent,
      {
        disableClose: false,
        panelClass: 'mat-dialog-md',
        data: dialog
      });

    this.keywordFilter.setValue('');

    dialogRef.afterClosed().subscribe(searches => {
      if (searches != null) {
        this.setting.extraSearches = searches;
        this.dataTable().search('').draw();
      }
    });
  }

  selectAll() {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.items.every(x => x.selected);
  }

  checkAllIfNoItemsSelected() {
    if (this.documentService.noItemsSelected) {
      this.selectedAll = true;      
      this.selectAll();
    }
  }

  onExcel() {
    this.checkAllIfNoItemsSelected();
    setTimeout(() => {
      this.documentService.exportHtmlTableToExcel(this.title, this.setting.dataTableId);
    });
  }

  onPrint() {
    this.checkAllIfNoItemsSelected();
    this.documentService.printTable(this.title, this.setting.dataTableId);
  }

  onUploaded(model: any) {
    this.reRender();
  }

  onUpload() {
    const dialogRef = this.dialog.open(
      OliveImportFileDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: { importType: this.setting.itemType.name }
      });

    dialogRef.componentInstance.onSave.subscribe(data => {
      this.uploadItems(data, dialogRef);
    });
  }

  uploadItems(data: any, dialogRef: any) {
    this.uploadHandler(data.excelJson.length, this.dataService.uploadItems(data), dialogRef);
  }

  showUploadSuccessMessage(item: any, itemCount: number): string {
    return String.Format(this.translator.get('common.message.uploadSaved'), this.commaNumber(itemCount));
  }

  getRefreshButtonNameAfterUploading(): string {
    return this.translator.get('common.button.refresh');
  }

  uploadHandler(itemCount: number, handler: any, dialogRef: any): void {
    handler.subscribe(
      response => {
        this.messageHelper.showSavedUploadSuccess();
        dialogRef.componentInstance.closeDialog();
        dialogRef.componentInstance.showLoadingBar = false;

        this.alertService.showDialog
          (
            this.translator.get('common.title.success'),
            this.showUploadSuccessMessage(response.model, itemCount),
            DialogType.alert,
            () => this.onUploaded(response.model),
            null,
            this.getRefreshButtonNameAfterUploading()
          );
      },
      error => {
        let errorMessage = null;
        if (error === 'session expired') {
          dialogRef.componentInstance.closeDialog();
        }
        else if (error.error && error.error.errorCode) {
          const errorCode = error.error.errorCode;
          if (errorCode === OliveBackEndErrors.columnsUnmatchedError) {
            const diffs = error.error.errorMessage.split('/');
            if (diffs.length === 3) {
              errorMessage = String.Format(this.translator.get('common.message.uploadColumnMatchError'), diffs[0], diffs[1], diffs[2]);
            }
            else {
              errorMessage = this.translator.get('common.message.errorOccurred');
            }
          }
          else if (errorCode.includes(OliveBackEndErrors.concurrencyError)) {
            const duplicatedKeysString = error.error.errorCode.replace(OliveBackEndErrors.concurrencyError + '-', '');
            errorMessage = String.Format(this.translator.get('common.entryError.concurrencyKeyName'), duplicatedKeysString);
            errorMessage = trimStringByMaxLength(errorMessage, OliveConstants.uiConfig.maxErrorMessageLength);
          }
          else {
            errorMessage = this.translator.get('common.message.uploadDataSignatureUnregistered');
          }
        }
        else {
          errorMessage = error.error.errorMessage;
        }

        if (errorMessage) {
          dialogRef.componentInstance.showError(errorMessage);
        }
      }
    );
  }

  renderTdTooltip(item: any, column: any) { return null; }

  renderTDClass(item: any, column: any, addedClass: string) {
    let classString = this.isNull(column.tdClass) ? '' : column.tdClass;

    if (!this.setting.editComponent && !this.setting.navigateDetailPage) {
      classString += ' normal-cursor';
    }

    if (addedClass) {
      classString += ' ' + addedClass;
    }

    return classString;
  }

  renderTHClass(classString: any) {
    return this.isNull(classString) ? '' : classString;
  }

  renderTableClass(): string {
    return 'hover olive-datatable row-border';
  }
}
