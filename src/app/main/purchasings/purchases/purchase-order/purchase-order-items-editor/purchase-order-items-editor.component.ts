import { Component, forwardRef, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder, FormControl, ValidationErrors,
  NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, FormGroup
} from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Permission } from '@quick/models/permission.model';

import { PurchaseOrder } from '../../models/purchase-order.model';
import { PurchaseOrderItem } from '../../models/purchase-order-item.model';
import { PaymentMethod } from 'app/main/supports/companies/models/payment-method.model';
import { OlivePurchaseOrderItemDatasource } from './purchase-order-item-datasource';
import { NavIcons } from 'app/core/navigations/nav-icons';
import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { LookupListerSetting } from 'app/core/interfaces/lister-setting';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveProductVariantService } from 'app/main/productions/products/services/product-variant.service';
import { OliveProductVariantManagerComponent } from 'app/main/productions/products/product-variant/product-variant-manager/product-variant-manager.component';
import { ProductVariant } from 'app/main/productions/products/models/product-variant.model';
import { OliveProductVariantLookupDialogComponent } from 'app/main/productions/products/product-variant/product-variant-lookup-dialog/product-variant-lookup-dialog.component';
import { OlivePurchaseOrderService } from '../../services/purchase-order.service';
import { OlivePurchaseOrderManagerComponent } from '../purchase-order-manager/purchase-order-manager.component';
import { NameValue } from 'app/core/models/name-value';
import { OlivePurchaseOrderLookupDialogComponent } from '../purchase-order-lookup-dialog/purchase-order-lookup-dialog.component';
import { OliveCacheService } from 'app/core/services/cache.service';
import { Currency } from 'app/main/supports/bases/models/currency.model';
import { numberValidator } from 'app/core/classes/validators';
import { OliveUtilities } from 'app/core/classes/utilities';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';

@Component({
  selector: 'olive-purchase-order-items-editor',
  templateUrl: './purchase-order-items-editor.component.html',
  styleUrls: ['./purchase-order-items-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OlivePurchaseOrderItemsEditorComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OlivePurchaseOrderItemsEditorComponent),
      multi: true,
    }
  ]
})
export class OlivePurchaseOrderItemsEditorComponent extends OliveEntityFormComponent implements ControlValueAccessor, Validator {
  displayedColumns = ['productVariantId', 'name', 'quantity', 'price', 'amount', 'discount', 'appliedCost', 'otherCurrencyPrice', 'remark', 'actions'];
  itemsDataSource: OlivePurchaseOrderItemDatasource = new OlivePurchaseOrderItemDatasource(this.cacheService);
  paymentMethods: PaymentMethod[];

  parentItem: PurchaseOrder;
  value: PurchaseOrderItem[] = null;

  otherCurrencyDisplay = 'none';
  savedPaymentAmount = 0;
  @Output() paymentAmountChanged = new EventEmitter();

  constructor(
    formBuilder: FormBuilder, translater: FuseTranslationLoaderService,
    private snackBar: MatSnackBar, private dialog: MatDialog,
    private messageHelperService: OliveMessageHelperService, private cacheService: OliveCacheService,
    private productVariantService: OliveProductVariantService, private purchaseOrderService: OlivePurchaseOrderService,

  ) {
    super(
      formBuilder, translater
    );
  }

  get poCurrency() {
    return this.itemsDataSource.poCurrency;
  }
  set poCurrency(value: Currency) {
    this.itemsDataSource.poCurrency = value;
  }

  get exchangeRate() {
    return this.itemsDataSource.exchangeRate;
  }
  set exchangeRate(value: number) {
    this.itemsDataSource.exchangeRate = value;
  }

  get otherCurrencyPriceRequired() {
    return this.itemsDataSource.otherCurrencyPriceRequired;
  }

  get freight() {
    return this.getMoney(this.oForm.value.freightAmount);
  }

  get tax() {
    return this.getMoney(this.oForm.value.taxAmount);
  }
  
  get addedDiscount() {
    return this.getMoney(this.oForm.value.addedDiscountAmount);
  }  

  get extraAmount(): number {
    return +(this.freight - this.addedDiscount + this.tax).toFixed(this.standCurrency.decimalPoint);
  }

  get extraCostPerUnit(): number {
    if (this.totalQuantity === 0) {
      return 0;
    }
    return +(this.extraAmount / this.totalQuantity).toFixed(this.standCurrency.decimalPoint);
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

  get totalAmount(): number {
    let amount = 0;

    this.itemsDataSource.items.forEach(item => {
      if (!isNaN(item.quantity) && !isNaN(item.price)) {
        amount += item.quantity * item.price;
      }
    });

    return +(amount).toFixed(this.standCurrency.decimalPoint);
  }

  get paymentAmount(): number {
    return this.totalAmount + this.extraAmount;
  }

  onCurrencyChanged(id) {
    this.poCurrency = this.cacheService.currencies.find(c => c.id === id);
    this.otherCurrencyDisplay = this.poCurrency.primary ? 'none' : '';

    this.updateOtherCurrencyValidators();
  }

  onCurrencyExchangeRateChanged(exchangeRate) {
    this.exchangeRate = exchangeRate.length === 0 ? 0 : +exchangeRate;
    this.updateOtherCurrencyValidators();
  }

  updateOtherCurrencyValidators() {
    setTimeout(() => {
      this.oFArray.controls.forEach(formGroup => {
        const control = formGroup.get('otherCurrencyPrice');
        control.clearValidators();
        control.setValidators([numberValidator(this.poCurrency.decimalPoint, this.otherCurrencyPriceRequired)]);
      });
    });
  }

  initializeChildComponent() {
    this.standCurrency = this.cacheService.standCurrency;
  }

  getEditedItem(): any {
    const formModel = this.oForm.value;

    return {
      addedDiscountAmount: formModel.addedDiscountAmount,
      freightAmount: formModel.freightAmount,
      taxAmount: formModel.taxAmount,
      items: this.itemsDataSource.items
    };
  }

  buildForm() {
    this.oFormArray = this.formBuilder.array([]);
    this.oForm = this.formBuilder.group({ 
      formarray: this.oFormArray,
      addedDiscountAmount: ['', [numberValidator(this.standCurrency.decimalPoint, true)]],
      freightAmount: ['', [numberValidator(this.standCurrency.decimalPoint, true)]],
      taxAmount: ['', [numberValidator(this.standCurrency.decimalPoint, true)]]
    });
    this.itemsDataSource.formGroup = this.oForm;
  }

  resetForm() {
    this.oForm.patchValue({
      addedDiscountAmount: this.parentItem.addedDiscountAmount || '0',
      freightAmount: this.parentItem.freightAmount || '0',
      taxAmount: this.parentItem.taxAmount || '0',
    });
  }

  setParentItem(parentItem: any) {
    this.parentItem = parentItem;
  }  

  createEmptyObject() {
    return new PurchaseOrder();
  }

  private deleteItem(item: any) {
    if (item.Obj.id || item.Obj.name || item.Obj.quantity || item.Obj.price || item.Obj.remark) {
      this.snackBar.open(
        OliveUtilities.showParamMessage(this.translater.get('common.message.confirmDelete')),
        this.translater.get('common.button.delete'),
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
    this.itemsDataSource.deleteItem(item);
    if (this.itemsDataSource.items.length === 0) {
      this.oFArray.removeAt(0);
    }
    this.updateCosts();    
  }

  canEditQuantity(item: PurchaseOrderItem): boolean {
    return this.isNull(item) || this.isNull(item.id) || isNaN(item.quantity) || item.balance >= item.quantity;
  }

  lookUpProductVariant() {
    const dialogRef = this.dialog.open(
      OliveProductVariantLookupDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: {
          name: 'ProductVariant',
          columnType: 'id',
          dialogTitle: this.translater.get(NavTranslates.Product.productVariant),
          dataService: this.productVariantService,
          maxSelectItems: 10,
          newComponent: OliveProductVariantManagerComponent,
          itemType: ProductVariant,
          managePermission: Permission.manageProductsPermission,
          translateTitleId: NavTranslates.Product.productVariant,
          maxNameLength: 10
        } as LookupListerSetting
      });

    dialogRef.afterClosed().subscribe(pvItems => {
      if (!pvItems || pvItems.length === 0) { return; }

      const duplicatedIdStrings: string[] = [];
      const dupProductVariantIdCheckset = new Set();

      this.itemsDataSource.items.forEach((dsItem: PurchaseOrderItem) => {
        pvItems
          .filter((pvItem: ProductVariant) => dsItem.productVariantId === pvItem.id)
          .forEach((pvItem: ProductVariant) => {
            if (!dupProductVariantIdCheckset.has(pvItem.id)) {
              dupProductVariantIdCheckset.add(pvItem.id);
              duplicatedIdStrings.push(
                `${this.id36(pvItem.id)}: ${pvItem.productFk.name} ${pvItem.name}`.trimRight());
            }
          });
      });

      let needToRender = false;

      pvItems
        .filter((pvItem: ProductVariant) => !dupProductVariantIdCheckset.has(pvItem.id))
        .forEach((pvItem: ProductVariant) => {
          this.itemsDataSource.addNewItem({
            price: pvItem.standPrice,
            discount: 0,
            appliedCost: pvItem.standPrice,
            productVariantId: pvItem.id,
            name: `${pvItem.productFk.name} ${pvItem.name}`.trimRight()
          } as PurchaseOrderItem);
          needToRender = true;
        });

      if (needToRender) {
        this.itemsDataSource.renderItems();
        this.oForm.markAsDirty();
      }
    
      this.updateCosts();

      this.messageHelperService.showDuplicatedItems(duplicatedIdStrings);
    });
  }

  lookupPurchaseOrder() {
    const dialogRef = this.dialog.open(
      OlivePurchaseOrderLookupDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: {
          name: 'PurchaseOrder',
          columnType: 'custom',
          dialogTitle: this.translater.get(NavTranslates.Purchase.list),
          dataService: this.purchaseOrderService,
          maxSelectItems: 10,
          newComponent: OlivePurchaseOrderManagerComponent,
          itemType: PurchaseOrder,
          managePermission: Permission.manageProductsPermission,
          translateTitleId: NavTranslates.Purchase.list,
          maxNameLength: 10,
          extraSearches: [{ name: 'ItemsExists', value: 'true' }] as NameValue[]
        } as LookupListerSetting
      });

    dialogRef.afterClosed().subscribe(pItems => {
      if (!pItems || pItems.length === 0) { return; }

      const duplicatedIdStrings: string[] = [];
      const dupPOItemIdCheckset = new Set();

      this.itemsDataSource.items.forEach((dsItem: PurchaseOrderItem) => {
        pItems.forEach((fItem: PurchaseOrder) => {
          fItem.purchaseOrderItems
            .filter((sItem: PurchaseOrderItem) => dsItem.productVariantId === sItem.productVariantId)
            .forEach((sItem: PurchaseOrderItem) => {
              if (!dupPOItemIdCheckset.has(sItem.id)) {
                dupPOItemIdCheckset.add(sItem.productVariantId);
                duplicatedIdStrings.push(`${this.id36(sItem.id)}: ${sItem.name}`);
              }
            });
        });
      });

      let needToRender = false;

      pItems
        .forEach((fItem: PurchaseOrder) => {
          fItem.purchaseOrderItems
            .filter((sItem: PurchaseOrderItem) => !dupPOItemIdCheckset.has(sItem.productVariantId))
            .forEach((sItem: PurchaseOrderItem) => {
              this.itemsDataSource.addNewItem({
                price: sItem.price,
                discount: 0,                
                appliedCost: sItem.price,
                productVariantId: sItem.productVariantId,
                name: sItem.name
              } as PurchaseOrderItem);
              needToRender = true;
            });
        });

      if (needToRender) {
        this.itemsDataSource.renderItems();
        this.oForm.markAsDirty();
      }
  
      this.updateCosts();        

      this.messageHelperService.showDuplicatedItems(duplicatedIdStrings);
    });
  }

  get productVariantIcon() {
    return NavIcons.Product.productVariant;
  }

  get purchaseOrderIcon() {
    return NavIcons.Purchase.list;
  }

  updateCosts() {
    this.oFArray.controls.forEach((formGroup: FormGroup) => {
      const lineOtherCurrencyPrice = this.getMoney(formGroup.get('otherCurrencyPrice').value);

      if (lineOtherCurrencyPrice > 0 && this.otherCurrencyPriceRequired) {
        formGroup.get('price').markAsTouched();
        formGroup.patchValue({price: (lineOtherCurrencyPrice / this.exchangeRate).toFixed(this.standCurrency.decimalPoint)});
      }

      const lineQuantity = this.getNumber(formGroup.get('quantity').value);
      const lineDiscount = this.getMoney(formGroup.get('discount').value);
      const linePrice = this.getMoney(formGroup.get('price').value);

      const appliedCost = linePrice - +(lineDiscount / lineQuantity).toFixed(2) + this.extraCostPerUnit;

      if (!isNaN(appliedCost)) {
        formGroup.get('appliedCost').markAsTouched();
        formGroup.patchValue({appliedCost: appliedCost.toFixed(this.standCurrency.decimalPoint)});
      }
    });

    if (this.savedPaymentAmount !== this.paymentAmount) {
      this.savedPaymentAmount = this.paymentAmount;
      this.paymentAmountChanged.emit(this.paymentAmount);
    }
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
