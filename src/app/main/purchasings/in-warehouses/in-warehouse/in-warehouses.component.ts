﻿import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DeviceDetectorService } from 'ngx-device-detector';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { NavIcons } from 'app/core/navigations/nav-icons';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveEntityListComponent } from 'app/core/components/extends/entity-list/entity-list.component';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveDocumentService } from 'app/core/services/document.service';

import { OliveSearchInWarehouseComponent } from './search-in-warehouse/search-in-warehouse.component';
import { OliveInWarehouseService } from '../services/in-warehouse.service';
import { InWarehouse } from '../models/in-warehouse.model';
import { OliveInWarehouseManagerComponent } from './in-warehouse-manager/in-warehouse-manager.component';
import { OliveUtilities } from 'app/core/classes/utilities';
import { OliveCacheService } from 'app/core/services/cache.service';

const Selected  = 'selected';
const Id = 'id';
const Vendors = 'vendors';
const Items = 'items';
const Quantity = 'quantity';
const TotalAmount = 'totalAmount';
const Warehouse = 'warehouse';

@Component({
  selector: 'olive-in-warehouse',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./in-warehouses.component.scss'],
  animations: fuseAnimations
})
export class OliveInWarehousesComponent extends OliveEntityListComponent {
  constructor(
    translater: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveInWarehouseService, 
    private cacheService: OliveCacheService
  ) {
      super(
        translater, deviceService,
        alertService, accountService,
        messageHelper, documentService, 
        dialog, dataService
      );
  }

  initializeChildComponent() {
    this.setting = {
      name: 'InWarehouse',
      icon: NavIcons.InWarehouse.List,
      translateTitleId: NavTranslates.InWarehouse.List,
      managePermission: null,
      columns: [
        // 1
        { data: Selected },
        // 2
        { data: Id, thName: this.translater.get('purchasing.inWarehousesHeader.Id'), 
          tdClass: 'print -ex-type-id', thClass: 'print -ex-type-id' },
        // 3
        { data: Vendors, orderable: false, thName: this.translater.get('purchasing.inWarehousesHeader.Vendors'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 4
        { data: Items, orderable: false, thName: this.translater.get('purchasing.inWarehousesHeader.Items'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 5
        { data: Quantity, orderable: false, thName: this.translater.get('purchasing.inWarehousesHeader.Quantity'), 
          tdClass: 'print right -ex-type-number', thClass: 'print -ex-type-number' },
        // 6
        { data: TotalAmount, orderable: false, thName: this.translater.get('purchasing.inWarehousesHeader.TotalAmount'), 
          tdClass: 'print right -ex-type-number', thClass: 'print -ex-type-number' },
        // 7
        { data: Warehouse, orderable: false, thName: this.translater.get('purchasing.inWarehousesHeader.Warehouse'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },        
      ],
      editComponent: OliveInWarehouseManagerComponent,
      searchComponent: OliveSearchInWarehouseComponent,
      itemType: InWarehouse
    };
  }

  getEditorCustomTitle(item: InWarehouse) {
    if (item) {
      return `${this.translater.get('navi.inWarehouse.group')} ID : ${this.id36(item.id)}`;
    }
    else {
      return this.translater.get(NavTranslates.InWarehouse.Entry);
    }
  }

  renderItem(item: InWarehouse, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Id:
        retValue = this.id36(item.id) + '-' + this.dateCode(item.createdUtc);
        break;

      case Vendors:
        const sets = new Set([]);
        item.inWarehouseItems.forEach(i => sets.add(i.vendorName));
        const vendors = [];
        sets.forEach(s => vendors.push({name: s}));
        retValue = OliveUtilities.getItemsFirstName(vendors);
        break;

      case Items:
        const items = [];
        item.inWarehouseItems.forEach(i => items.push({name: i.name}));
        retValue = OliveUtilities.getItemsFirstName(items);
        break;

      case Quantity:
        retValue = this.getTotalQuantity(item);
        break;

      case TotalAmount:
        retValue = this.getTotalAmount(item);
        break;
        
      case Warehouse:
        retValue = item.warehouseFk.code;
        break;
    }

    return retValue;
  }

  getTotalAmount(item: InWarehouse): string {
    let totalItemDue = 0;
    item.inWarehouseItems.forEach(unit => totalItemDue += unit.price * unit.quantity);
    return this.cacheService.showMoney(totalItemDue);
  }

  getTotalQuantity(item: InWarehouse): string {
    let totalQuantity = 0;
    item.inWarehouseItems.forEach(unit => totalQuantity += unit.quantity);
    return this.commaNumber(totalQuantity);
  }  
}