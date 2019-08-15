import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { String } from 'typescript-string-operations';

import { DeviceDetectorService } from 'ngx-device-detector';

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
import { ListerSetting } from 'app/core/interfaces/lister-setting';
import { OliveUtilities } from 'app/core/classes/utilities';
import { OliveEditDialogComponent } from '../../dialogs/edit-dialog/edit-dialog.component';
import * as _ from 'lodash';
import { OliveBaseComponent } from '../../extends/base/base.component';
import { OliveOnEdit } from 'app/core/interfaces/on-edit';
import { OliveConstants } from 'app/core/classes/constants';
import { OliveBackEndErrors } from 'app/core/classes/back-end-errors';

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

  items: any;
  recordsTotal: number;
  sourceItem: any;

  loadingIndicator: boolean;
  selectedAll: any;
  savedFilterValue = '';
  searchKeyword = '';

  _setting: ListerSetting;

  constructor(translator: FuseTranslationLoaderService,
    protected deviceService: DeviceDetectorService,
    protected alertService: AlertService,
    protected accountService: AccountService,
    protected messageHelper: OliveMessageHelperService,
    protected documentService: OliveDocumentService,
    protected dialog: MatDialog,
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
    this._setting.dataTableId = OliveUtilities
      .splitStickyWords(this.setting.itemType.name, '-')
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
  onTdClick(event: any, item: any, columnName: string): boolean { return false; }
  getEditorCustomTitle(item: any): string { return null; }
  convertModel(model: any): any { return model; }
  getEditDialogReadOnly(item: any): boolean { return this.setting.isEditDialogReadOnly; }
  navigateDetailPage(item: any) { }
  onDestroy() {}
  onItemsLoaded() {}
  onSaved(model: any) {}
  customContextMenu(id: string) { }
  
  renderItem(item: any, columnName: string): string { return ''; }
  renderFooterItem(column: any): string { return ''; }

  setTdId(id: number, columnName: string) {
    this.tdId = id.toString() + columnName;
  }

  private initializeComponent() {
  }

  onSearch(event: any) {
    if (
      this.savedFilterValue !== event.target.value &&
      (
        (this.deviceService.isDesktop() && event.key === 'Enter') ||
        this.deviceService.isMobile() ||
        event.type === 'blur'
      )
    ) {
      this.dataTable().search(event.target.value).draw();
      this.savedFilterValue = event.target.value;
    }
  }

  ngOnInit() {
    this.initializeComponent();
    this.initializeChildComponent();
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
      columns: this.setting.columns,
      dom: 'ltip',
      columnDefs: [
        { targets: 'nosort', orderable: false }
      ],
      order: this.setting.order ? this.setting.order : [[1, 'desc']]
    };

    $(document).ready(function () {
      $('.olive-datatable').css('width', '100%');
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
      Object.assign(this.sourceItem, item);
      this.sourceItem = null;
    }
    else {
      this.items.push(item);
    }

    this.onSaved(item);    
  }

  protected editItem(item?: any, event?: any, startTabIndex = 0) {
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
        customButtons: this.setting.editCustomButtons
      } as OliveOnEdit
    );

    const dialogRef = this.dialog.open(
      OliveEditDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: setting
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

    this.searchKeyword = '';
    this.savedFilterValue = '';

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

  onExcel() {
    this.documentService.exportHtmlTableToExcel(this.title, this.setting.dataTableId);
  }

  onPrint() {
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
    this.uploadHandler(this.dataService.uploadItems(data), dialogRef);
  }

  uploadHandler(handler: any, dialogRef: any): void {
    handler.subscribe(
      response => {
        this.messageHelper.showSavedUploadSuccess();
        dialogRef.componentInstance.closeDialog();
        dialogRef.componentInstance.showLoadingBar = false;

        this.alertService.showDialog
          (
            this.translator.get('common.title.success'),
            this.translator.get('common.message.uploadSaved'),
            DialogType.alert,
            () => this.onUploaded(response.model),
            null,
            this.translator.get('common.button.refresh')
          );
      },
      error => {
        let errorMessage = null;
        if (error === 'session expired') {
          dialogRef.componentInstance.closeDialog();
        }
        else if (error.error && error.error.errorCode) {
          if (error.error.errorCode === OliveBackEndErrors.columnsUnmatchedError) {
            const diffs = error.error.errorMessage.split('/');
            if (diffs.length === 3) {
              errorMessage = String.Format(this.translator.get('common.message.uploadColumnMatchError'), diffs[0], diffs[1], diffs[2]);
            }
            else {
              errorMessage = this.translator.get('common.message.errorOccurred');
            }
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
      classString = 'normal-cursor';
    }

    if (addedClass) {
      classString += ' ' + addedClass;
    }

    return classString;
  }

  renderTHClass(classString: any) {
    return this.isNull(classString) ? '' : classString;
  }

  get dataColumns() {
    return this.setting.columns.filter(c => c.data !== 'selected');
  }

  renderTableClass(): string{
    return 'hover olive-datatable row-border';
  }
}
