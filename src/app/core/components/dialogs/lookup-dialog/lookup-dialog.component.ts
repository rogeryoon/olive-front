import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { String } from 'typescript-string-operations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';

import { LookupListerSetting } from 'app/core/interfaces/setting/lookup-lister-setting';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveDialogSetting } from 'app/core/classes/dialog-setting';
import { OliveEditDialogComponent } from '../../dialogs/edit-dialog/edit-dialog.component';
import { OliveChipInputComponent } from '../../entries/chip-input/chip-input.component';
import { IIDName } from 'app/core/models/id-name';
import { OliveBaseComponent } from '../../extends/base/base.component';
import { splitStickyWords } from 'app/core/utils/string-helper';
import { addSearchOption } from 'app/core/utils/search-helpers';

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

  selectedItems: any = [];

  keywordFilter: FormControl;

  codeColumns: any = [
    { data: Code, name: this.translator.get('common.tableHeader.code'), width: '50px', align: 'center' },
    { data: Name, name: this.translator.get('common.tableHeader.name'), orderable: false, align: 'justify' }
  ];

  idColumns: any = [
    { data: Id, name: this.translator.get('common.tableHeader.id'), width: '50px', align: 'center' },
    { data: Name, name: this.translator.get('common.tableHeader.name'), orderable: false, align: 'justify' }
  ];

  tableColumns: any;

  constructor(
    protected dialog: MatDialog, protected formBuilder: FormBuilder,
    protected alertService: AlertService, protected messageHelper: OliveMessageHelperService,
    public dialogRef: MatDialogRef<OliveLookupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public setting: LookupListerSetting,
    translator: FuseTranslationLoaderService
  ) {
    super(translator);
    this.initializeComponent();
  }

  /**
   * on init
   */
  ngOnInit() {
    this.initKeywordFilter();
    this.initTable();
    this.initChip();
  }

  /**
   * Gets dialog title
   */
  get dialogTitle(): string {
    let title = '';

    if (this.setting.itemTitle) {
      title = String.Format(this.translator.get('common.title.chooseItemOrItemsForName'), this.setting.itemTitle);
    }
    else if (this.setting.maxSelectItems === 1) {
      title = this.translator.get('common.title.chooseItem');
    }
    else {
      title = this.translator.get('common.title.chooseItems');
    }

    return title;
  }

  /**
   * Gets selected item remark
   */
  get selectedItemRemark(): string {
    let remark = '';

    if (this.setting.currentItem && this.setting.currentItem.name) {
      remark = String.Format(this.translator.get('common.title.currentItem'), this.setting.currentItem.name);
    }

    return remark;
  }

  /**
   * Gets check box enable
   */
  get checkBoxEnable() {
    return this.setting.maxSelectItems > 1;
  }

  /**
   * Gets items selected
   */
  get itemsSelected() {
    return this.checkBoxEnable && this.selectedItems.length > 0;
  }

  get searchPlaceHolderName() {
    return this.setting.searchPlaceHolderName ? this.setting.searchPlaceHolderName : this.translator.get('common.word.search');
  }

  /**
   * Gets tr mouse cursor
   */
  get trMouseCursor(): string {
    return this.setting.trMouseCursor ? this.setting.trMouseCursor : '';
  }

  /**
   * Gets data columns
   */
  get dataColumns() {
    if (this.tableColumns === null) { return null; }
    return this.tableColumns.filter(c => c.data !== 'selected');
  }

  /**
   * Initializes component
   */
  private initializeComponent() {
    this.setting.dataTableId =
      splitStickyWords(this.setting.itemType.name, '-')
        .toLowerCase() + '-table';
  }

  /**
   * Inits chip
   */
  initChip() {
    this.oForm = this.formBuilder.group({
      chips: null
    });
  }

  /**
   * Inits table
   */
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
        this.setting.dataService.getItems(addSearchOption(dataTablesParameters, this.setting.searchOption))
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

              this.messageHelper.showLoadFailedSticky(error);
            });
      },
      columns: this.tableColumns,
      dom: 'tip',
      columnDefs: [
        { targets: 'nosort', orderable: false }
      ],
      order: this.getTableOrders()
    };

    $('.olive-datatable').css('min-width', '700px'); // .css('width', '100%');
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

  /**
   * Creates chip
   * @param item 
   * @returns  
   */
  protected createChip(item: any) { return item; }

  /**
   * Determines whether chip removed on
   * @param chip 
   */
  onChipRemoved(chip: IIDName) {
    const found = this.items.find(i => i.id === chip.id);

    if (found) {
      found.selected = false;
    }

    this.removeItemOnSelectedItems(chip, false);
  }

  /**
   * Sets items selected
   */
  private setItemsSelected() {
    this.items.forEach(item => {
      this.selectedItems.forEach(sItem => {
        if (item.id === sItem.id) {
          item.selected = true;
        }
      });
    });
  }

  /**
   * Gets custom table columns
   * @returns custom table columns 
   */
  protected getCustomTableColumns(): any {
    return null;
  }

  /**
   * Gets table orders
   * @returns table orders 
   */
  protected getTableOrders(): any[][] {
    return [[this.checkBoxEnable ? 1 : 0, 'desc']];
  }

  /**
   * Determines whether custom click on
   * @param [item] 
   */
  protected onCustomClick(item?: any) { }

  /**
   * Sets table columns
   */
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

  /**
   * Selects items
   */
  selectItems(): void {
    this.dialogRef.close(this.selectedItems);
  }

  /**
   * Clicks item
   * @param [item] 
   * @param [event] 
   * @returns  
   */
  clickItem(item?: any, event?: any) {
    if (event && event.srcElement.getAttribute('type') === 'checkbox' || this.setting.maxSelectItems === 0) { return; }

    if (this.setting.customClick) {
      this.onCustomClick(item);
    }
    else {
      item.selected = !item.selected;
      this.saveSelectedItems(item);
      this.closeDialogMaxItemsIsOneItem();
    }
  }

  /**
   * Closes dialog max items is one item
   */
  private closeDialogMaxItemsIsOneItem() {
    if (this.setting.maxSelectItems === 1) {
      this.dialogRef.close(this.selectedItems);
    }
  }

  /**
   * Removes item on selected items
   * @param item 
   * @param chipRemove 
   */
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

  /**
   * Saves selected items
   * @param item 
   */
  saveSelectedItems(item: any) {
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

  /**
   * Cancels olive lookup dialog component
   */
  cancel(): void {
    this.dialogRef.close(null);
  }

  /**
   * Add new item
   */
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

  /**
   * Renders item
   * @param item 
   * @param columnName 
   * @returns item 
   */
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

  /**
   * Renders style
   * @param styleString 
   * @returns  
   */
  renderStyle(styleString: any) {
    return this.isNull(styleString) ? '' : styleString;
  }

  /**
   * Renders TD class
   * @param classString 
   * @returns  
   */
  renderTDClass(classString: any) {
    return this.isNull(classString) ? '' : classString;
  }

  /**
   * Renders TH class
   * @param classString 
   * @returns  
   */
  renderTHClass(classString: any) {
    return this.isNull(classString) ? '' : classString;
  }
}
