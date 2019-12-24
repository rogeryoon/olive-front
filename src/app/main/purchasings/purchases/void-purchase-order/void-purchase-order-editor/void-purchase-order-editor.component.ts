import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OliveLookupHostComponent } from 'app/core/components/entries/lookup-host/lookup-host.component';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveWarehouseService } from 'app/main/supports/services/warehouse.service';
import { OliveWarehouseManagerComponent } from 'app/main/supports/companies/warehouse/warehouse-manager/warehouse-manager.component';
import { Warehouse } from 'app/main/supports/models/warehouse.model';
import { Permission } from '@quick/models/permission.model';
import { LookupListerSetting } from 'app/core/interfaces/setting/lookup-lister-setting';
import { OliveReferHostComponent } from 'app/core/components/entries/refer-host/refer-host.component';
import { OlivePurchaseOrderService } from '../../../services/purchase-order.service';
import { VoidPurchaseOrder } from '../../../models/void-purchase-order.model';
import { PurchaseOrder } from '../../../models/purchase-order.model';
import { OlivePurchaseOrderManagerComponent } from '../../purchase-order/purchase-order-manager/purchase-order-manager.component';
import { showParamMessage } from 'app/core/utils/string-helper';
import { ReferHostSetting } from 'app/core/interfaces/setting/refer-host-setting';
import { purchaseOrderId, addActivatedCacheKey } from 'app/core/utils/olive-helpers';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveQueryParameterService } from 'app/core/services/query-parameter.service';
import { createDefaultSearchOption } from 'app/core/utils/search-helpers';

@Component({
  selector: 'olive-void-purchase-order-editor',
  templateUrl: './void-purchase-order-editor.component.html',
  styleUrls: ['./void-purchase-order-editor.component.scss']
})
export class OliveVoidPurchaseOrderEditorComponent extends OliveEntityFormComponent {
  @ViewChild('purchaseOrder') 
  referPurchaseOrder: OliveReferHostComponent;

  disableWarehouseChangedEvent = false;

  @Output() warehouseChanged = new EventEmitter();

  warehouses: Warehouse[];

  readonly warehouseComboSelectedCacheKey = OliveCacheService.cacheKeys.userPreference.dropDownBox + 
    OliveCacheService.cacheKeys.getItemKey.warehouse + this.queryParams.CompanyGroupId;

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private warehouseService: OliveWarehouseService, private purchaseOrderService: OlivePurchaseOrderService,
    private cacheService: OliveCacheService, private queryParams: OliveQueryParameterService
  ) {
    super(
      formBuilder, translator
    );
  }

  getEditedItem(): VoidPurchaseOrder {
    const formModel = this.oForm.value;

    const selectedWarehouse = this.warehouses.find(item => item.id === formModel.warehouse);

    // Item 저장시 마지막 선택한 창고를 저장
    this.cacheService.setUserPreference(this.warehouseComboSelectedCacheKey, selectedWarehouse);


    return this.itemWithIdNAudit({
      inWarehouseFk: {
        memo : formModel.memo,
        warehouseId : selectedWarehouse.id
      },
      purchaseOrderFk: this.item.purchaseOrderFk,
      returnTrackings: this.item.returnTrackings
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      warehouse: [{value: '', disabled: !this.isNewItem}],
      purchaseOrderFk: null,
      supplierName: '',
      memo: '',
    });
  }

  resetForm() {
    const item = this.item as VoidPurchaseOrder;

    if (item.inWarehouseFk && !this.isNull(item.inWarehouseFk.warehouseFk)) {
      this.disableWarehouseChangedEvent = true;
    }

    this.oForm.reset({
      warehouse: item.inWarehouseFk && item.inWarehouseFk.id ? item.inWarehouseFk.id : '',
      purchaseOrderFk: item.purchaseOrderFk,
      supplierName: item.purchaseOrderFk && item.purchaseOrderFk.supplierFk && item.purchaseOrderFk.supplierFk.name ? item.purchaseOrderFk.supplierFk.name : '',
      memo: item.inWarehouseFk ? item.inWarehouseFk.memo : ''
    });

    if (this.item.warehouseFk) {
      this.warehouseChanged.emit({item: this.item.warehouseFk, loading: true});
    }

    this.getWarehouses();
  }

  createEmptyObject() {
    return new VoidPurchaseOrder();
  }

  initializeChildComponent() {
    this.referPurchaseOrder.setting = {
      itemType: PurchaseOrder,
      dataService: this.purchaseOrderService,
      managerComponent: OlivePurchaseOrderManagerComponent,
      managePermission: null,
      translateTitleId: NavTranslates.Purchase.entry,
      customTitleTemplate: this.translator.get('navi.purchase.group') + ' ID : {0}',
      customTitleCallback: this.customTitle,
      customNameCallback: this.customName,
      readonly: true
    } as ReferHostSetting;
  }

  customName(order: PurchaseOrder): string {
    return purchaseOrderId(order);
  }

  customTitle(order: PurchaseOrder, template: string): string {
    return showParamMessage(template, purchaseOrderId(order));
  }

  onWarehouseChanged(warehouseId: number) {
    const warehouse = this.warehouses.find(item => item.id === warehouseId);

    if (!this.disableWarehouseChangedEvent) {
      this.warehouseChanged.emit({item: warehouse, loading: false});
    }
    else {
      this.disableWarehouseChangedEvent = false;
    }
  }

  private getWarehouses() {
    this.cacheService.getItems(this.warehouseService, addActivatedCacheKey(OliveCacheService.cacheKeys.getItemsKey.warehouse), createDefaultSearchOption())
      .then((items: Warehouse[]) => {
        this.warehouses = items;
        this.setLastSelectedWarehouse();
      });
  }

  private setLastSelectedWarehouse() {
    // Cache Value Loading
    this.cacheService.getUserPreference(this.warehouseComboSelectedCacheKey)
      .then(obj => {
        if (obj && !this.item.warehouseId) {
          this.oForm.patchValue({warehouse: obj.id});
          this.onWarehouseChanged(obj.id);
        }
      });    
  }
}
