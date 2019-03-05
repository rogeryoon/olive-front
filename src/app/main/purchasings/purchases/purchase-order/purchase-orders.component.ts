import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DeviceDetectorService } from 'ngx-device-detector';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService, DialogType, MessageSeverity } from '@quick/services/alert.service';
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
import { OlivePurchasingMiscService } from '../services/purchasing-misc.service';
import { OliveDialogSetting } from 'app/core/classes/dialog-setting';
import { OlivePreviewPurchaseOrderComponent } from './preview-purchase-order/preview-purchase-order.component';
import { OlivePreviewDialogComponent } from 'app/core/components/preview-dialog/preview-dialog.component';
import { locale as english } from '../i18n/en';
import { OliveCacheService } from 'app/core/services/cache.service';

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
    dialog: MatDialog, dataService: OlivePurchaseOrderService,
    private miscService: OlivePurchasingMiscService, private cacheService: OliveCacheService
  ) {
    super(
      translater, deviceService,
      alertService, accountService,
      messageHelper, documentService,
      dialog, dataService
    );

    this.translater.loadTranslations(english);
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
        { data: TotalDueAmount, thName: 'Amount', tdClass: 'print right -ex-type-number', thClass: 'print -ex-type-number' },
        // 6
        { data: PaymentsName, orderable: false, thName: 'Payment', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 7
        { data: InWarehouseStatusLink, orderable: false, thName: 'Status', tdClass: 'left -ex-type-text', thClass: '-ex-type-text' },
        // 8
        { data: FinishLink, orderable: false, thName: 'Finish', tdClass: 'left -ex-type-text foreground-blue', thClass: '-ex-type-text' },
        // 9
        { data: PrintLink, orderable: false, thName: 'Print', tdClass: 'left -ex-type-text foreground-blue', thClass: '-ex-type-text' },
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
      return `PO # ${this.id36(item.id)} : ${item.vendorFk.name}`;
    }
    else {
      return this.translater.get(NavTranslates.Purchase.PurchaseEntry);
    }
  }

  renderItem(item: PurchaseOrder, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Id:
        retValue = this.id36(item.id);
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
        retValue = this.date(item.date);
        break;
    }

    return retValue;
  }

  getTotalDueAmount(item: PurchaseOrder): string {
    let totalItemDue = 0;
    item.purchaseOrderItems.forEach(unit => totalItemDue += unit.price * unit.quantity);

    const totalDue =
      totalItemDue + Math.abs(item.freightAmount) +
      Math.abs(item.taxAmount) - Math.abs(item.addedDiscountAmount);

    return this.cacheService.showMoney(totalDue);
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
        if (item.purchaseOrderItems.length) {
          retValue = item.closedDate ? 'check' : 'access_time';
        }
        else {
          retValue = 'error_outline';
        }
        break;
    }

    return retValue;
  }

  renderTdTooltip(item: PurchaseOrder, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case InWarehouseStatusLink:
        if (item.purchaseOrderItems.length) {
          retValue = item.inWareHouseCompletedDate ?
          this.translater.get('common.status.inWarehouseComplete') :
          this.translater.get('common.status.inWarehousePending');
        }
        else {
          retValue = this.translater.get('common.status.inItemEntry');
        }
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
      if (item.purchaseOrderItems.length) {
        addedClass = item.closedDate ? 'foreground-blue' : 'foreground-orange';
      }
      else {
        addedClass = 'foreground-red';
      }
    }
    return super.renderTDClass(item, column, addedClass);
  }

  patchPurchaseOrder(item: PurchaseOrder, transactionType: string) {
    this.loadingIndicator = true;

    this.miscService.patchPurchaseOrder(transactionType, item.id).subscribe(
      response => {
        this.loadingIndicator = false;

        let message = '';

        if (transactionType === 'close') {
          message = this.translater.get('purchaseOrders.close');
        }
        else if (transactionType === 'open') {
          message = this.translater.get('purchaseOrders.open');
        }

        this.alertService.showMessage(
          this.translater.get('common.title.success'), 
          message, 
          MessageSeverity.success
        );
      },
      error => {
        this.loadingIndicator = false;
        this.messageHelper.showSaveFailed(error, false);
      }
    );
  }

  onFinish(item: PurchaseOrder) {
    let dialog = true;
    let message = '';
    let title = '';

    if (item.closedDate) {
      dialog = false;
      this.patchPurchaseOrder(item, 'open');
    }
    else { // 종결 요청 Validation
      if (item.purchaseOrderItems.length === 0) { // No Item?
        title = this.translater.get('common.title.errorConfirm');
        message = this.translater.get('purchaseOrders.noItem');
      }
      else if (item.purchaseOrderItems.length === 0) { // No Payment?
        title = this.translater.get('common.title.errorConfirm');
        message = this.translater.get('purchaseOrders.noPayment');
      }
      else if (item.inWareHouseCompletedDate) { // 입고완료
        dialog = false;
        this.patchPurchaseOrder(item, 'close');
      }
      else { // 입고중
        dialog = true;
        title = this.translater.get('common.title.errorConfirm');
        message = this.translater.get('purchaseOrders.pendingInWarehouse');
      }
    }

    if (dialog) {
      this.alertService.showDialog
        (
          title,
          message,
          DialogType.alert,
          () => this.editItem(item, new Event('custom'))
        );
    }
  }

  onInWarehouseStatus(item: PurchaseOrder) {
    console.log('onInWarehouseStatus');
  }

  onPOPrint(item: PurchaseOrder) {
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

    dialogRef.afterClosed().subscribe(searches => {
      if (searches != null) {
        this.setting.extraSearches = searches;
        this.dataTable().search('').draw();
      }
    });
  }
}
