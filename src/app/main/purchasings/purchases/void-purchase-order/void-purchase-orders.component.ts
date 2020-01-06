import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

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
import { OliveCacheService } from 'app/core/services/cache.service';
import { InWarehouse } from '../../models/in-warehouse.model';
import { VoidPurchaseOrder } from '../../models/void-purchase-order.model';
import { OliveVoidPurchaseOrderService } from '../../services/void-purchase-order.service';
import { getItemsName } from 'app/core/utils/string-helper';
import { createdDateShortId } from 'app/core/utils/olive-helpers';
import { PurchaseOrderPayment } from '../../models/purchase-order-payment.model';

const Selected  = 'selected';
const Id = 'id';
const VoidType = 'voidType';
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
    translator: FuseTranslationLoaderService, alertService: AlertService, 
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    documentService: OliveDocumentService, dialog: MatDialog, 
    dataService: OliveVoidPurchaseOrderService, private cacheService: OliveCacheService
  ) {
    super(
      translator, alertService, 
      accountService, messageHelper, 
      documentService, dialog, 
      dataService
    );
  }

  initializeChildComponent() {
    this.setting = {
      icon: NavIcons.Purchase.cancel,
      translateTitleId: NavTranslates.Purchase.cancel,
      managePermission: null,
      columns: [
        { data: Selected },

        { data: Id, thName: this.translator.get('purchasing.inWarehousesHeader.voidPurchaseOrderId'), 
          tdClass: 'print -ex-type-id id', thClass: 'print -ex-type-id id' },

        { data: VoidType, orderable: false, thName: this.translator.get('purchasing.inWarehousesHeader.voidType'), 
          tdClass: 'print left -ex-type-text void-type', thClass: 'print -ex-type-text void-type' },          

        { data: Warehouse, orderable: false, thName: this.translator.get('purchasing.inWarehousesHeader.warehouse'), 
          tdClass: 'print left -ex-type-text warehouse', thClass: 'print -ex-type-text warehouse' },

        { data: Suppliers, orderable: false, thName: this.translator.get('purchasing.inWarehousesHeader.suppliers'), 
          tdClass: 'print left -ex-type-text supplier', thClass: 'print -ex-type-text supplier' },

        { data: Items, orderable: false, thName: this.translator.get('purchasing.inWarehousesHeader.items'), 
          tdClass: 'print left -ex-type-text item', thClass: 'print -ex-type-text item' },

        { data: Quantity, orderable: false, thName: this.translator.get('purchasing.inWarehousesHeader.quantity'), 
          tdClass: 'print right -ex-type-number quantity', thClass: 'print -ex-type-number quantity' },

        { data: TotalAmount, orderable: false, thName: this.translator.get('purchasing.inWarehousesHeader.totalAmount'), 
          tdClass: 'print right -ex-type-number total-amount', thClass: 'print -ex-type-number total-amount' },
      ],
      editComponent: OliveVoidPurchaseOrderManagerComponent,
      searchComponent: OliveSearchVoidPurchaseOrderComponent,
      itemType: VoidPurchaseOrder
    };
  }

  getEditorCustomTitle(item: VoidPurchaseOrder) {
    if (item) {
      return `${this.translator.get('common.word.purchaseReturnOrCancel')} ID : ${createdDateShortId(item.inWarehouseFk)}`;
    }
    else {
      return this.translator.get(NavTranslates.Purchase.cancelEntry);
    }
  }

  renderItem(order: VoidPurchaseOrder, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Id:
        retValue = createdDateShortId(order.inWarehouseFk);
        break;

      case Suppliers:
        const sets = new Set([]);
        order.inWarehouseFk.inWarehouseItems.forEach(i => sets.add(i.supplierName));
        const suppliers = [];
        sets.forEach(s => suppliers.push({name: s}));
        retValue = getItemsName(suppliers);
        break;

      case Items:
        const items = [];
        order.inWarehouseFk.inWarehouseItems.forEach(i => items.push({name: i.productName}));
        retValue = getItemsName(order.inWarehouseFk.inWarehouseItems, 'productName', 'quantity');
        break;

      case Quantity:
        retValue = this.getTotalQuantity(order.inWarehouseFk);
        break;

      case TotalAmount:
        retValue = this.getRefundAmount(order.purchaseOrderFk.purchaseOrderPayments);
        break;
        
      case Warehouse:
        retValue = order.inWarehouseFk.warehouseFk.code;
        break;

      case VoidType:
        retValue = this.translator.get('code.voidPurchaseOrderTypeCode.' + order.voidTypeCode);
        break;        
    }

    return retValue;
  }

  getRefundAmount(payments: PurchaseOrderPayment[]): string {
    return this.cacheService.showMoney(Math.abs(payments.map(x => Math.abs(x.amount)).reduce((a, b) => a + (b || 0), 0)));
  }

  getTotalQuantity(item: InWarehouse): string {
    return this.commaNumber(Math.abs(item.inWarehouseItems.map(x => x.quantity).reduce((a, b) => a + (b || 0), 0)));
  }  
}
