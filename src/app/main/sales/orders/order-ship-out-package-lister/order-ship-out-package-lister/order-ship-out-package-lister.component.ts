import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OrderShipOut } from '../../../models/order-ship-out.model';
import { Warehouse } from 'app/main/supports/models/warehouse.model';
import { OlivePendingOrderShipOutListComponent } from '../pending-order-ship-out-list/pending-order-ship-out-list.component';
import { InventoryWarehouse } from 'app/main/productions/models/inventory-warehouse';
import { OrderShipOutPackage } from 'app/main/sales/models/order-ship-out-package.model';
import { OlivePendingOrderShipOutPackageListComponent } from '../pending-order-ship-out-package-list/pending-order-ship-out-package-list.component';
import { OliveOnShare } from 'app/core/interfaces/on-share';

@Component({
  selector: 'olive-order-ship-out-package-lister',
  templateUrl: './order-ship-out-package-lister.component.html',
  styleUrls: ['./order-ship-out-package-lister.component.scss']
})
export class OliveOrderShipOutPackageListerComponent extends OliveEntityFormComponent {
  @Input()
  warehouse: Warehouse;

  @Input()
  index: number;

  protected pendingOrders: OrderShipOut[] = [];
  protected inventories: InventoryWarehouse[] = [];
  protected pendingOrderPackages: OrderShipOutPackage[];

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

  setPendingOrders(pendingOrders: OrderShipOut[], inventories: InventoryWarehouse[], parentObject: OliveOnShare, refresh: boolean) {
    this.pendingOrders = pendingOrders;
    this.inventories = inventories;
    this.pendingOrderList.startTable(pendingOrders, inventories, parentObject, refresh);
  }

  setPendingOrderPackages(pendingOrderPackages: OrderShipOutPackage[], parentObject: OliveOnShare) {
    this.pendingOrderPackages = pendingOrderPackages;
    this.pendingOrderPackageList.startTable(this.pendingOrderPackages, parentObject);
  }

  onShipOutFinished(pendingOrderPackages: OrderShipOutPackage[]) {
    for (let i = pendingOrderPackages.length - 1; i >= 0; i--) {
      this.pendingOrderPackages.unshift(pendingOrderPackages[i]);
    }
  }

  onShipOutPackageCanceled() {
    this.packagesCanceled.emit();
  }

  onReload() {
    this.reload.emit();
  }
}
