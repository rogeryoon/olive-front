import { Component, forwardRef } from '@angular/core';
import {
  FormBuilder, FormControl, ValidationErrors,
  NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, AbstractControl, FormArray
} from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { String } from 'typescript-string-operations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Permission } from '@quick/models/permission.model';
import { AlertService, MessageSeverity } from '@quick/services/alert.service';

import { PurchaseOrder } from '../../models/purchase-order.model';
import { PurchaseOrderItem } from '../../models/purchase-order-item.model';
import { PaymentMethod } from 'app/main/supports/companies/models/payment-method.model';
import { OlivePurchaseOrderItemDatasource } from './purchase-order-item-datasource';
import { NavIcons } from 'app/core/navigations/nav-icons';
import { OliveEntityFormComponent } from 'app/core/components/entity-edit/entity-form.component';
import { LookupListerSetting } from 'app/core/interfaces/lister-setting';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveProductVariantService } from 'app/main/productions/products/services/product-variant.service';
import { OliveProductVariantManagerComponent } from 'app/main/productions/products/product-variant/product-variant-manager/product-variant-manager.component';
import { ProductVariant } from 'app/main/productions/products/models/product-variant.model';
import { OliveProductVariantLookupDialogComponent } from 'app/main/productions/products/product-variant/product-variant-lookup-dialog/product-variant-lookup-dialog.component';
import { OliveUtilities } from 'app/core/classes/utilities';
import { OlivePurchaseOrderService } from '../../services/purchase-order.service';
import { OlivePurchaseOrderManagerComponent } from '../purchase-order-manager/purchase-order-manager.component';
import { NameValue } from 'app/core/models/name-value';
import { OlivePurchaseOrderLookupDialogComponent } from '../purchase-order-lookup-dialog/purchase-order-lookup-dialog.component';
import { OliveCacheService } from 'app/core/services/cache.service';
import { Currency } from 'app/main/supports/bases/models/currency.model';
import { numberValidator } from 'app/core/classes/validators';

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
  displayedColumns = ['productVariantId', 'name', 'quantity', 'price', 'amount', 'otherCurrencyPrice', 'remark', 'actions'];
  itemsDataSource: OlivePurchaseOrderItemDatasource = new OlivePurchaseOrderItemDatasource(this.cacheService);
  paymentMethods: PaymentMethod[];

  value: PurchaseOrderItem[] = null;

  otherCurrencyDisplay = 'none';
  poCurrency: Currency;

  constructor(
    formBuilder: FormBuilder,
    private productVariantService: OliveProductVariantService,
    private purchaseOrderService: OlivePurchaseOrderService,
    private snackBar: MatSnackBar,
    translater: FuseTranslationLoaderService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private cacheService: OliveCacheService
  ) {
    super(
      formBuilder, translater
    );
  }

  onCurrencyChanged(id) {
    this.poCurrency = this.cacheService.currencies.find(c => c.id === id);
    this.otherCurrencyDisplay = this.poCurrency.primary ? 'none' : '';

    this.updateOtherCurrencyValidators();
  }

  updateOtherCurrencyValidators() {
    setTimeout(() => {
      (<FormArray>this.getControl('formarray')).controls.forEach(formGroup => {
        const control = formGroup.get('otherCurrencyPrice');
        control.clearValidators();
        control.setValidators([numberValidator(this.poCurrency.decimalPoint, !this.poCurrency.primary)]);
      });
    });    
  }

  get items(): any {
    return this.itemsDataSource.items;
  }

  initializeChildComponent() {
    this.standCurrency = this.cacheService.standCurrency;
  }

  buildForm() {
    this.oFormArray = this.formBuilder.array([]);
    this.oForm = this.formBuilder.group({ formarray: this.oFormArray });
    this.itemsDataSource.formGroup = this.oForm;
  }

  createEmptyObject() {
    return new PurchaseOrder();
  }

  private addNewItem(item: PurchaseOrderItem) {
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
          this.oForm.markAsDirty();
        });
    }
    else {
      this.itemsDataSource.deleteItem(item);
      this.oForm.markAsDirty();
    }
  }

  get totalQuantity(): number {
    let quantity = 0;

    this.itemsDataSource.items.forEach(item => {
      if (item.quantity) {
        quantity += item.quantity;
      }
    });

    return quantity;
  }

  get totalAmount(): number {
    let amount = 0;

    this.itemsDataSource.items.forEach(item => {
      if (item.quantity && item.price) {
        amount += item.quantity * item.price;
      }
    });

    return amount;
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
          dialogTitle: this.translater.get(NavTranslates.Product.ProductVariant),
          dataService: this.productVariantService,
          maxSelectItems: 10,
          newComponent: OliveProductVariantManagerComponent,
          itemType: ProductVariant,
          managePermission: Permission.manageProductsPermission,
          translateTitleId: NavTranslates.Product.ProductVariant,
          maxNameLength: 10
        } as LookupListerSetting
      });

    dialogRef.afterClosed().subscribe(pvItems => {
      if (!pvItems || pvItems.length === 0) { return; }

      const duplicatedIdStrings: string[] = [];
      const dupCheckset = new Set();

      this.itemsDataSource.items.forEach((dsItem: PurchaseOrderItem) => {
        pvItems
          .filter((pvItem: ProductVariant) => dsItem.productVariantId === pvItem.id)
          .forEach((pvItem: ProductVariant) => {
            dupCheckset.add(pvItem.id);
            duplicatedIdStrings.push(
              `${OliveUtilities.convertToBase36(pvItem.id)}: ${pvItem.productFk.name} ${pvItem.name}`.trimRight());
          });
      });

      pvItems
        .filter((pvItem: ProductVariant) => !dupCheckset.has(pvItem.id))
        .forEach((pvItem: ProductVariant) => {
          this.addNewItem({
            price: pvItem.standPrice,
            productVariantId: pvItem.id,
            name: `${pvItem.productFk.name} ${pvItem.name}`.trimRight()
          } as PurchaseOrderItem);
        });

      this.showDuplicatedItems(duplicatedIdStrings);
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
          dialogTitle: this.translater.get(NavTranslates.Purchase.PurchaseOrderList),
          dataService: this.purchaseOrderService,
          maxSelectItems: 10,
          newComponent: OlivePurchaseOrderManagerComponent,
          itemType: PurchaseOrder,
          managePermission: Permission.manageProductsPermission,
          translateTitleId: NavTranslates.Purchase.PurchaseOrderList,
          maxNameLength: 10,
          extraSearches: [{ name: 'ItemsExists', value: 'true' }] as NameValue[]
        } as LookupListerSetting
      });

    dialogRef.afterClosed().subscribe(pItems => {
      if (!pItems || pItems.length === 0) { return; }

      const duplicatedIdStrings: string[] = [];
      const dupCheckset = new Set();

      this.itemsDataSource.items.forEach((dsItem: PurchaseOrderItem) => {
        pItems.forEach((fItem: PurchaseOrder) => {
          fItem.purchaseOrderItems
            .filter((sItem: PurchaseOrderItem) => dsItem.productVariantId === sItem.productVariantId)
            .forEach((sItem: PurchaseOrderItem) => {
              dupCheckset.add(sItem.productVariantId);
              duplicatedIdStrings.push(`${OliveUtilities.convertToBase36(sItem.id)}: ${sItem.name}`);
            });
        });
      });

      pItems
        .forEach((fItem: PurchaseOrder) => {
          fItem.purchaseOrderItems
            .filter((sItem: PurchaseOrderItem) => !dupCheckset.has(sItem.productVariantId))
            .forEach((sItem: PurchaseOrderItem) => {
              const newItem = Object.assign(sItem);
              newItem.id = null;
              this.addNewItem(newItem);
            });
        });

      this.showDuplicatedItems(duplicatedIdStrings);
    });
  }

  showDuplicatedItems(idStrings: string[]) {
    if (idStrings.length === 0) { return; }

    this.alertService.showMessage(
      this.translater.get('common.title.duplicated'),
      String.Format(this.translater.get('common.message.duplicated'), idStrings.join()),
      MessageSeverity.warn
    );
  }

  get productVariantIcon() {
    return NavIcons.Product.ProductVariant;
  }

  get purchaseOrderIcon() {
    return NavIcons.Purchase.Purchase;
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

  onSelectionChange(event: any) {
    this._onChange(event.value);
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
