import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService, DialogType } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { NavIcons } from 'app/core/navigations/nav-icons';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveEntityListComponent } from 'app/core/components/extends/entity-list/entity-list.component';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveDocumentService } from 'app/core/services/document.service';
import { OliveConstants } from 'app/core/classes/constants';

import { OliveSearchPurchaseOrderComponent } from '../search-purchase-order/search-purchase-order.component';
import { OlivePurchaseOrderService } from '../../../services/purchase-order.service';
import { PurchaseOrder } from '../../../models/purchase-order.model';
import { OlivePurchaseOrderManagerComponent } from '../purchase-order-manager/purchase-order-manager.component';
import { OliveDialogSetting } from 'app/core/classes/dialog-setting';
import { OlivePreviewPurchaseOrderComponent } from '../preview-purchase-order/preview-purchase-order.component';
import { OlivePreviewDialogComponent } from 'app/core/components/dialogs/preview-dialog/preview-dialog.component';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveInWarehouseStatusComponent } from '../../../in-warehouses/in-warehouse/in-warehouse-status/in-warehouse-status.component';
import { LookupListerSetting } from 'app/core/interfaces/setting/lookup-lister-setting';
import { NameValue } from 'app/core/models/name-value';
import { OliveInWarehouseItemService } from '../../../services/in-warehouse-items.service';
import { InWarehouseItem } from 'app/main/purchasings/models/in-warehouse-item.model';
import { getItemsName, addCountTooltip } from 'app/core/utils/string-helper';
import { createSearchOption } from 'app/core/utils/search-helpers';
import { purchaseOrderId, purchaseOrderStatusRemark, hasTextSelection } from 'app/core/utils/olive-helpers';
import { PurchaseOrderItem } from 'app/main/purchasings/models/purchase-order-item.model';
import { isNullOrUndefined } from 'util';
import { OlivePurchaseOrderHelperService } from 'app/main/purchasings/services/purchase-order-helper.service';

const Selected = 'selected';
const Id = 'id';
const SupplierName = 'supplierName';
const ItemsName = 'itemsName';
const Warehouse = 'warehouse';
const TotalAmount = 'totalAmount';
const PaymentsName = 'paymentsName';
const InWarehouseStatus = 'statusLink';
const FinishLink = 'finishLink';
const PrintLink = 'printLink';

@Component({
  selector: 'olive-purchase-order',
  templateUrl: '../../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./purchase-orders.component.scss'],
  animations: fuseAnimations
})
export class OlivePurchaseOrdersComponent extends OliveEntityListComponent {
  purchaseService: OlivePurchaseOrderService;
  errorSubscription: Subscription;

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService, 
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    documentService: OliveDocumentService, dialog: MatDialog, 
    dataService: OlivePurchaseOrderService, private purchaseOrderHelperService: OlivePurchaseOrderHelperService, 
    private cacheService: OliveCacheService, private inWarehouseItemService: OliveInWarehouseItemService
  ) {
    super(
      translator, alertService, 
      accountService, messageHelper, 
      documentService, dialog, 
      dataService
    );

    this.purchaseService = dataService;
  }

  initializeChildComponent() {
    this.errorSubscription = this.purchaseOrderHelperService.getError().subscribe(error => {
      this.editItem(error.order, new Event('custom'), error.startTabIndex);
    });

    this.setting = {
      icon: NavIcons.Purchase.list,
      translateTitleId: NavTranslates.Purchase.list,
      managePermission: null,
      columns: [
        // 1
        { data: Selected },
        // 2
        { data: Id, thName: this.translator.get('common.tableHeader.purchaseOrderId'), 
          tdClass: 'print -ex-type-id id', thClass: 'print -ex-type-id id' },
        // 3
        { data: SupplierName, orderable: false, thName: this.translator.get('common.tableHeader.supplier'), 
          tdClass: 'print left -ex-type-text supplier', thClass: 'print -ex-type-text supplier' },
        // 4
        { data: ItemsName, orderable: false, thName: this.translator.get('common.tableHeader.itemsName'), 
          tdClass: 'print left -ex-type-text items-name', thClass: 'print -ex-type-text items-name' },
        // 5
        { data: Warehouse, orderable: false, thName: this.translator.get('common.tableHeader.warehouse'), 
          tdClass: 'print left -ex-type-text warehouse', thClass: 'print -ex-type-text warehouse' },        
        // 6
        { data: TotalAmount, thName: this.translator.get('purchasing.purchaseOrdersHeader.totalAmount'), 
          tdClass: 'print right -ex-type-number total-amount', thClass: 'print -ex-type-number total-amount' },
        // 7
        { data: PaymentsName, orderable: false, thName: this.translator.get('purchasing.purchaseOrdersHeader.paymentsName'), 
          tdClass: 'print left -ex-type-text payments-name', thClass: 'print -ex-type-text payments-name' },
        // 8
        { data: InWarehouseStatus, orderable: false, thName: this.translator.get('purchasing.purchaseOrdersHeader.inWarehouseStatus'), 
          tdClass: 'left -ex-type-text in-warehouse-status', thClass: '-ex-type-text in-warehouse-status' },
        // 9
        { data: FinishLink, orderable: false, thName: this.translator.get('purchasing.purchaseOrdersHeader.finishLink'), 
          tdClass: 'left -ex-type-text foreground-blue finish-link', thClass: '-ex-type-text finish-link' },
        // 10
        { data: PrintLink, orderable: false, thName: this.translator.get('purchasing.purchaseOrdersHeader.printLink'), 
          tdClass: 'left -ex-type-text foreground-blue print-link', thClass: '-ex-type-text print-link' }
      ],
      editComponent: OlivePurchaseOrderManagerComponent,
      searchComponent: OliveSearchPurchaseOrderComponent,
      itemType: PurchaseOrder
    };
  }

  onDestroy() {
    this.errorSubscription.unsubscribe();
  }

  getEditorCustomTitle(order: PurchaseOrder): string {
    if (order) {
      return `${this.translator.get('navi.purchase.group')} ID : ${purchaseOrderId(order)} ${purchaseOrderStatusRemark(order, this.translator)}`;
    }
    else {
      return this.translator.get(NavTranslates.Purchase.entry);
    }
  }

  getEditDialogReadOnly(order: PurchaseOrder): boolean {
    return order && !isNullOrUndefined(order.closedDate);
  }

  renderItem(order: PurchaseOrder, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Id:
        retValue = purchaseOrderId(order);
        break;

      case SupplierName:
        retValue = order.supplierFk.name;
        break;

      case ItemsName:
        retValue = getItemsName(order.purchaseOrderItems, 'productName', 'quantity');
        break;

      case Warehouse:
        retValue = order.warehouseFk.code;
        break;

      case TotalAmount:
        retValue = this.getTotalAmount(order);
        break;

      case PaymentsName:
        retValue = getItemsName(order.purchaseOrderPayments.filter(x => x.amount > 0), 'code');
        break;

      case InWarehouseStatus:
        retValue = this.getInWarehouseStatus(order.purchaseOrderItems);
        break;

      case PrintLink:
        retValue = order.printOutCount > 1 ? addCountTooltip(order.printOutCount - 1) : '';
        break;
    }

    return retValue;
  }

  /**
   * Gets in warehouse status
   * 예) 12/64, 1/10
   * @param orders 
   * @returns in warehouse status 
   */
  getInWarehouseStatus(orders: PurchaseOrderItem[]): string {
    const totalQuantity = orders.map(x => x.quantity).reduce((a, b) => a + (b || 0), 0);
    const totalInWarehouseQuantity = orders.map(x => x.quantity - x.balance - x.cancelQuantity).reduce((a, b) => a + (b || 0), 0);
    const totalCancelQuantity = orders.map(x => x.cancelQuantity).reduce((a, b) => a + (b || 0), 0);

    let cancelQuantityRemark = '';
    if (totalCancelQuantity > 0) {
      cancelQuantityRemark = `(-${this.commaNumber(totalCancelQuantity)})`;
    }

    return `${this.commaNumber(totalInWarehouseQuantity)}/${this.commaNumber(totalQuantity)}${cancelQuantityRemark}`;
  }

  getTotalAmount(order: PurchaseOrder): string {
    let totalItemDue = 0;
    order.purchaseOrderItems.forEach(unit => totalItemDue += unit.price * unit.quantity - unit.discount);

    const totalDue =
      totalItemDue + Math.abs(order.freightAmount) +
      Math.abs(order.taxAmount) - Math.abs(order.addedDiscountAmount);

    return this.cacheService.showMoney(totalDue);
  }

  icon(order: PurchaseOrder, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case FinishLink:
        retValue = true;
        break;

      case PrintLink:
        retValue = true;
        break;
    }

    return retValue;
  }

  iconName(order: PurchaseOrder, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case FinishLink:
        retValue = order.closedDate ? OliveConstants.iconStatus.locked : OliveConstants.iconStatus.unlocked;
        break;

      case PrintLink:
        retValue = order.printOutCount > 0 ? OliveConstants.iconStatus.completed : OliveConstants.iconStatus.pending;
        break;
    }

    return retValue;
  }

  renderTdTooltip(order: PurchaseOrder, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case InWarehouseStatus:
        if (order.purchaseOrderItems.length) {
          retValue = order.inWarehouseCompletedDate ?
          this.translator.get('common.status.inWarehouseComplete') :
          this.translator.get('common.status.inWarehousePending');
        }
        else {
          retValue = this.translator.get('common.status.inItemEntry');
        }
        break;

      case PrintLink:
        break;        
    }

    return retValue;
  }

  onTdClick(event: any, order: PurchaseOrder, columnName: string) {
    if (hasTextSelection()) {
      return;
    }

    if (
      columnName === FinishLink ||
      columnName === InWarehouseStatus ||
      columnName === PrintLink
    ) {
      this.setTdId(order.id, columnName);
      return;
    }

    switch (columnName) {
      case FinishLink:
        this.purchaseOrderHelperService.finishPurchaseOrder(order);
        break;

      case InWarehouseStatus:
        this.onInWarehouseStatus(order);
        break;

      case PrintLink:
        this.Print(order);
        break;
    }
  }

  renderTDClass(order: PurchaseOrder, column: any): string {
    let addedClass = '';

    switch (column.data) {
      case FinishLink:
        addedClass = order.closedDate ? OliveConstants.foregroundColor.blue : OliveConstants.foregroundColor.orange;
        break;

      case InWarehouseStatus:
        if (order.purchaseOrderItems.length) {
          addedClass = order.inWarehouseCompletedDate ? OliveConstants.foregroundColor.blue : OliveConstants.foregroundColor.orange;
        }
        else {
          addedClass = OliveConstants.foregroundColor.red;
        }
        break;

      case PrintLink:
        addedClass = order.printOutCount === 0 ? OliveConstants.foregroundColor.orange : OliveConstants.foregroundColor.blue;
        break;
    }

    return super.renderTDClass(order, column, addedClass);
  }

  onInWarehouseStatus(order: PurchaseOrder) {
    this.dialog.open(
      OliveInWarehouseStatusComponent,
      {
        disableClose: false,
        panelClass: 'mat-dialog-md',
        data: {
          name: 'InWarehouseItem',
          columnType: 'custom',
          disableSearchInput: true,
          customClick: true,
          itemTitle: this.translator.get(NavTranslates.InWarehouse.status),
          itemType: InWarehouseItem,
          dataService: this.inWarehouseItemService,
          searchOption: createSearchOption([{ name: 'status', value: order.id }] as NameValue[])
        } as LookupListerSetting
      });
  }

  /**
   * 발주 인쇄
   * @param order 
   * @returns  
   */
  Print(order: PurchaseOrder) {
    const printAction = OliveConstants.listExtraCommand.print;
    // 아이템 작성한게 없으면 오류처리
    if (order.purchaseOrderItems.length === 0) {
      const startTabIndex = 1;
      this.alertService.showDialog
      (
        this.translator.get('common.title.errorConfirm'),
        this.translator.get('purchasing.purchaseOrders.noItemToPrint'),
        DialogType.alert,
        () => this.editItem(order, new Event('custom'), startTabIndex)
      );
      return;
    }

    const dialogSetting = new OliveDialogSetting(
      OlivePreviewPurchaseOrderComponent, 
      {
        item: order
      }
    );
    const dialogRef = this.dialog.open(
      OlivePreviewDialogComponent,
      {
        disableClose: false,
        panelClass: 'mat-dialog-md',
        data: dialogSetting
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result === printAction) {
        this.purchaseOrderHelperService.patchPurchaseOrder(order, printAction);
      }
    });
  }
}
