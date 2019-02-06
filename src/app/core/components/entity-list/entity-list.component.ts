import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';

import { DeviceDetectorService } from 'ngx-device-detector';

import { DataTableDirective } from 'angular-datatables';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService, DialogType } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';
import { Utilities } from '@quick/services/utilities';

import { OliveDialogSetting } from '../../classes/dialog-setting';
import { OliveImportFileDialogComponent } from '../import-file-dialog/import-file-dialog.component';
import { OliveSearchDialogComponent } from '../search-dialog/search-dialog.component';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveDocumentService } from 'app/core/services/document.service';
import { NameValue } from 'app/core/models/name-value';
import { OliveDataService } from 'app/core/interfaces/data-service';
import { ListerSetting } from 'app/core/interfaces/lister-setting';
import { OliveUtilities } from 'app/core/classes/utilities';
import { locale as english } from '../../../core/i18n/en';
import { OliveEditDialogComponent } from '../edit-dialog/edit-dialog.component';
import * as _ from 'lodash';

@Component({
  selector: 'olive-entity-list',
  templateUrl: './entity-list.component.html',
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class OliveEntityListComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  tdId: string;

  items: any;
  sourceItem: any;

  loadingIndicator: boolean;
  selectedAll: any;
  savedFilterValue = '';
  searhKeyword = '';

  _setting: ListerSetting;

  constructor(protected translater: FuseTranslationLoaderService,
    protected deviceService: DeviceDetectorService,
    protected alertService: AlertService,
    protected accountService: AccountService,
    protected messageHelper: OliveMessageHelperService,
    protected documentService: OliveDocumentService,
    protected dialog: MatDialog,
    protected dataService: OliveDataService)
  {
    this.initializeComponent();
    this.initializeChildComponent();
  }

  get setting(): ListerSetting {
    return this._setting;
  }
  set setting(theSetting: ListerSetting) {
    this._setting = theSetting;
    this._setting.dataTableId = OliveUtilities
      .splitStickyWords(theSetting.name, '-')
      .toLowerCase() + '-table';
  }

  initializeChildComponent() {}
  icon(item: any, columnName: string) { return false; }
  iconName(item: any, columnName: string) { return ''; }
  onTdClick(event: any, item: any, columnName: string): boolean { return false; }
  getEditorCustomTitle(item: any): string { return null; }
  
  setTdId(id: number, columnName: string) {
    this.tdId = id.toString() + columnName;
  }
  
  private initializeComponent() {
    this.translater.loadTranslations(english);
  }

  get canManageItems() {
    if (Utilities.TestIsUndefined(this.setting.managePermission)) { return true; }
    return this.accountService.userHasPermission(this.setting.managePermission);
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
    this.dtOptions = {
      pagingType: 'full_numbers',
      serverSide: true,
      processing: true,
      scrollX: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        dataTablesParameters['extsearch'] = this.getExtraSearch();

        this.dataService.getItems(dataTablesParameters)
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
      columns: this.setting.columns,
      dom: 'ltip',
      columnDefs: [
        { targets: 'nosort', orderable: false }
      ],
      order: [[1, 'desc']]
    };

    $(document).ready(function () {
      $('.olive-datatable').css('width', '100%');
    });
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
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
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
  }

  protected editItem(item?: any, event?: Event) {
    if (event && event.srcElement && event.srcElement.getAttribute('type') === 'checkbox') { return; }

    if 
    (
      // NewItem
      (!item && !event) ||
      // TD Click과 TR Click이 이중으로 Fire되어서 TD Click 'ov-td-click' Class를 추가
      // TD Click을 Custom Function으로 사용했을 경우 TR Click은 Fire하지 않는다.
      (event && event.srcElement && !event.srcElement.classList.contains('ov-td-click')) ||
      // Manula Event / Custom Event
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
  
            this.openDialog();
          },
          error => {
            this.loadingIndicator = false;            
            this.messageHelper.showLoadFaild(error);
          }
        );
      }
      else
      {
        this.openDialog();
      }
    }
  }

  openDialog() {
    const setting = new OliveDialogSetting(
      this.setting.editComponent, 
      {
        item: _.cloneDeep(this.sourceItem),
        itemType: this.setting.itemType,
        managePermission: this.setting.managePermission,
        translateTitleId: this.setting.translateTitleId,
        customTitle: this.getEditorCustomTitle(this.sourceItem)
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

    this.searhKeyword = '';
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
    this.selectedAll = this.items.every(function (item: any) {
      return item.selected === true;
    });
  }

  onExcel() {
    this.documentService.exportExcel(this.translater.get(this.setting.translateTitleId), this.setting.name);
  }

  onPrint() {
    this.documentService.printTable(this.translater.get(this.setting.translateTitleId), this.setting.name);
  }

  onUpload() {
    const dialogRef = this.dialog.open(
      OliveImportFileDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: { importType: this.setting.name }
      });

    dialogRef.componentInstance.onSave.subscribe(data => {
      this.dataService.uploadItems(data).subscribe(
        response => {
          this.messageHelper.showSavedUploadSuccess();
          dialogRef.componentInstance.closeDialog();
          dialogRef.componentInstance.showLoadingBar = false;

          this.alertService.showDialog
            (
            this.translater.get('common.title.success'),
            this.translater.get('common.message.uploadSaved'),
            DialogType.alert,
            () => this.rerender(),
            null,
            this.translater.get('common.button.refresh')
            );
        },
        error => {
          this.messageHelper.showSaveFailed(error, false);
          dialogRef.componentInstance.showError(error.error.errorMessage);
        }
      );
    });
  }

  renderTdTooltip(item: any, column: any) { return null; }

  renderTDClass(item: any, column: any, addedClass: string) {
    let classString = Utilities.TestIsUndefined(column.tdClass) ? '' : column.tdClass;

    if (addedClass) {
      classString += ' ' + addedClass;
    }
    
    return classString;
  }

  renderTHClass(classString: any) {
    return Utilities.TestIsUndefined(classString) ? '' : classString;
  }

  get dataColumns() {
    return this.setting.columns.filter(c => c.data !== 'selected');
  }
}
