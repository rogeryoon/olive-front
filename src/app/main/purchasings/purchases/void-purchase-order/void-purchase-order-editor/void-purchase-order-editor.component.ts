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
import { LookupListerSetting, ReferHostSetting } from 'app/core/interfaces/lister-setting';
import { OliveReferHostComponent } from 'app/core/components/entries/refer-host/refer-host.component';
import { OlivePurchaseOrderService } from '../../../services/purchase-order.service';
import { VoidPurchaseOrder } from '../../../models/void-purchase-order.model';
import { PurchaseOrder } from '../../../models/purchase-order.model';
import { OlivePurchaseOrderManagerComponent } from '../../purchase-order/purchase-order-manager/purchase-order-manager.component';
import { OliveUtilities } from 'app/core/classes/utilities';

@Component({
  selector: 'olive-void-purchase-order-editor',
  templateUrl: './void-purchase-order-editor.component.html',
  styleUrls: ['./void-purchase-order-editor.component.scss']
})
export class OliveVoidPurchaseOrderEditorComponent extends OliveEntityFormComponent {
  @ViewChild('warehouse')
  lookupWarehouse: OliveLookupHostComponent;

  @ViewChild('purchaseOrder') 
  referPurchaseOrder: OliveReferHostComponent;

  disableWarehouseChangedEvent = false;

  @Output() warehouseChanged = new EventEmitter();

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private warehouseService: OliveWarehouseService, private purchaseOrderService: OlivePurchaseOrderService
  ) {
    super(
      formBuilder, translator
    );
  }

  get warehouseId() {
    return this.getControl('purchaseOrderFk').value.warehouseId;
  }

  getEditedItem(): VoidPurchaseOrder {
    const formModel = this.oForm.value;

    return this.itemWithIdNAudit({
      inWarehouseFk: {
        memo : formModel.memo,
        warehouseId : this.warehouseId
      },
      purchaseOrderFk: this.item.purchaseOrderFk,
      returnTrackings: this.item.returnTrackings
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      warehouseFk: null,
      purchaseOrderFk: null,
      supplierName: '',
      memo: '',
    });
  }

  resetForm() {
    const row = this.item as VoidPurchaseOrder;

    if (row.inWarehouseFk && !this.isNull(row.inWarehouseFk.warehouseFk)) {
      this.disableWarehouseChangedEvent = true;
    }

    this.oForm.reset({
      warehouseFk: row.inWarehouseFk && row.inWarehouseFk.warehouseFk ? row.inWarehouseFk.warehouseFk : null,
      purchaseOrderFk: row.purchaseOrderFk,
      supplierName: row.purchaseOrderFk && row.purchaseOrderFk.supplierFk && row.purchaseOrderFk.supplierFk.name ? row.purchaseOrderFk.supplierFk : '',
      memo: row.inWarehouseFk ? row.inWarehouseFk.memo : ''
    });

    if (this.item.warehouseFk) {
      this.warehouseChanged.emit({item: this.item.warehouseFk, loading: true});
    }
  }

  createEmptyObject() {
    return new VoidPurchaseOrder();
  }

  initializeChildComponent() {
    this.lookupWarehouse.setting = {
      name: 'Warehouse',
      columnType: 'code',
      dialogTitle: this.translator.get(NavTranslates.Company.warehouse),
      dataService: this.warehouseService,
      maxSelectItems: 1,
      newComponent: OliveWarehouseManagerComponent,
      itemType: Warehouse,
      managePermission: Permission.assignCompanyGroups,
      translateTitleId: NavTranslates.Company.warehouse
    } as LookupListerSetting;

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
    return OliveUtilities.dateCode(order.date, order.id);
  }

  customTitle(order: PurchaseOrder, template: string): string {
    return OliveUtilities.showParamMessage(template, OliveUtilities.dateCode(order.date, order.id));
  }

  markCustomControlsTouched() {
    this.lookupWarehouse.markAsTouched();
  }

  onWarehouseChanged(input: any) {
    if (!this.disableWarehouseChangedEvent) {
      this.warehouseChanged.emit({item: input, loading: false});
    }
    else {
      this.disableWarehouseChangedEvent = false;
    }
  }

  lookUp() {
    this.lookupWarehouse.lookUp();
  }
}
