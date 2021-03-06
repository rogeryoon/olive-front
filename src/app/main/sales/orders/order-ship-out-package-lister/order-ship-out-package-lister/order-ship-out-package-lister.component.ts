﻿import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OrderShipOut } from '../../../models/order-ship-out.model';
import { Warehouse } from 'app/main/supports/models/warehouse.model';
import { OlivePendingOrderShipOutListComponent } from '../pending-order-ship-out-list/pending-order-ship-out-list.component';
import { OrderShipOutPackage } from 'app/main/sales/models/order-ship-out-package.model';
import { OlivePendingOrderShipOutPackageListComponent } from '../pending-order-ship-out-package-list/pending-order-ship-out-package-list.component';
import { OliveOnShare } from 'app/core/interfaces/on-share';
import { Country } from 'app/main/supports/models/country.model';
import { CarrierTrackingNumbersGroup } from 'app/main/shippings/models/carrier-tracking-numbers-group.model';
import { OliveConstants } from 'app/core/classes/constants';
import { WarehouseInventory } from 'app/main/productions/models/warehouse-inventory';

@Component({
  selector: 'olive-order-ship-out-package-lister',
  templateUrl: './order-ship-out-package-lister.component.html',
  styleUrls: ['./order-ship-out-package-lister.component.scss']
})
export class OliveOrderShipOutPackageListerComponent extends OliveEntityFormComponent {
  @Input()
  warehouse: Warehouse;

  @Input()
  warehouses: Warehouse[];

  @Input()
  index: number;

  protected pendingOrders: OrderShipOut[] = [];
  protected inventories: WarehouseInventory[] = [];
  protected pendingOrderPackages: OrderShipOutPackage[];
  customsConfigs = new Map<string, any>();
  countries = new Map<number, Country>();
  carrierTrackingNumbersGroups: CarrierTrackingNumbersGroup[] = [];

  @Output() reload = new EventEmitter<any>();
  @Output() packagesCanceled = new EventEmitter();

  @ViewChild(OlivePendingOrderShipOutListComponent)
  private pendingOrderList: OlivePendingOrderShipOutListComponent;
  
  @ViewChild(OlivePendingOrderShipOutPackageListComponent)
  private pendingOrderPackageList: OlivePendingOrderShipOutPackageListComponent;  

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService
  ) {
    super(
      formBuilder, translator
    );
  }

  get packageRemark(): string {
    return this.pendingOrderPackageList.packageRemark;
  }

  setPendingOrders(pendingOrders: OrderShipOut[], inventories: WarehouseInventory[], parentObject: OliveOnShare, refresh: boolean) {
    this.pendingOrders = pendingOrders;
    this.inventories = inventories;
    this.pendingOrderList.startTable(pendingOrders, inventories, parentObject, refresh);
  }

  setPendingOrderPackages(pendingOrderPackages: OrderShipOutPackage[], parentObject: OliveOnShare, refresh: boolean) {
    this.pendingOrderPackages = pendingOrderPackages;
    this.pendingOrderPackageList.startTable(this.pendingOrderPackages, parentObject, refresh);
    this.pendingOrderPackageList.setMarketSellerContacts();
  }

  setConfigs(configType: string, data: any) {
    switch (configType)
    {
      case OliveConstants.listerConfigType.customsConfigs:
          this.customsConfigs = data;
      break;

      case OliveConstants.listerConfigType.countries:
          this.countries = data;
      break;
      
      case OliveConstants.listerConfigType.carrierTrackingNumbersGroups:
          this.carrierTrackingNumbersGroups = data;
      break;      
    }
    
    this.pendingOrderList.setConfigs(configType, data);
    this.pendingOrderPackageList.setConfigs(configType, data);
  }

  /**
   * 출고완료 처리 후 출고 맨 상단에 해당 패키지들을 차례대로 밀어 올린다.
   * @param pendingOrderPackages 패키지
   */
  onShipOutFinished(pendingOrderPackages: OrderShipOutPackage[]) {
    for (let i = pendingOrderPackages.length - 1; i >= 0; i--) {
      this.pendingOrderPackages.unshift(pendingOrderPackages[i]);
    }
    this.pendingOrderPackageList.setMarketSellerContacts();
  }

  onShipOutPackageCanceled() {
    this.packagesCanceled.emit();
  }

  onReload(event: any) {
    this.reload.emit(event);
  }
}
