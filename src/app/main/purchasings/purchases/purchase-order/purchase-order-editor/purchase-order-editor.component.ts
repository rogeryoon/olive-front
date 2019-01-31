import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AccountService } from '@quick/services/account.service';
import { Permission } from '@quick/models/permission.model';

import { OliveEntityFormComponent } from 'app/core/components/entity-edit/entity-form.component';
import { OliveLookupHostComponent } from 'app/core/components/lookup-host/lookup-host.component';
import { PurchaseOrder } from '../../models/purchase-order.model';
import { OliveVendorService } from 'app/main/supports/companies/services/vendor.service';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveVendorManagerComponent } from 'app/main/supports/companies/vendor/vendor-manager/vendor-manager.component';
import { Vendor } from 'app/main/supports/companies/models/vendor.model';
import { OliveWarehouseService } from 'app/main/supports/companies/services/warehouse.service';
import { Currency } from 'app/main/supports/bases/models/currency.model';
import { Warehouse } from 'app/main/supports/companies/models/warehouse.model';
import { OliveWarehouseManagerComponent } from 'app/main/supports/companies/warehouse/warehouse-manager/warehouse-manager.component';
import { OliveCacheService } from 'app/core/services/cache.service';
import { LookupListerSetting } from 'app/core/interfaces/lister-setting';

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

  currencies: Currency[] = [];

  primaryCurrencyCode: string;

  constructor(
    formBuilder: FormBuilder, 
    private translater: FuseTranslationLoaderService,
    private vendorService: OliveVendorService,
    private warehouseService: OliveWarehouseService,
    private accountService: AccountService, 
    private cacheService: OliveCacheService,
  ) {
    super(
      formBuilder
    );
  }

  get vendorOrderId() {
    return this.oForm.get('vendorOrderId');
  }

  get poDate() {
    return this.oForm.get('poDate');
  }

  get memo() {
    return this.oForm.get('memo');
  }

  get addedDiscountAmount() {
    return this.oForm.get('addedDiscountAmount');
  }

  get freightAmount() {
    return this.oForm.get('freightAmount');
  }

  get taxAmount() {
    return this.oForm.get('taxAmount');
  }

  get currencyExchangeRate() {
    return this.oForm.get('currencyExchangeRate');
  }

  get vendorFk() {
    return this.oForm.get('vendorFk');
  }

  get warehouseFk() {
    return this.oForm.get('warehouseFk');
  }

  get currency() {
    return this.oForm.get('currency');
  }

  get floatLabels(): string {
    return true ? 'auto' : 'always';
  }

  get isMasterCurrency(): boolean {
    const it = this.currencies.find(item => item.id === this.currency.value);
    if (it) {
      return it.code === this.primaryCurrencyCode;
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
      addedDiscountAmount: ['', [Validators.required, Validators.min(0)]],
      freightAmount: ['', [Validators.required, Validators.min(0)]],
      taxAmount: ['', [Validators.required, Validators.min(0)]],
      currencyExchangeRate: ['', Validators.min(0)],
      vendorFk: null,
      warehouseFk: null,
      currency: ''
    });
  }

  resetForm() {
    this.oForm.reset({
      vendorOrderId: this.item.vendorOrderId || '',
      poDate: this.item.date || '',
      memo: this.item.memo || '',
      addedDiscountAmount: this.item.addedDiscountAmount || 0,
      freightAmount: this.item.freightAmount || 0,
      taxAmount: this.item.taxAmount || 0,
      currencyExchangeRate: this.item.currencyExchangeRate || 1.00,
      vendorFk: this.item.vendorFk,
      warehouseFk: this.item.warehouseFk,
      currency: this.item.currencyFk ? this.item.currencyFk.id : ''
    });


    this.cacheService.GetCurrencies()
      .then(currencies => {
        const currency = currencies.find(item => item.primary);        
        this.primaryCurrencyCode = currency.code;
        this.currencies = currencies;
        if (!this.item.currencyFk) {
          this.oForm.patchValue({ currency: currencies.find(item => item.primary).id });
        }
      });
  }

  createEmptyObject() {
    return new PurchaseOrder();
  }

  initializeChildComponent() {
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
}
