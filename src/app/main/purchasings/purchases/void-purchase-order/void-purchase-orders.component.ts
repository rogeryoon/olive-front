import { Component } from '@angular/core';
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

import { OliveSearchVoidPurchaseOrderComponent } from './search-void-purchase-order/search-void-purchase-order.component';
import { OliveVoidPurchaseOrderManagerComponent } from './void-purchase-order-manager/void-purchase-order-manager.component';
import { OliveUtilities } from 'app/core/classes/utilities';
import { OliveCacheService } from 'app/core/services/cache.service';
import { InWarehouse } from '../../models/in-warehouse.model';
import { VoidPurchaseOrder } from '../../models/void-purchase-order.model';
import { OliveVoidPurchaseOrderService } from '../../services/void-purchase-order.service';

const Selected  = 'selected';
const Id = 'id';
const Suppliers = 'suppliers';
const Items = 'items';
const Quantity = 'quantity';
const TotalAmount = 'totalAmount';
const Warehouse = 'warehouse';

@Component({
  selector: 'olive-void-purchase-orders',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./void-purchase-orders.component.scss'],
  animations: fuseAnimations
})
export class OliveVoidPurchaseOrdersComponent extends OliveEntityListComponent {
  constructor(
    translater: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveVoidPurchaseOrderService, 
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
      icon: NavIcons.Purchase.cancel,
      translateTitleId: NavTranslates.Purchase.cancel,
      managePermission: null,
      columns: [
        // 1
        { data: Selected },
        // 2
        { data: Id, thName: this.translater.get('purchasing.inWarehousesHeader.id'), 
          tdClass: 'print -ex-type-id', thClass: 'print -ex-type-id' },
        // 3
        { data: Suppliers, orderable: false, thName: this.translater.get('purchasing.inWarehousesHeader.suppliers'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 4
        { data: Items, orderable: false, thName: this.translater.get('purchasing.inWarehousesHeader.items'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 5
        { data: Quantity, orderable: false, thName: this.translater.get('purchasing.inWarehousesHeader.quantity'), 
          tdClass: 'print right -ex-type-number', thClass: 'print -ex-type-number' },
        // 6
        { data: TotalAmount, orderable: false, thName: this.translater.get('purchasing.inWarehousesHeader.totalAmount'), 
          tdClass: 'print right -ex-type-number', thClass: 'print -ex-type-number' },
        // 7
        { data: Warehouse, orderable: false, thName: this.translater.get('purchasing.inWarehousesHeader.warehouse'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },        
      ],
      editComponent: OliveVoidPurchaseOrderManagerComponent,
      searchComponent: OliveSearchVoidPurchaseOrderComponent,
      itemType: VoidPurchaseOrder
    };
  }

  getEditorCustomTitle(item: VoidPurchaseOrder) {
    if (item) {
      return `${this.translater.get('common.word.purchaseReturnOrCancel')} ID : ${this.dateCode(item.createdUtc, item.id)}`;
    }
    else {
      return this.translater.get(NavTranslates.Purchase.cancelEntry);
    }
  }

  renderItem(item: VoidPurchaseOrder, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Id:
        retValue = this.dateCode(item.createdUtc, item.id);
        break;

      case Suppliers:
        const sets = new Set([]);
        item.inWarehouseFk.inWarehouseItems.forEach(i => sets.add(i.supplierName));
        const suppliers = [];
        sets.forEach(s => suppliers.push({name: s}));
        retValue = OliveUtilities.getItemsFirstName(suppliers);
        break;

      case Items:
        const items = [];
        item.inWarehouseFk.inWarehouseItems.forEach(i => items.push({name: i.name}));
        retValue = OliveUtilities.getItemsFirstName(items);
        break;

      case Quantity:
        retValue = this.getTotalQuantity(item.inWarehouseFk);
        break;

      case TotalAmount:
        retValue = this.getTotalAmount(item.inWarehouseFk);
        break;
        
      case Warehouse:
        retValue = item.inWarehouseFk.warehouseFk.code;
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
