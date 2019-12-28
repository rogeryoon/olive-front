import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveWarehouseService } from 'app/main/supports/services/warehouse.service';
import { Warehouse } from 'app/main/supports/models/warehouse.model';
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
import { OliveConstants } from 'app/core/classes/constants';

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
  voidPurchaseOrderTypes: any[] = OliveConstants.voidPurchaseOrderTypes;

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

    this.localizeVoidPurchaseTypesName();
  }

  getEditedItem(): VoidPurchaseOrder {
    const formModel = this.oFormValue;

    const selectedWarehouse = this.warehouses.find(item => item.id === formModel.warehouse);

    // Item 저장시 마지막 선택한 창고를 저장
    this.cacheService.setUserPreference(this.warehouseComboSelectedCacheKey, selectedWarehouse);

    const selectedVoidType = this.voidPurchaseOrderTypes.find(item => item.code === formModel.voidPurchaseOrderType);

    return this.itemWithIdNAudit({
      voidTypeCode: selectedVoidType.code,
      inWarehouseFk: {
        memo : formModel.memo,
        warehouseId : selectedWarehouse.id
      },
      purchaseOrderFk: this.item.purchaseOrderFk,
      returnTrackings: this.item.returnTrackings
    } as VoidPurchaseOrder);
  }

  localizeVoidPurchaseTypesName() {
    for (const voidType of this.voidPurchaseOrderTypes) {
      voidType.name = this.translator.get('code.voidPurchaseOrderTypeCode.' + voidType.code);
    }
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      warehouse: [{value: '', disabled: !this.isNewItem}],
      voidPurchaseOrderType: [{value: '', disabled: !this.isNewItem}],
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
      voidPurchaseOrderType: item.voidTypeCode || '',
      purchaseOrderFk: item.purchaseOrderFk,
      supplierName: item.purchaseOrderFk && item.purchaseOrderFk.supplierFk && item.purchaseOrderFk.supplierFk.name ? item.purchaseOrderFk.supplierFk.name : '',
      memo: item.inWarehouseFk ? item.inWarehouseFk.memo : ''
    });

    if (item.inWarehouseFk && item.inWarehouseFk.id && item.voidTypeCode) {
      this.warehouseChanged.emit({item: item.inWarehouseFk.warehouseFk, voidTypeCode: item.voidTypeCode, loading: true});
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
      customTitleCallback: this.customTitleCallback,
      customNameCallback: this.customNameCallback,
      readonly: true
    } as ReferHostSetting;
  }

  customNameCallback(order: PurchaseOrder): string {
    return purchaseOrderId(order);
  }

  customTitleCallback(order: PurchaseOrder, template: string): string {
    return showParamMessage(template, purchaseOrderId(order));
  }

  onWarehouseChanged(value: any, eventFromWarehouseDropDown: boolean) {
    const formModel = this.oFormValue;

    if (!this.disableWarehouseChangedEvent) {
      let selectedWarehouse: Warehouse;
      let voidPurchaseOrderType: string;

      if (eventFromWarehouseDropDown) {
        selectedWarehouse = this.warehouses.find(item => item.id === value);
        voidPurchaseOrderType = formModel.voidPurchaseOrderType;
      }
      else {
        selectedWarehouse = this.warehouses.find(item => item.id === formModel.warehouse);
        voidPurchaseOrderType = value;
      }

      // 창고와 취소타입을 모두 선택하여야만 이벤트가 발생
      if (selectedWarehouse && voidPurchaseOrderType.length === 1) {
        this.warehouseChanged.emit({item: selectedWarehouse, voidTypeCode: voidPurchaseOrderType, loading: false});
      }
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
          this.onWarehouseChanged(obj.id, true);
        }
      });    
  }
}
