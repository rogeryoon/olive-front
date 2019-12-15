import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Permission } from '@quick/models/permission.model';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OliveLookupHostComponent } from 'app/core/components/entries/lookup-host/lookup-host.component';
import { PurchaseOrder } from '../../../models/purchase-order.model';
import { OliveSupplierService } from 'app/main/supports/services/supplier.service';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveSupplierManagerComponent } from 'app/main/supports/companies/supplier/supplier-manager/supplier-manager.component';
import { Supplier } from 'app/main/supports/models/supplier.model';
import { OliveWarehouseService } from 'app/main/supports/services/warehouse.service';
import { Warehouse } from 'app/main/supports/models/warehouse.model';
import { LookupListerSetting } from 'app/core/interfaces/setting/lookup-lister-setting';
import { OliveCacheService } from 'app/core/services/cache.service';
import { numberValidator, requiredValidator } from 'app/core/validators/general-validators';
import { isMoneyPattern, toTrimString } from 'app/core/utils/string-helper';
import { createDefaultSearchOption, createSearchOption } from 'app/core/utils/search-helpers';
import { OliveQueryParameterService } from 'app/core/services/query-parameter.service';

@Component({
  selector: 'olive-purchase-order-editor',
  templateUrl: './purchase-order-editor.component.html',
  styleUrls: ['./purchase-order-editor.component.scss']
})
export class OlivePurchaseOrderEditorComponent extends OliveEntityFormComponent {
  @ViewChild('supplier')
  lookupSupplier: OliveLookupHostComponent;

  warehouses: Warehouse[];

  @Output() currencyChanged = new EventEmitter();
  @Output() exchangeRateChanged = new EventEmitter();

  standCurrencyCode: string;

  readonly wareHouseComboSelectedCacheKey = OliveCacheService.cacheKeys.userPreference.dropDownBox + 
    OliveCacheService.cacheKeys.getItemKey.warehouse + this.queryParams.CompanyGroupId;

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private supplierService: OliveSupplierService, private warehouseService: OliveWarehouseService,
    private cacheService: OliveCacheService, private queryParams: OliveQueryParameterService
  ) {
    super(
      formBuilder, translator
    );
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

    const selectedWarehouse = this.warehouses.find(item => item.id === formModel.warehouse);

    // Item 저장시 마지막 선택한 창고를 저장
    this.cacheService.setUserPreference(this.wareHouseComboSelectedCacheKey, selectedWarehouse);

    return this.itemWithIdNAudit({
      supplierOrderId: formModel.supplierOrderId,
      date: formModel.poDate,
      memo: formModel.memo,
      addedDiscountAmount: formModel.addedDiscountAmount,
      freightAmount: formModel.freightAmount,
      taxAmount: formModel.taxAmount,
      currencyExchangeRate: formModel.currencyExchangeRate,
      closedDate: this.item.closedDate,
      printOutCount: this.item.printOutCount,
      lastPrintOutUser: this.item.lastPrintOutUser,
      supplierId: formModel.supplierFk.id,
      warehouseId: selectedWarehouse.id,
      currencyId: formModel.currency
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      supplierOrderId: '',
      poDate: ['', requiredValidator()],
      memo: '',
      currencyExchangeRate: ['', [numberValidator(2, false)]],
      supplierFk: null,
      warehouse: ['', requiredValidator()],
      currency: ''
    });
  }

  resetForm() {
    const currency = this.item.currencyFk ? this.item.currencyFk : this.standCurrency;

    this.oForm.reset({
      supplierOrderId: this.item.supplierOrderId || '',
      poDate: this.item.date || '',
      memo: this.item.memo || '',
      currencyExchangeRate: this.item.currencyExchangeRate,
      supplierFk: this.item.supplierFk,
      warehouse: this.item.warehouseId,
      currency: currency.id
    });

    this.onCurrencyValueChanged(currency.id);

    if (!this.isNewItem) {
      this.onCurrencyExchangeRateChanged(this.item.currencyExchangeRate);
    }
  }

  createEmptyObject() {
    return new PurchaseOrder();
  }

  initializeChildComponent() {
    this.standCurrency = this.cacheService.standCurrency;
    this.currencies = this.cacheService.currencies;
    this.standCurrencyCode = this.standCurrency.code;

    this.getWarehouses();

    this.lookupSupplier.setting = {
      name: 'Supplier',
      columnType: 'code',
      itemTitle: this.translator.get(NavTranslates.Company.supplier),
      dataService: this.supplierService,
      maxSelectItems: 1,
      newComponent: OliveSupplierManagerComponent,
      itemType: Supplier,
      managePermission: Permission.assignCompanyGroups,
      translateTitleId: NavTranslates.Company.supplier,
      searchOption: createDefaultSearchOption()
    } as LookupListerSetting;
  }

  markCustomControlsTouched() {
    this.lookupSupplier.markAsTouched();
  }

  get canAssignPurchaseOrder() {
    return true;
  }

  onCurrencyValueChanged(event: any) {
    this.currencyChanged.emit(event);
  }

  onCurrencyExchangeRateChanged(input: any) {
    const value = toTrimString(input);
    if (isMoneyPattern(value)) {
      this.exchangeRateChanged.emit(value);
    }
  }

  private getWarehouses() {
    this.cacheService.getItems(this.warehouseService, OliveCacheService.cacheKeys.getItemsKey.warehouse + 'activated', createDefaultSearchOption())
      .then((items: Warehouse[]) => {
        this.warehouses = items;
        this.setLastSelectedWarehouse();
      });
  }

  private setLastSelectedWarehouse() {
    // Cache Value Loading
    this.cacheService.getUserPreference(this.wareHouseComboSelectedCacheKey)
      .then(obj => {
        if (obj && !this.item.warehouseId) {
          this.oForm.patchValue({warehouse: obj.id});
        }
      });    
  }
}
