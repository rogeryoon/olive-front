import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService, MessageSeverity, DialogType } from '@quick/services/alert.service';
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
import { OliveConstants } from 'app/core/classes/constants';
import { getShortDate } from 'app/core/utils/date-helper';
import { OlivePurchasingMiscService } from '../../services/purchasing-misc.service';

const Selected  = 'selected';
const Id = 'id';
const VoidType = 'voidType';
const Suppliers = 'suppliers';
const Items = 'items';
const Quantity = 'quantity';
const TotalAmount = 'totalAmount';
const Warehouse = 'warehouse';
const LockLink = 'lockLink';
const ConfirmLink = 'confirmLink';

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
    dataService: OliveVoidPurchaseOrderService, private cacheService: OliveCacheService,
    private miscService: OlivePurchasingMiscService
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

        { data: LockLink, orderable: false, thName: this.translator.get('purchasing.inWarehousesHeader.lockLink'), 
          tdClass: 'left -ex-type-text foreground-blue lock-link', thClass: '-ex-type-text lock-link' },

        { data: ConfirmLink, orderable: false, thName: this.translator.get('purchasing.inWarehousesHeader.confirmLink'), 
          tdClass: 'left -ex-type-text foreground-blue confirm-link', thClass: '-ex-type-text confirm-link' }          
      ],
      editComponent: OliveVoidPurchaseOrderManagerComponent,
      searchComponent: OliveSearchVoidPurchaseOrderComponent,
      itemType: VoidPurchaseOrder,
      disabledContextMenus: [ OliveConstants.contextMenu.upload ],
      customContextMenus: [{ iconName: 'polymer', titleId: 'purchasing.voidPurchaseOrders.batchConfirmMenuName' }]
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

  icon(order: VoidPurchaseOrder, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case LockLink:
        retValue = true;
        break;

      case ConfirmLink:
        retValue = true;
        break;
    }

    return retValue;
  }

  iconName(order: VoidPurchaseOrder, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case LockLink:
        retValue = order.closedDate ? OliveConstants.iconStatus.completed : OliveConstants.iconStatus.pending;
        break;

      case ConfirmLink:
        retValue = order.confirmedDate ? OliveConstants.iconStatus.completed : OliveConstants.iconStatus.pending;
        break;
    }

    return retValue;
  }

  renderTdTooltip(order: VoidPurchaseOrder, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case LockLink:
        if (order.confirmedDate) {
          retValue = this.translator.get('purchasing.voidPurchaseOrders.disabledOpened');
        }
        break;

      case ConfirmLink:
        if (order.confirmedDate) {
          retValue = getShortDate(order.confirmedDate, true);
        }
        break;
    }

    return retValue;
  }

  renderTDClass(order: VoidPurchaseOrder, column: any): string {
    let addedClass = '';

    switch (column.data) {
      case LockLink:
        addedClass = order.closedDate ? OliveConstants.foregroundColor.blue : OliveConstants.foregroundColor.orange;
        break;

      case ConfirmLink:
        addedClass = order.confirmedDate ? OliveConstants.foregroundColor.blue : OliveConstants.foregroundColor.orange;
        break;
    }

    return super.renderTDClass(order, column, addedClass);
  }

  onTdClick(event: any, order: VoidPurchaseOrder, columnName: string): boolean {
    let retValue = false;

    if (
      columnName === LockLink ||
      columnName === ConfirmLink
    ) {
      this.setTdId(order.id, columnName);
      retValue = true;
    }

    switch (columnName) {
      case LockLink:
        this.onLock(order);
        break;

      case ConfirmLink:
        this.onConfirm(order);
        break;
    }

    return retValue;
  }

  onLock(order: VoidPurchaseOrder) {
    if (order.confirmedDate) {
      return;
    }

    const transactionType = order.closedDate ? OliveConstants.listExtraCommand.open : OliveConstants.listExtraCommand.close;

    this.patchInWarehouse([order], transactionType);
  }

  onConfirm(order: VoidPurchaseOrder) {
    if (order.confirmedDate) {
      return;
    }

    this.alertService.showDialog(
      this.translator.get('common.title.yesOrNo'),
      this.translator.get('purchasing.voidPurchaseOrders.confirmConfirm'),
      DialogType.confirm,
      () => this.patchInWarehouse([order], OliveConstants.listExtraCommand.confirm),
      () => null,
      this.translator.get('common.button.save'),
      this.translator.get('common.button.cancel')
    );  
  }

  patchInWarehouse(orders: VoidPurchaseOrder[], transactionType: string) {
    this.loadingIndicator = true;

    const orderIdsString = orders.map(x => x.id).join();

     this.miscService.patchInWarehouse(transactionType, orderIdsString).subscribe(
      response => {
        this.loadingIndicator = false;

        let message = '';

        if (transactionType === OliveConstants.listExtraCommand.close) {
          message = this.translator.get('purchasing.voidPurchaseOrders.closed');
        }
        else if (transactionType === OliveConstants.listExtraCommand.open) {
          message = this.translator.get('purchasing.voidPurchaseOrders.opened');
        }

        this.alertService.showMessage(
          this.translator.get('common.title.success'), 
          message, 
          MessageSeverity.success
        );

        if (transactionType === OliveConstants.listExtraCommand.confirm) {
          const results = response.model as any[];
          for (const result of results) {
            const row = orders.find(x => x.id === result.id);
            row.confirmedDate = result.confirmedDate;
            row.confirmedUser = result.confirmedUser;
            row.closedDate = row.confirmedDate;
          }
        }
        else {
          orders[0].closedDate = transactionType === OliveConstants.listExtraCommand.close ? response.model.closedDate : null;
        }
      },
      error => {
        this.loadingIndicator = false;
        this.messageHelper.showStickySaveFailed(error, false);
      }
    );
  }

  getRefundAmount(payments: PurchaseOrderPayment[]): string {
    return this.cacheService.showMoney(Math.abs(payments.map(x => Math.abs(x.amount)).reduce((a, b) => a + (b || 0), 0)));
  }

  getTotalQuantity(item: InWarehouse): string {
    return this.commaNumber(Math.abs(item.inWarehouseItems.map(x => x.quantity).reduce((a, b) => a + (b || 0), 0)));
  }

  getEditDialogReadOnly(order: VoidPurchaseOrder): boolean {
    return order && (order.confirmedDate || order.closedDate);
  }
}
