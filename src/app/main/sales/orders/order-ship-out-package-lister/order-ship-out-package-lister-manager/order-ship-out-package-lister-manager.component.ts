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
import { OliveCountryService } from 'app/main/supports/services/country.service';
import { Country } from 'app/main/supports/models/country.model';
import { CarrierTrackingNumbersGroup } from 'app/main/shippings/models/carrier-tracking-numbers-group.model';
import { OliveConstants } from 'app/core/classes/constants';
import { OliveCarrierTrackingNumberRangeService } from 'app/main/shippings/services/carrier-tracking-number-range.service';

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
  customsConfigs = new Map<string, any>();
  countries = new Map<number, Country>();
  carrierTrackingNumbersGroups: CarrierTrackingNumbersGroup[] = [];

  @ViewChild(OliveCheckboxSelectorPanelComponent)
  private warehouseSelector: OliveCheckboxSelectorPanelComponent;

  @ViewChildren(OliveOrderShipOutPackageListerComponent) orderPackageListers: QueryList<OliveOrderShipOutPackageListerComponent>;

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService,
    snackBar: MatSnackBar, formBuilder: FormBuilder,
    dataService: OliveInWarehouseService, private orderShipOutService: OliveOrderShipOutService,
    private cacheService: OliveCacheService, private inventoryService: OliveInventoryService,
    private orderShipOutPackageService: OliveOrderShipOutPackageService,
    private countryService: OliveCountryService,
    private carrierTrackingNumberRangeService: OliveCarrierTrackingNumberRangeService
  ) {
    super(
      translator, alertService,
      accountService, messageHelper,
      snackBar, formBuilder,
      dataService
    );
  }

  initializeChildComponent() {}

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
    this.getConfigs();
  }

  private getConfigs() {
    this.getCustomsConfigs();
    this.getCountryCodes();
    this.getCarrierTrackingNumbersGroups();
  }

  private getCarrierTrackingNumbersGroups() {
    this.carrierTrackingNumberRangeService.get('numbersGroup')
    .subscribe(res => {
      this.carrierTrackingNumbersGroups = res.model;
      // ID를 임의로 만들어준다.
      let id = 1;
      for (const group of this.carrierTrackingNumbersGroups) {
        group.id = id++;
      }
      this.setChildConfigs(OliveConstants.listerConfigType.carrierTrackingNumbersGroups, res.model);
    }, error => {
      this.messageHelper.showLoadFailedSticky(error);
    });
  }

  private getCustomsConfigs() {
    this.cacheService.getCustomsConfigs()
      .then((customsConfigs: Map<string, any>) => {
        this.customsConfigs = customsConfigs;
        this.setChildConfigs(OliveConstants.listerConfigType.customsConfigs, customsConfigs);
      });
  }

  private setChildConfigs(configType: string, data: any) {
    this.orderPackageListers.forEach((lister) => {
      lister.setConfigs(configType, data);
    });
  }

  private getCountryCodes() {
    const itemKey = OliveCacheService.cacheKeys.getItemsKey.country;

    if (!this.cacheService.exist(itemKey)) {
      this.countryService.getItems()
        .subscribe(res => {
          this.cacheService.set(itemKey, res.model);
          this.setCountriesConfig(res.model);
        },
          error => {
            this.messageHelper.showLoadFailedSticky(error);
          });
    }
    else {
      this.setCountriesConfig(this.cacheService.get(itemKey));
    }
  }  

  // TODO : 버그 수정
  private setCountriesConfig(countries: Country[]) {
    this.countries.clear();

    if (!countries || countries.length === 0) {
      console.error('setCountriesConfig');
    }
    
    for (const country of countries) {
      this.countries.set(country.id, country);
    }

    this.setChildConfigs(OliveConstants.listerConfigType.countries, this.countries);
  }

  private getPendingOrderPackages(refresh: boolean = false) {
    const searchOption = OliveUtilities.searchOption([{ name: 'listing', value: true } as NameValue], 'id', 'desc');

    this.orderShipOutPackageService.getItems(searchOption)
      .subscribe(res => {
        this.pendingOrderShipOutPackages = res.model;
        this.orderPackageListers.forEach((lister) => {
          lister.setPendingOrderPackages(this.pendingOrderShipOutPackages, this.parentObject, refresh);
        });
      }, error => {
        this.messageHelper.showLoadFailedSticky(error);
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
        this.messageHelper.showLoadFailedSticky(error);
      });
  }

  private getPendingOrders(refresh: boolean) {
    const searchOption = OliveUtilities.searchOption([{ name: 'listing', value: true } as NameValue], 'id', 'desc');

    this.orderShipOutService.getItems(searchOption)
      .subscribe(res => {
        this.pendingOrderShipOuts = res.model;

        // 아이템 Checkbox 선택을 저장하기위한 변수 배열 - 각 창고 Tab 수 만큼 생성
        this.pendingOrderShipOuts.forEach(order => {
          order.choices = new Array(this.warehouses.length).fill(false);
        });

        this.switchWarehouseSelector();
        this.orderPackageListers.forEach((lister) => {
          lister.setPendingOrders(this.pendingOrderShipOuts, this.inventories, this.parentObject, refresh);
        });
      }, error => {
        this.messageHelper.showLoadFailedSticky(error);
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

  /**
   * 페이지 Refresh 처리 - Refresh인수를 True로 설정할것
   */
  onReload(event: any) {
    if (event === OliveConstants.constant.carrierTrackingNumberRangeEventKey) {
      this.getCarrierTrackingNumbersGroups();
    }
    else {
      this.getInventories(true);
      this.getPendingOrderPackages(true);
    }
  }
}
