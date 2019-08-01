import { Component, forwardRef, Output, EventEmitter, Input } from '@angular/core';
import {
  FormBuilder, FormControl, ValidationErrors,
  NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor,
  Validator } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Permission } from '@quick/models/permission.model';
import { AlertService } from '@quick/services/alert.service';

import { OliveInWarehouseItemDataSource } from './in-warehouse-item-data-source';
import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { LookupListerSetting } from 'app/core/interfaces/lister-setting';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { NameValue } from 'app/core/models/name-value';
import { InWarehouseItem } from '../../../models/in-warehouse-item.model';
import { InWarehouse } from '../../../models/in-warehouse.model';
import { OlivePurchaseOrderLookupDialogComponent } from 'app/main/purchasings/purchases/purchase-order/purchase-order-lookup-dialog/purchase-order-lookup-dialog.component';
import { OlivePurchaseOrderService } from 'app/main/purchasings/services/purchase-order.service';
import { PurchaseOrder } from 'app/main/purchasings/models/purchase-order.model';
import { OliveCacheService } from 'app/core/services/cache.service';
import { Warehouse } from 'app/main/supports/models/warehouse.model';
import { OliveUtilities } from 'app/core/classes/utilities';
import { PurchaseOrderItem } from 'app/main/purchasings/models/purchase-order-item.model';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';

@Component({
  selector: 'olive-in-warehouse-items-editor',
  templateUrl: './in-warehouse-items-editor.component.html',
  styleUrls: ['./in-warehouse-items-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OliveInWarehouseItemsEditorComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OliveInWarehouseItemsEditorComponent),
      multi: true,
    }
  ]
})
export class OliveInWarehouseItemsEditorComponent extends OliveEntityFormComponent implements ControlValueAccessor, Validator {
  displayedColumns = ['productVariantId', 'name', 'balance', 'price', 'quantityDue', 'quantity', 'remark', 'actions'];
  dataSource: OliveInWarehouseItemDataSource = new OliveInWarehouseItemDataSource(this.cacheService);

  warehouse: Warehouse;
  value: InWarehouseItem[] = null;

  @Input() isVoidMode = false;

  @Output() requiredWarehouse = new EventEmitter();
  @Output() inWarehouseItemAdded = new EventEmitter();

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private purchaseOrderService: OlivePurchaseOrderService, private snackBar: MatSnackBar,
    private dialog: MatDialog, private alertService: AlertService,
    private cacheService: OliveCacheService, private messageHelperService: OliveMessageHelperService,
  ) {
    super(
      formBuilder, translator
    );
  }

  initializeChildComponent() {
    this.standCurrency = this.cacheService.standCurrency;

    if (!this.isVoidMode) {
      this.displayedColumns.splice(1, 0, 'supplier');
    }
  }

  getEditedItem(): InWarehouseItem[] {
    return this.dataSource.items;
  }

  buildForm() {
    this.oFormArray = this.formBuilder.array([]);
    this.oForm = this.formBuilder.group({
      formArray: this.oFormArray
    });
    this.dataSource.formGroup = this.oForm;
  }

  resetForm() {
    this.oForm.patchValue({
    });
  }

  setWarehouse(event: any) {
    this.warehouse = event.item;

    if (event.loading) {
      return;
    }

    let needToClearItems = false;

    if (
      this.isNull(this.warehouse) ||
      this.warehouse.id === this.warehouse.id ||
      this.dataSource.items.length === 0
    ) {
      needToClearItems = true;
    }

    if (needToClearItems) {
      this.clearAllItemsDataSource();

      if (!this.isNull(this.warehouse)) {
        this.lookupPurchaseOrder();
      }
    }
  }

  clearAllItemsDataSource() {
    this.oFormArray.controls = [];
    this.dataSource.deleteAll();
  }

  createEmptyObject() {
    return new InWarehouse();
  }

  private deleteItem(item: any) {
    if (item.Obj.id || item.Obj.name || item.Obj.quantity || item.Obj.price || item.Obj.remark) {
      this.snackBar.open(
        OliveUtilities.showParamMessage(this.translator.get('common.message.confirmDelete')),
        this.translator.get('common.button.delete'),
        { duration: 5000 }
      )
        .onAction().subscribe(() => {
          this.deleteUnit(item);
        });
    }
    else {
      this.deleteUnit(item);
    }
  }

  private deleteUnit(item: any) {
    this.dataSource.deleteItem(item);
    if (this.dataSource.items.length === 0) {
      this.oFArray.removeAt(0);
    }
  }

  get totalQuantity(): number {
    let quantity = 0;

    this.dataSource.items.forEach(item => {
      if (!isNaN(item.quantity)) {
        quantity += +item.quantity;
      }
    });

    return quantity;
  }

  get totalBalance(): number {
    let balance = 0;

    this.dataSource.items.forEach(item => {
      if (!isNaN(item.balance)) {
        balance += +item.balance;
      }
    });

    return balance;
  }

  get totalQuantityDue(): number {
    let due = 0;

    this.dataSource.items.forEach(item => {
      if (!isNaN(item.quantity) && !isNaN(item.price)) {
        due += +item.quantity * +item.price;
      }
    });

    return due;
  }

  lookupPurchaseOrder() {
    // 창고가 선택되지 않았다면 창고 먼저 선택한다.
    if (this.isNull(this.warehouse)) {
      this.requiredWarehouse.emit();
      return;
    }

    const dialogRef = this.dialog.open(
      OlivePurchaseOrderLookupDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: {
          name: 'PurchaseOrder',
          columnType: 'custom',
          dialogTitle: this.translator.get(NavTranslates.Purchase.list),
          dataService: this.purchaseOrderService,
          maxSelectItems: 10,
          itemType: PurchaseOrder,
          managePermission: Permission.manageProductsPermission,
          translateTitleId: NavTranslates.Purchase.list,
          maxNameLength: 10,
          extraSearches: [
            this.isVoidMode ? 
            { name: 'Cancelable', value: 'true' } :
            { name: 'InWarehousePending', value: 'true' },
            { name: 'Warehouse', value: this.warehouse.id }
          ] as NameValue[]
        } as LookupListerSetting
      });

    dialogRef.afterClosed().subscribe(pItems => {
      if (!pItems || pItems.length === 0) { return; }

      const duplicatedIdStrings: string[] = [];
      const dupPOItemIdCheckSet = new Set();
      let onePurchaseOrderId = 0;

      // 발주서 하나만 선택가능, 이후 추가 버튼을 눌러도 다른 발주서를 로딩 못하게 막음 (VoidMode)
      if (this.dataSource.items.length > 0) {
        onePurchaseOrderId = ((this.dataSource.items[0]) as InWarehouseItem).id;
      }

      this.dataSource.items.forEach((dsItem: InWarehouseItem) => {
        pItems
          .forEach((pItem: PurchaseOrder) => {
            pItem.purchaseOrderItems
              .filter((sItem: PurchaseOrderItem) => 
                dsItem.purchaseOrderItemId === sItem.id || 
                (this.isVoidMode && onePurchaseOrderId !== 0 && onePurchaseOrderId !== pItem.id)
              )
              .forEach((sItem: PurchaseOrderItem) => {
                if (!dupPOItemIdCheckSet.has(sItem.id)) {
                  dupPOItemIdCheckSet.add(sItem.id);
                  duplicatedIdStrings.push(
                    `${this.id36(sItem.id)}: ${sItem.name}`.trimRight());
                }
              });
          });
      });

      let needToRender = false;

      let firstAddedPurchaseOrder: PurchaseOrder = null; 

      pItems
        .forEach((pItem: PurchaseOrder) => {
          pItem.purchaseOrderItems
            .filter((sItem: PurchaseOrderItem) => 
              (
                ( !this.isVoidMode && sItem.balance > 0 ) ||
                ( this.isVoidMode && sItem.quantity - sItem.balance + sItem.cancelQuantity > 0)
              ) && 
              !dupPOItemIdCheckSet.has(sItem.id)
            )
            .forEach((sItem: PurchaseOrderItem) => {
              let quantity = 0;

              if (this.isVoidMode) {
                quantity = sItem.quantity - sItem.balance + sItem.cancelQuantity;
              }
              else {
                quantity = sItem.balance;
              }

              if (!firstAddedPurchaseOrder) {
                firstAddedPurchaseOrder = pItem;
              }

              this.dataSource.addNewItem({
                quantity: quantity,
                balance: 0,

                purchaseOrderItemId: sItem.id,

                name: sItem.name,
                originalBalance: quantity,
                price: sItem.price,
                productVariantId: sItem.productVariantId,
                supplierName: pItem.supplierFk.name
              } as InWarehouseItem);
              needToRender = true;
            });
        });

      this.inWarehouseItemAdded.emit(firstAddedPurchaseOrder);

      if (needToRender) {
        this.dataSource.renderItems();
        this.oForm.markAsDirty();
      }

      this.messageHelperService.showDuplicatedItems(duplicatedIdStrings);
    });
  }

  updateBalance(index: number) {
    const quantityValue = this.getArrayFormGroup(index).get('quantity').value;

    if (OliveUtilities.isNumberPattern(quantityValue)) {
      const item = this.dataSource.items[index];
      item.balance = item.originalBalance - this.getNumber(quantityValue);
    }
  }

  get noItemSelectedError(): boolean {
    return this.dataSource.items.length === 0;
  }

  get balanceIsMinusError(): boolean {
    return this.dataSource.items.some((item: InWarehouseItem) => item.balance < 0);
  }

  protected hasOtherError(): boolean {
    if (this.noItemSelectedError) {
      this.alertService.showMessageBox(
        this.translator.get('common.title.errorConfirm'),
        this.translator.get('common.message.noItemCreated')
      );

      return true;
    }

    if (this.balanceIsMinusError) {
      this.alertService.showMessageBox(
        this.translator.get('common.title.errorConfirm'),
        this.translator.get('common.message.balanceIsMinus')
      );

      return true;
    }
  }

  get showNoItemCreatedError(): boolean {
    return this.noItemSelectedError && this.oForm.touched;
  }

  get showBalanceIsMinusError(): boolean {
    return this.balanceIsMinusError && this.oForm.touched;
  }

  private _onChange = (_: any) => { };
  private _onTouched = () => { };

  writeValue(obj: any): void {
    this.value = obj;
    this.item = obj;

    if (obj) {
      this.dataSource.loadItems(obj);
    }
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  onChange(event: any) {
    this._onChange(event.target.value);
  }
  onKeyup(event: any) {
    this._onChange(event.target.value);
  }
  onBlur(event: any) {
    this._onTouched();
  }

  validate(c: FormControl): ValidationErrors {
    return this.oForm.errors;
  }
}
