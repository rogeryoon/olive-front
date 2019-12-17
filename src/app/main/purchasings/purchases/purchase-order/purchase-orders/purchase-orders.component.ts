import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService, DialogType, MessageSeverity } from '@quick/services/alert.service';
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
import { OlivePurchasingMiscService } from '../../../services/purchasing-misc.service';
import { OliveDialogSetting } from 'app/core/classes/dialog-setting';
import { OlivePreviewPurchaseOrderComponent } from '../preview-purchase-order/preview-purchase-order.component';
import { OlivePreviewDialogComponent } from 'app/core/components/dialogs/preview-dialog/preview-dialog.component';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveInWarehouseStatusComponent } from '../../../in-warehouses/in-warehouse/in-warehouse-status/in-warehouse-status.component';
import { LookupListerSetting } from 'app/core/interfaces/setting/lookup-lister-setting';
import { NameValue } from 'app/core/models/name-value';
import { OliveInWarehouseItemService } from '../../../services/in-warehouse-items.service';
import { InWarehouseItem } from 'app/main/purchasings/models/in-warehouse-item.model';
import { getItemsFirstName, addSpanAddedCount, getItemsFirstCode } from 'app/core/utils/string-helper';
import { createSearchOption } from 'app/core/utils/search-helpers';

const Selected = 'selected';
const Id = 'id';
const SupplierName = 'supplierName';
const ItemsName = 'itemsName';
const Warehouse = 'warehouse';
const TotalAmount = 'totalAmount';
const PaymentsName = 'paymentsName';
const InWarehouseStatusLink = 'statusLink';
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

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService, 
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    documentService: OliveDocumentService, dialog: MatDialog, 
    dataService: OlivePurchaseOrderService, private miscService: OlivePurchasingMiscService, 
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
    this.setting = {
      icon: NavIcons.Purchase.list,
      translateTitleId: NavTranslates.Purchase.list,
      managePermission: null,
      columns: [
        // 1
        { data: Selected },
        // 2ㄴ
        { data: Id, thName: this.translator.get('common.tableHeader.id'), 
          tdClass: 'print -ex-type-id', thClass: 'print -ex-type-id' },
        // 3
        { data: SupplierName, orderable: false, thName: this.translator.get('common.tableHeader.supplier'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 4
        { data: ItemsName, orderable: false, thName: this.translator.get('common.tableHeader.itemsName'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 5
        { data: Warehouse, orderable: false, thName: this.translator.get('common.tableHeader.warehouse'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },        
        // 6
        { data: TotalAmount, thName: this.translator.get('purchasing.purchaseOrdersHeader.totalAmount'), 
          tdClass: 'print right -ex-type-number', thClass: 'print -ex-type-number' },
        // 7
        { data: PaymentsName, orderable: false, thName: this.translator.get('purchasing.purchaseOrdersHeader.paymentsName'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 8
        { data: InWarehouseStatusLink, orderable: false, thName: this.translator.get('purchasing.purchaseOrdersHeader.inWarehouseStatusLink'), 
          tdClass: 'left -ex-type-text', thClass: '-ex-type-text' },
        // 9
        { data: FinishLink, orderable: false, thName: this.translator.get('purchasing.purchaseOrdersHeader.finishLink'), 
          tdClass: 'left -ex-type-text foreground-blue', thClass: '-ex-type-text' },
        // 10
        { data: PrintLink, orderable: false, thName: this.translator.get('purchasing.purchaseOrdersHeader.printLink'), 
          tdClass: 'left -ex-type-text foreground-blue', thClass: '-ex-type-text' }
      ],
      editComponent: OlivePurchaseOrderManagerComponent,
      searchComponent: OliveSearchPurchaseOrderComponent,
      itemType: PurchaseOrder
    };
  }

  getEditorCustomTitle(item: PurchaseOrder): string {
    if (item) {
      return `${this.translator.get('navi.purchase.group')} ID : ${this.dateCode(item.date)}-${item.shortId}`;
    }
    else {
      return this.translator.get(NavTranslates.Purchase.entry);
    }
  }

  getEditDialogReadOnly(item: PurchaseOrder): boolean {
    return item && item.closedDate;
  }

  renderItem(item: PurchaseOrder, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Id:
        retValue = `${this.dateCode(item.date)}-${item.shortId}`;
        break;

      case SupplierName:
        retValue = item.supplierFk.name;
        break;

      case ItemsName:
        retValue = getItemsFirstName(item.purchaseOrderItems, 'productName');
        break;

      case Warehouse:
        retValue = item.warehouseFk.code;
        break;

      case TotalAmount:
        retValue = this.getTotalAmount(item);
        break;

      case PaymentsName:
        retValue = getItemsFirstCode(item.purchaseOrderPayments);
        break;

      case PrintLink:
        retValue = item.printOutCount > 1 ? addSpanAddedCount(item.printOutCount - 1) : '';
        break;
    }

    return retValue;
  }

  getTotalAmount(item: PurchaseOrder): string {
    let totalItemDue = 0;
    item.purchaseOrderItems.forEach(unit => totalItemDue += unit.price * unit.quantity - unit.discount);

    const totalDue =
      totalItemDue + Math.abs(item.freightAmount) +
      Math.abs(item.taxAmount) - Math.abs(item.addedDiscountAmount);

    return this.cacheService.showMoney(totalDue);
  }

  icon(item: PurchaseOrder, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case FinishLink:
        retValue = true;
        break;

      case InWarehouseStatusLink:
        retValue = true;
        break;

      case PrintLink:
        retValue = true;
        break;
    }

    return retValue;
  }

  iconName(item: PurchaseOrder, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case FinishLink:
        retValue = item.closedDate ? OliveConstants.iconStatus.completed : OliveConstants.iconStatus.pending;
        break;

      case InWarehouseStatusLink:
        if (item.purchaseOrderItems.length) {
          retValue = item.inWarehouseCompletedDate ? OliveConstants.iconStatus.completed : OliveConstants.iconStatus.pending;
        }
        else {
          retValue = OliveConstants.iconStatus.error;
        }
        break;

      case PrintLink:
        retValue = item.printOutCount > 0 ? OliveConstants.iconStatus.completed : OliveConstants.iconStatus.pending;
        break;
    }

    return retValue;
  }

  renderTdTooltip(item: PurchaseOrder, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case InWarehouseStatusLink:
        if (item.purchaseOrderItems.length) {
          retValue = item.inWarehouseCompletedDate ?
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

  onTdClick(event: any, item: PurchaseOrder, columnName: string): boolean {
    let retValue = false;

    if (
      columnName === FinishLink ||
      columnName === InWarehouseStatusLink ||
      columnName === PrintLink
    ) {
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

  renderTDClass(item: PurchaseOrder, column: any): string {
    let addedClass = '';

    switch (column.data) {
      case FinishLink:
        addedClass = item.closedDate ? OliveConstants.foregroundColor.blue : OliveConstants.foregroundColor.orange;
        break;

      case InWarehouseStatusLink:
        if (item.purchaseOrderItems.length) {
          addedClass = item.inWarehouseCompletedDate ? OliveConstants.foregroundColor.blue : OliveConstants.foregroundColor.orange;
        }
        else {
          addedClass = OliveConstants.foregroundColor.red;
        }
        break;

      case PrintLink:
        addedClass = item.printOutCount === 0 ? OliveConstants.foregroundColor.orange : OliveConstants.foregroundColor.blue;
        break;
    }

    return super.renderTDClass(item, column, addedClass);
  }

  patchPurchaseOrder(item: PurchaseOrder, transactionType: string) {
    this.loadingIndicator = true;

     this.miscService.patchPurchaseOrder('purchaseOrder', transactionType, item.id).subscribe(
      response => {
        this.loadingIndicator = false;

        let message = '';

        if (transactionType === 'close') {
          message = this.translator.get('purchasing.purchaseOrders.closed');
        }
        else if (transactionType === 'open') {
          message = this.translator.get('purchasing.purchaseOrders.opened');
        }

        this.alertService.showMessage(
          this.translator.get('common.title.success'), 
          message, 
          MessageSeverity.success
        );

        if (transactionType === 'print') {
          item.printOutCount = response.model;
          item.lastPrintOutUser = this.accountService.currentUser.userAuditKey;
        }
        else {
          item.inWarehouseCompletedDate = transactionType === 'close' ? response.model : null;
        }
      },
      error => {
        this.loadingIndicator = false;
        this.messageHelper.showStickySaveFailed(error, false);
      }
    );
  }

  onFinish(item: PurchaseOrder) {
    let errorDialogMessage: string;
    let errorDialogTitle: string;
    let transactionType: string;

    let startTabIndex = 0;

    if (item.closedDate) {
      transactionType = 'open';
    }
    else { // 종결 요청 Validation
      if (item.purchaseOrderItems.length === 0) { // No Item?
        errorDialogTitle = this.translator.get('common.title.errorConfirm');
        errorDialogMessage = this.translator.get('purchasing.purchaseOrders.noItem');
        startTabIndex = 1;
      }
      else if (item.purchaseOrderPayments.length === 0) { // No Payment?
        errorDialogTitle = this.translator.get('common.title.errorConfirm');
        errorDialogMessage = this.translator.get('purchasing.purchaseOrders.noPayment');
        startTabIndex = 2;
      }
      else if (item.inWarehouseCompletedDate) { // 입고완료
        transactionType = 'close';
      }
      else { // 입고중
        errorDialogTitle = this.translator.get('common.title.errorConfirm');
        errorDialogMessage = this.translator.get('purchasing.purchaseOrders.pendingInWarehouse');
      }
    }

    if (transactionType) { // 저장 확인
      this.alertService.showDialog(
        this.translator.get('common.title.yesOrNo'),
        transactionType === 'open' ? this.translator.get('purchasing.purchaseOrders.confirmOpen') : this.translator.get('purchasing.purchaseOrders.confirmClose'),
        DialogType.confirm,
        () => this.patchPurchaseOrder(item, transactionType),
        () => null,
        this.translator.get('common.button.save'),
        this.translator.get('common.button.cancel')
      );
    }
    else {
      this.alertService.showDialog
        (
          errorDialogTitle,
          errorDialogMessage,
          DialogType.alert,
          () => this.editItem(item, new Event('custom'), startTabIndex)
        );
    }
  }

  onInWarehouseStatus(item: PurchaseOrder) {
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
          searchOption: createSearchOption([{ name: 'status', value: item.id }] as NameValue[])
        } as LookupListerSetting
      });
  }

  /**
   * 발주 인쇄
   * @param item 
   * @returns  
   */
  onPOPrint(item: PurchaseOrder) {
    const printAction = 'print';
    // 아이템 작성한게 없으면 오류처리
    if (item.purchaseOrderItems.length === 0) {
      const startTabIndex = 1;
      this.alertService.showDialog
      (
        this.translator.get('common.title.errorConfirm'),
        this.translator.get('purchasing.purchaseOrders.noItemToPrint'),
        DialogType.alert,
        () => this.editItem(item, new Event('custom'), startTabIndex)
      );
      return;
    }

    const dialogSetting = new OliveDialogSetting(
      OlivePreviewPurchaseOrderComponent, 
      {
        item: item
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
        this.patchPurchaseOrder(item, printAction);
      }
    });
  }
}
