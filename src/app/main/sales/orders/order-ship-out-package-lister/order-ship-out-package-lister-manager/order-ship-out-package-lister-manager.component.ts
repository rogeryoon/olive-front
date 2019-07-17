import { Component, ViewChild, QueryList, ViewChildren, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OliveInWarehouseService } from 'app/main/purchasings/services/in-warehouse.service';
import { Warehouse } from 'app/main/supports/models/warehouse.model';
import { OliveCheckboxSelectorPanelComponent } from 'app/core/components/entries/checkbox-selector-panel/checkbox-selector-panel.component';
import { OliveUtilities } from 'app/core/classes/utilities';
import { NameValue } from 'app/core/models/name-value';
import { OliveOrderShipOutService } from 'app/main/sales/services/order-ship-out.service';
import { OrderShipOut } from 'app/main/sales/models/order-ship-out.model';
import { OliveOrderShipOutPackageListerComponent } from '../order-ship-out-package-lister/order-ship-out-package-lister.component';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveInventoryService } from 'app/main/productions/services/inventory.service';
import { InventoryWarehouse } from 'app/main/productions/models/inventory-warehouse';
import { OliveOrderShipOutPackageService } from 'app/main/sales/services/order-ship-out-package.service';
import { OrderShipOutPackage } from 'app/main/sales/models/order-ship-out-package.model';
import { OliveOnShare } from 'app/core/interfaces/on-share';

@Component({
  selector: 'olive-order-ship-out-lister-manager',
  templateUrl: './order-ship-out-package-lister-manager.component.html',
  styleUrls: ['./order-ship-out-package-lister-manager.component.scss']
})
export class OliveOrderShipOutPackageListerManagerComponent extends OliveEntityEditComponent {
  warehouses: Warehouse[];
  inventories: InventoryWarehouse[];
  pendingOrderShipOuts: OrderShipOut[] = [];
  pendingOrderShipOutPackages: OrderShipOutPackage[] = [];
  parentObject: OliveOnShare = {bool1: false};

  @ViewChild(OliveCheckboxSelectorPanelComponent)
  private warehouseSelector: OliveCheckboxSelectorPanelComponent;

  @ViewChildren(OliveOrderShipOutPackageListerComponent) orderPackageListers: QueryList<OliveOrderShipOutPackageListerComponent>;

  constructor(
    translater: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService,
    snackBar: MatSnackBar, formBuilder: FormBuilder,
    dataService: OliveInWarehouseService, private orderShipOutService: OliveOrderShipOutService,
    private cacheService: OliveCacheService, private inventoryService: OliveInventoryService,
    private orderShipOutPackageService: OliveOrderShipOutPackageService
  ) {
    super(
      translater, alertService,
      accountService, messageHelper,
      snackBar, formBuilder,
      dataService
    );
  }

  onAfterViewInit() {
    if (this.orderPackageListers.length === 0) {
      return;
    }
  }

  buildForm() {
    this.warehouseSelector.setItems(this.item);
    this.oForm = this.formBuilder.group({});
  }

  resetForm() {
    this.warehouseSelector.cacheKey = this.cacheService.keyWarehouseCheckboxes;
  }

  warehouseSelected(warehouses: any[]) {
    this.warehouses = warehouses;

    this.getInventories();
    this.getPendingOrderPackages();
  }

  private getPendingOrderPackages() {
    const searchOption = OliveUtilities.searchOption([{ name: 'listing', value: true } as NameValue], 'id', 'desc');

    this.orderShipOutPackageService.getItems(searchOption)
      .subscribe(res => {
        this.pendingOrderShipOutPackages = res.model;
        this.orderPackageListers.forEach((lister) => {
          lister.setPendingOrderPackages(this.pendingOrderShipOutPackages, this.parentObject);
        });
      }, error => {
        this.messageHelper.showLoadFaildSticky(error);
      });
  }

  private getInventories(refresh: boolean = false) {
    const searchOption = OliveUtilities.searchOption([
      { name: 'quantity', value: 0 } as NameValue,
      { name: 'warehouse', value: this.warehouses.map(a => a.id).join() } as NameValue], 
      'id', 'desc'
    );

    this.inventoryService.getInventoryWarehouse(searchOption)
      .subscribe(res => {
        this.inventories = res.model;
        this.getPendingOrders(refresh);
      }, error => {
        this.messageHelper.showLoadFaildSticky(error);
      });
  }

  private getPendingOrders(refresh: boolean) {
    const searchOption = OliveUtilities.searchOption([{ name: 'listing', value: true } as NameValue], 'id', 'desc');

    this.orderShipOutService.getItems(searchOption)
      .subscribe(res => {
        this.pendingOrderShipOuts = res.model;

        // 아이템 Checkbox 선택을 저장하기위한 변수 배열 - 각 창고 Tab 수 만큼 생성
        this.pendingOrderShipOuts.forEach(order => {
          order.selecteds = new Array(this.warehouses.length).fill(false);
        });

        this.switchWarehouseSelector();
        this.orderPackageListers.forEach((lister) => {
          lister.setPendingOrders(this.pendingOrderShipOuts, this.inventories, this.parentObject, refresh);
        });
      }, error => {
        this.messageHelper.showLoadFaildSticky(error);
      });
  }

  private switchWarehouseSelector() {
    this.warehouseSelector.visible = 
      this.warehouses == null && 
      this.inventories == null && 
      this.pendingOrderShipOuts == null;
  }

  onShipOutPackageCanceled() {
    this.getInventories(true);
  }

  onReload() {
    console.log('Manager Parent Reload');
  }
}
