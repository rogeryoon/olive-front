﻿import { Component, ViewChild, QueryList, ViewChildren } from '@angular/core';
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
import { createMapFrom } from 'app/core/utils/array-helpers';
import { createSearchOption } from 'app/core/utils/search-helpers';
import { MarketSeller } from 'app/main/supports/models/market-seller.model';
import { fuseAnimations } from '@fuse/animations';

class OliveTable {
  static readonly selector = '.roger-table';

  public static topTableSelector(param: any) {
    return '#' + $(param).attr('id').replace('-bottom', '-top');
  }

  public static bottomTableSelector(param: any) {
    return '#' + $(param).attr('id');
  }

  public static setBottomTableWidth() {
    $(this.selector).each(function () {
      $(OliveTable.bottomTableSelector(this)).width(100);
      
      $(OliveTable.bottomTableSelector(this))
        .width($(OliveTable.topTableSelector(this)).width());
    });
  }

  public static setBottomTableScrollWidth() {
    $(this.selector).each(function () {
      const bottomTableSelector = OliveTable.bottomTableSelector(this);
      $(bottomTableSelector).on('scroll', function () {
        $(`${bottomTableSelector} > *`).width($(bottomTableSelector).width() + $(bottomTableSelector).scrollLeft());
      });
    });
  }

  public static bindTopTableResizeEvent() {
    $(this.selector).each(function () {
      const topTableSelector = OliveTable.topTableSelector(this);

      $(window).off('resize').on('resize', function () {
        OliveTable.setBottomTableWidth();
        OliveTable.setBottomTableScrollWidth();
      });
    });
  }
}

@Component({
  selector: 'olive-order-ship-out-lister-manager',
  templateUrl: './order-ship-out-package-lister-manager.component.html',
  styleUrls: ['./order-ship-out-package-lister-manager.component.scss'],
  animations: fuseAnimations
})
export class OliveOrderShipOutPackageListerManagerComponent extends OliveEntityEditComponent {
  warehouses: Warehouse[];
  markerSellers: MarketSeller[];
  inventories: InventoryWarehouse[];
  pendingOrderShipOuts: OrderShipOut[] = [];
  pendingOrderShipOutPackages: OrderShipOutPackage[] = [];
  parentObject: OliveOnShare = { bool1: false };
  customsConfigs = new Map<string, any>();
  countries = new Map<number, Country>();
  carrierTrackingNumbersGroups: CarrierTrackingNumbersGroup[] = [];

  @ViewChild('warehouseCheckboxes')
  private warehouseSelector: OliveCheckboxSelectorPanelComponent;

  @ViewChild('marketSellerCheckboxes')
  private markerSellerSelector: OliveCheckboxSelectorPanelComponent;  

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

  initializeChildComponent() { }

  onAfterViewInit() {
    if (this.orderPackageListers.length === 0) {
      return;
    }
  }

  buildForm() {
    this.warehouseSelector.setItems(this.item.warehouses);
    this.markerSellerSelector.setItems(this.item.marketSellers);
    this.oForm = this.formBuilder.group({});
  }

  resetForm() {
    this.warehouseSelector.cacheKey = this.cacheService.keyWarehouseCheckboxes;
    this.markerSellerSelector.cacheKey = this.cacheService.keyMarketSellerCheckboxes;
  }

  get hideSelector(): boolean {
    return !this.isNull(this.warehouses) && !this.isNull(this.markerSellers);
  }

  get canLoadShipOutData(): boolean {
    return this.warehouseSelector.selectedItems.length > 0 && 
      this.markerSellerSelector.selectedItems.length > 0;
  }

  onAllCheckboxesSelected() {
    this.warehouses = this.warehouseSelector.selectedItems;
    this.warehouseSelector.setUserPreference();

    this.markerSellers = this.markerSellerSelector.selectedItems;
    this.markerSellerSelector.setUserPreference();

    this.loadAllData();
  }

  private loadAllData() {
    setTimeout(() => {
      this.getInventories();
      this.getPendingOrderPackages();
      this.getConfigs();
    });
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
    this.cacheService.getItems(this.countryService, OliveCacheService.cacheKeys.getItemsKey.country)
    .then((items: Country[]) => {
      this.countries = createMapFrom(items);
      this.setChildConfigs(OliveConstants.listerConfigType.countries, this.countries);
    });
  }

  private getPendingOrderPackages(refresh: boolean = false) {
    this.orderShipOutPackageService.getItems(
      createSearchOption(
        [
          { name: 'listing', value: true },
          { name: 'marketSeller', value: this.markerSellers.map(x => x.id).join() }
        ], 
        'id',
        'desc'
      ))
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
    const option = createSearchOption(
      [
        { name: 'quantity', value: 0 }, 
        { name: 'warehouse', value: this.warehouses.map(a => a.id).join() }
      ],
      'id', 
      'desc'
    );

    this.inventoryService.getInventoryWarehouse(option)
      .subscribe(res => {
        this.inventories = res.model;
        this.getPendingOrders(refresh);
      }, error => {
        this.messageHelper.showLoadFailedSticky(error);
      });
  }

  private getPendingOrders(refresh: boolean) {
    this.orderShipOutService.getItems(
      createSearchOption(
        [
          { name: 'listing', value: true },
          { name: 'marketSeller', value: this.markerSellers.map(x => x.id).join() }
        ], 
        'id',
        'desc'
      ))
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

  public onTabClick(event: any): void {
    OliveTable.setBottomTableWidth();    
    OliveTable.setBottomTableScrollWidth();
    OliveTable.bindTopTableResizeEvent();
  }
}
