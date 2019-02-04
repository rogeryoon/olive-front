import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DeviceDetectorService } from 'ngx-device-detector';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';
import { Permission } from '@quick/models/permission.model';

import { NavIcons } from 'app/core/navigations/nav-icons';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveEntityListComponent } from 'app/core/components/entity-list/entity-list.component';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveDocumentService } from 'app/core/services/document.service';
import { OliveUtilities } from 'app/core/classes/utilities';

import { OliveSearchPurchaseOrderComponent } from './search-purchase-order/search-purchase-order.component';
import { OlivePurchaseOrderService } from '../services/purchase-order.service';
import { PurchaseOrder } from '../models/purchase-order.model';
import { OlivePurchaseOrderManagerComponent } from './purchase-order-manager/purchase-order-manager.component';

const Selected = 'selected';
const Id = 'id';
const VendorName = 'vendorName';
const ItemsName = 'itemsName';
const TotalDueAmount = 'totalDueAmount';
const PaymentsName = 'paymentsName';
const InWarehouseStatusLink = 'statusLink';
const FinishLink = 'finishLink';
const PrintLink = 'printLink';
const PODate = 'date';

@Component({
  selector: 'olive-purchase-order',
  templateUrl: '../../../../core/components/entity-list/entity-list.component.html',
  styleUrls: ['./purchase-orders.component.scss'],
  animations: fuseAnimations
})
export class OlivePurchaseOrdersComponent extends OliveEntityListComponent {
  constructor(
    translater: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OlivePurchaseOrderService
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
      name: 'PurchaseOrder',
      icon: NavIcons.Purchase.PurchaseOrderList,
      translateTitleId: NavTranslates.Purchase.PurchaseOrderList,
      managePermission: null,
      columns: [
        // 1
        { data: Selected },
        // 2
        { data: Id, thName: 'Id', tdClass: 'print -ex-type-id', thClass: 'print -ex-type-id' },
        // 3
        { data: VendorName, orderable: false, thName: 'Vendor', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 4
        { data: ItemsName, orderable: false, thName: 'Items', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 5
        { data: TotalDueAmount, thName: 'Amount', tdClass: 'print right -ex-type-money', thClass: 'print -ex-type-money' },
        // 6
        { data: PaymentsName, orderable: false, thName: 'Payment', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 7
        { data: InWarehouseStatusLink, orderable: false, thName: 'Status', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 8
        { data: FinishLink, orderable: false, thName: 'Finish', tdClass: 'print left -ex-type-text foreground-blue', thClass: 'print -ex-type-text' },
        // 9
        { data: PrintLink, orderable: false, thName: 'Print', tdClass: 'print left -ex-type-text foreground-blue', thClass: 'print -ex-type-text' },
        // 10
        { data: PODate, thName: 'Date', tdClass: '', thClass: '' },
      ],
      editComponent: OlivePurchaseOrderManagerComponent,
      searchComponent: OliveSearchPurchaseOrderComponent,
      itemType: PurchaseOrder
    };
  }

  getEditorCustomTitle(item: PurchaseOrder) {
    if (item) {
      return `PO # ${OliveUtilities.convertToBase36(item.id)} : ${item.vendorFk.name}`;
    }
    else {
      return this.translater.get(NavTranslates.Purchase.PurchaseEntry);
    }
  }

  renderItem(item: PurchaseOrder, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Id:
        retValue = OliveUtilities.convertToBase36(item.id);
        break;

      case VendorName:
        retValue = item.vendorFk.name;
        break;

      case ItemsName:
        retValue = OliveUtilities.getItemsFirstName(item.purchaseOrderItems);
        break;

      case TotalDueAmount:
        retValue = this.getTotalDueAmount(item);
        break;

      case PaymentsName:
        retValue = OliveUtilities.getItemsFirstCode(item.purchaseOrderPayments);
        break;

      case FinishLink:
        retValue = 'finish';
        break;

      case PrintLink:
        retValue = 'print';
        break;

      case PODate:
        retValue = OliveUtilities.getShortDate(item.date);
        break;
    }

    return retValue;
  }

  getTotalDueAmount(item: PurchaseOrder): string  {
    let totalItemDue = 0;
    item.purchaseOrderItems.forEach(unit => totalItemDue += unit.price * unit.quantity);

    const totalDue = 
    totalItemDue + Math.abs(item.freightAmount) + 
      Math.abs(item.taxAmount) - Math.abs(item.addedDiscountAmount);

    return OliveUtilities.showMoney(totalDue);
  }

  icon(item: PurchaseOrder, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case InWarehouseStatusLink:
        retValue = true;
        break;
    }

    return retValue;
  }

  iconName(item: PurchaseOrder, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case InWarehouseStatusLink:
        retValue = item.closedDate ? 'check' : 'access_time';
        break;
    }

    return retValue;
  }

  renderTdTooltip(item: PurchaseOrder, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case InWarehouseStatusLink:
        retValue = item.inWareHouseCompletedDate ? 
        this.translater.get('common.status.inWarehouseComplete') :
        this.translater.get('common.status.inWarehousePending');
        break;
    }

    return retValue;
  }

  onTdClick(event: any, item: PurchaseOrder, columnName: string): boolean {
    let retValue = false;

    if (
      columnName === FinishLink ||
      columnName === InWarehouseStatusLink ||
      columnName === PrintLink) {
      this.setTdId(item.id, columnName);
      retValue = true;
    }

    switch (columnName) {
      case FinishLink:
        this.onFinish(item);
        break;

      case InWarehouseStatusLink:
        this.onInWarehouseStatus(item);
        break;

      case PrintLink:
        this.onPOPrint(item);
        break;
    }

    return retValue;
  }

  renderTDClass(item: PurchaseOrder, column: any) {
    let addedClass = '';
    if (column.data === InWarehouseStatusLink) {
      addedClass = item.closedDate ? 'foreground-blue' : 'foreground-orange';
    }
    return super.renderTDClass(item, column, addedClass);
  }

  onFinish(item: PurchaseOrder) {
    
  }

  onInWarehouseStatus(item: PurchaseOrder) {
    console.log('onInWarehouseStatus');
  }

  onPOPrint(item: PurchaseOrder) {
    console.log('onPrint');
  }
}
