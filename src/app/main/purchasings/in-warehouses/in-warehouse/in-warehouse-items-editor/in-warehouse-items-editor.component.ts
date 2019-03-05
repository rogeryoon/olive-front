import { Component, forwardRef } from '@angular/core';
import {
  FormBuilder, FormControl, ValidationErrors,
  NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, AbstractControl, FormArray, FormGroup
} from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { String } from 'typescript-string-operations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Permission } from '@quick/models/permission.model';
import { AlertService, MessageSeverity, DialogType } from '@quick/services/alert.service';

import { OliveInWarehouseItemDatasource } from './in-warehouse-item-datasource';
import { NavIcons } from 'app/core/navigations/nav-icons';
import { OliveEntityFormComponent } from 'app/core/components/entity-edit/entity-form.component';
import { LookupListerSetting } from 'app/core/interfaces/lister-setting';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { NameValue } from 'app/core/models/name-value';
import { locale as english } from '../../i18n/en';
import { InWarehouseItem } from '../models/in-warehouse-item.model';
import { InWarehouse } from '../models/in-warehouse.model';
import { OlivePurchaseOrderLookupDialogComponent } from 'app/main/purchasings/purchases/purchase-order/purchase-order-lookup-dialog/purchase-order-lookup-dialog.component';
import { OlivePurchaseOrderService } from 'app/main/purchasings/purchases/services/purchase-order.service';
import { OlivePurchaseOrderManagerComponent } from 'app/main/purchasings/purchases/purchase-order/purchase-order-manager/purchase-order-manager.component';
import { PurchaseOrder } from 'app/main/purchasings/purchases/models/purchase-order.model';
import { OliveCacheService } from 'app/core/services/cache.service';
import { Warehouse } from 'app/main/supports/companies/models/warehouse.model';
import { OliveUtilities } from 'app/core/classes/utilities';
import { PurchaseOrderItem } from 'app/main/purchasings/purchases/models/purchase-order-item.model';

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
  displayedColumns = ['viewId', 'vendor', 'name', 'quantity', 'balance', 'remark', 'actions'];
  itemsDataSource: OliveInWarehouseItemDatasource = new OliveInWarehouseItemDatasource(this.cacheService);

  parentItem: InWarehouse;
  wareHouse: Warehouse;
  value: InWarehouseItem[] = null;

  constructor(
    formBuilder: FormBuilder, translater: FuseTranslationLoaderService,
    private purchaseOrderService: OlivePurchaseOrderService, private snackBar: MatSnackBar,
    private dialog: MatDialog, private alertService: AlertService,
    private cacheService: OliveCacheService
  ) {
    super(
      formBuilder, translater
    );

    this.translater.loadTranslations(english);
  }

  initializeChildComponent() {
  }

  getEditedItem(): any {
    const formModel = this.oForm.value;

    return {
      // addedDiscountAmount: formModel.addedDiscountAmount,
      // freightAmount: formModel.freightAmount,
      // taxAmount: formModel.taxAmount,
      items: this.itemsDataSource.items
    };
  }

  buildForm() {
    this.oFormArray = this.formBuilder.array([]);
    this.oForm = this.formBuilder.group({ 
      formarray: this.oFormArray,
      // addedDiscountAmount: ['', [numberValidator(this.standCurrency.decimalPoint, true)]],
      // freightAmount: ['', [numberValidator(this.standCurrency.decimalPoint, true)]],
      // taxAmount: ['', [numberValidator(this.standCurrency.decimalPoint, true)]]
    });
    this.itemsDataSource.formGroup = this.oForm;
  }

  resetForm() {
    this.oForm.patchValue({
      // addedDiscountAmount: this.parentItem.addedDiscountAmount || '0',
      // freightAmount: this.parentItem.freightAmount || '0',
      // taxAmount: this.parentItem.taxAmount || '0',
    });
  }

  setParentItem(parentItem: any) {
    this.parentItem = parentItem;
  }
  
  setWarehouse(warehouse: Warehouse) {
    this.wareHouse = warehouse;
  }  

  createEmptyObject() {
    return new InWarehouse();
  }

  private addNewItem(item: InWarehouseItem) {
    this.itemsDataSource.addNewItem(item);
    this.oForm.markAsDirty();
  }

  private deleteItem(item: any) {
    if (item.Obj.id || item.Obj.name || item.Obj.quantity || item.Obj.price || item.Obj.remark) {
      this.snackBar.open(
        String.Format(this.translater.get('common.message.confirmDelete'), 'the data'),
        this.translater.get('common.button.confirmDelete'),
        { duration: 5000 }
      )
        .onAction().subscribe(() => {
          this.itemsDataSource.deleteItem(item);
        });
    }
    else {
      this.itemsDataSource.deleteItem(item);
    }
  }

  private deleteUnit(item: any) {
    this.itemsDataSource.deleteItem(item);
    if (this.itemsDataSource.items.length === 0) {
      this.oFArray.removeAt(0);
    }    
  }

  get totalQuantity(): number {
    let quantity = 0;

    this.itemsDataSource.items.forEach(item => {
      if (!isNaN(item.quantity)) {
        quantity += +item.quantity;
      }
    });

    return quantity;
  }

  get totalBalance(): number {
    let balance = 0;

    this.itemsDataSource.items.forEach(item => {
      if (!isNaN(item.balance)) {
        balance += +item.balance;
      }
    });

    return balance;
  }

  lookupPurchaseOrder() {
    if (this.isNull(this.wareHouse)) {
      this.alertService.showDialog(
        this.translater.get('common.title.confirm'),
        this.translater.get('inWarehouseItems.selectWarehouseFirst'),
        DialogType.alert,
        () => null
      );
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
          dialogTitle: this.translater.get(NavTranslates.Purchase.PurchaseOrderList),
          dataService: this.purchaseOrderService,
          maxSelectItems: 10,
          newComponent: OlivePurchaseOrderManagerComponent,
          itemType: PurchaseOrder,
          managePermission: Permission.manageProductsPermission,
          translateTitleId: NavTranslates.Purchase.PurchaseOrderList,
          maxNameLength: 10,
          extraSearches: [
            { name: 'ItemsExists', value: 'true' }, 
            { name: 'Warehouse', value: this.wareHouse.id }
          ] as NameValue[]
        } as LookupListerSetting
      });

    dialogRef.afterClosed().subscribe(pItems => {
      if (!pItems || pItems.length === 0) { return; }

      pItems
        .forEach((fItem: PurchaseOrder) => {
          fItem.purchaseOrderItems
            .filter((sItem: PurchaseOrderItem) => sItem.balance > 0)
            .forEach((sItem: PurchaseOrderItem) => {
              this.addNewItem({
                quantity: sItem.balance,
                balance: 0,
                originalBalance: sItem.balance,
                name: sItem.name,
                purchaseOrderFk: fItem,
                productVariantId: sItem.productVariantId
              } as InWarehouseItem);              
            });
        });
    });
  }

  updateBalace(index: number) {
    const formGroup = this.oFArray.controls[index] as FormGroup;

    const quantityValue = formGroup.get('quantity').value;

    if (OliveUtilities.isNumberPattern(quantityValue)) {
      const item = this.itemsDataSource.items[index];
      item.balance = item.originalBalance - this.getNumber(quantityValue);
    }
  }

  get noItemSelectedError(): boolean {
    return this.itemsDataSource.items.length === 0;
  }

  get balanceIsMinusError(): boolean {
    return this.itemsDataSource.items.some((item: InWarehouseItem) => item.balance < 0);
  }

  protected hasOtherError(): boolean {
    if (this.noItemSelectedError) {
      this.alertService.showDialog(
        this.translater.get('common.title.errorConfirm'),
        this.translater.get('common.message.noItemCreated'),
        DialogType.alert,
        () => null
      );

      return true;
    }

    if (this.balanceIsMinusError) {
      this.alertService.showDialog(
        this.translater.get('common.title.errorConfirm'),
        this.translater.get('common.message.balanceIsMinus'),
        DialogType.alert,
        () => null
      );

      return true;
    }
  }

  protected get showNoItemCreatedError(): boolean {
    return this.noItemSelectedError && this.oForm.touched;
  }

  protected get showBalanceIsMinusError(): boolean {
    return this.balanceIsMinusError && this.oForm.touched;
  }  

  viewId(item: InWarehouseItem): string {
    return `${this.id36(item.purchaseOrderFk.id)}-${this.id36(item.productVariantId)}` ;
  } 

  private _onChange = (_: any) => { };
  private _onTouched = () => { };

  writeValue(obj: any): void {
    this.value = obj;
    this.item = obj;

    if (obj) {
      this.itemsDataSource.loadItems(obj);
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
