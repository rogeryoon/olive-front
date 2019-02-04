import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Permission } from '@quick/models/permission.model';

import { OliveEntityFormComponent } from 'app/core/components/entity-edit/entity-form.component';
import { OliveLookupHostComponent } from 'app/core/components/lookup-host/lookup-host.component';
import { PurchaseOrder } from '../../models/purchase-order.model';
import { OliveVendorService } from 'app/main/supports/companies/services/vendor.service';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveVendorManagerComponent } from 'app/main/supports/companies/vendor/vendor-manager/vendor-manager.component';
import { Vendor } from 'app/main/supports/companies/models/vendor.model';
import { OliveWarehouseService } from 'app/main/supports/companies/services/warehouse.service';
import { Warehouse } from 'app/main/supports/companies/models/warehouse.model';
import { OliveWarehouseManagerComponent } from 'app/main/supports/companies/warehouse/warehouse-manager/warehouse-manager.component';
import { LookupListerSetting } from 'app/core/interfaces/lister-setting';
import { OliveCacheService } from 'app/core/services/cache.service';
import { numberValidator } from 'app/core/classes/validators';

@Component({
  selector: 'olive-purchase-order-editor',
  templateUrl: './purchase-order-editor.component.html',
  styleUrls: ['./purchase-order-editor.component.scss']
})
export class OlivePurchaseOrderEditorComponent extends OliveEntityFormComponent {
  @ViewChild('vendor')
  lookupVendor: OliveLookupHostComponent;

  @ViewChild('warehouse')
  lookupWarehouse: OliveLookupHostComponent;

  @Output() currencyChanged = new EventEmitter();

  standCurrencyCode: string;


  constructor(
    formBuilder: FormBuilder, translater: FuseTranslationLoaderService,
    private vendorService: OliveVendorService,
    private warehouseService: OliveWarehouseService,
    private cacheService: OliveCacheService
  ) {
    super(
      formBuilder, translater
    );
  }

  get floatLabels(): string {
    return true ? 'auto' : 'always';
  }

  get isMasterCurrency(): boolean {
    const it = this.currencies.find(item => item.id === this.getControl('currency').value);
    if (it) {
      return it.code === this.standCurrencyCode;
    }
    return false;
  }

  getEditedItem(): any {
    const formModel = this.oForm.value;

    return this.itemWithIdNAudit({
      vendorOrderId: formModel.vendorOrderId,
      date: formModel.poDate,
      memo: formModel.memo,
      addedDiscountAmount: formModel.addedDiscountAmount,
      freightAmount: formModel.freightAmount,
      taxAmount: formModel.taxAmount,
      currencyExchangeRate: formModel.currencyExchangeRate,
      closedDate: this.item.closedDate,
      printOutCount: this.item.printOutCount,
      lastPrintOutUser: this.item.lastPrintOutUser,
      vendorId: formModel.vendorFk.id,
      warehouseId: formModel.warehouseFk.id,
      currencyId: formModel.currency
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      vendorOrderId: '',
      poDate: ['', Validators.required],
      memo: '',
      addedDiscountAmount: ['', [numberValidator(this.standCurrency.decimalPoint, true)]],
      freightAmount: ['', [numberValidator(this.standCurrency.decimalPoint, true)]],
      taxAmount: ['', [numberValidator(this.standCurrency.decimalPoint, true)]],
      currencyExchangeRate: ['', [numberValidator(this.standCurrency.decimalPoint, true)]],
      vendorFk: null,
      warehouseFk: null,
      currency: ''
    });
  }

  resetForm() {
    const currency = this.item.currencyFk ? this.item.currencyFk : this.standCurrency;

    this.oForm.reset({
      vendorOrderId: this.item.vendorOrderId || '',
      poDate: this.item.date || '',
      memo: this.item.memo || '',
      addedDiscountAmount: this.item.addedDiscountAmount || '0',
      freightAmount: this.item.freightAmount || '0',
      taxAmount: this.item.taxAmount || '0',
      currencyExchangeRate: this.item.currencyExchangeRate || '0.00',
      vendorFk: this.item.vendorFk,
      warehouseFk: this.item.warehouseFk,
      currency: currency.id
    });

    this.onCurrencyValueChanged(currency.id);
  }

  createEmptyObject() {
    return new PurchaseOrder();
  }

  initializeChildComponent() {
    this.standCurrency = this.cacheService.standCurrency;
    this.currencies = this.cacheService.currencies;
    this.standCurrencyCode = this.standCurrency.code;

    this.lookupVendor.setting = {
      name: 'Vendor',
      columnType: 'code',
      dialogTitle: this.translater.get(NavTranslates.Company.Vendor),
      dataService: this.vendorService,
      maxSelectItems: 1,
      newComponent: OliveVendorManagerComponent,
      itemType: Vendor,
      managePermission: Permission.assignCompanyGroups,
      translateTitleId: NavTranslates.Company.Vendor
    } as LookupListerSetting;

    this.lookupWarehouse.setting = {
      name: 'Warehouse',
      columnType: 'code',
      dialogTitle: this.translater.get(NavTranslates.Company.Warehouse),
      dataService: this.warehouseService,
      maxSelectItems: 1,
      newComponent: OliveWarehouseManagerComponent,
      itemType: Warehouse,
      managePermission: Permission.assignCompanyGroups,
      translateTitleId: NavTranslates.Company.Warehouse
    } as LookupListerSetting;
  }

  markCustomControlsTouched() {
    this.lookupVendor.markAsTouched();
    this.lookupWarehouse.markAsTouched();
  }

  // hasOtherError(): boolean {
  //   const isMatchedAmount = 
  //     this.purchaseOrderPayments.totalPaidAmount === this.item.totalDueAmount;
  //   if (!isMatchedAmount) {

  //   }
  //   return !isMatchedAmount;
  // }

  get canAssignPurchaseOrder() {
    return true;
  }

  onCurrencyValueChanged(event: any) {
    this.currencyChanged.emit(event);
  }
}
