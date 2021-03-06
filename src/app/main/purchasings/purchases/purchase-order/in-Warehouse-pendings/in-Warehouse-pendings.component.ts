﻿import { Component } from '@angular/core';
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

import { OliveSearchPurchaseOrderComponent } from '../search-purchase-order/search-purchase-order.component';
import { OlivePurchaseOrderService } from '../../../services/purchase-order.service';
import { PurchaseOrder } from '../../../models/purchase-order.model';
import { OlivePurchaseOrderManagerComponent } from '../purchase-order-manager/purchase-order-manager.component';
import { OliveCacheService } from 'app/core/services/cache.service';
import { NameValue } from 'app/core/models/name-value';
import { purchaseOrderId, purchaseOrderStatusRemark, hasTextSelection } from 'app/core/utils/olive-helpers';
import { PurchaseOrderItem } from 'app/main/purchasings/models/purchase-order-item.model';
import { OliveDialogSetting } from 'app/core/classes/dialog-setting';
import { OliveVoidPurchaseOrderManagerComponent } from '../../void-purchase-order/void-purchase-order-manager/void-purchase-order-manager.component';
import { VoidPurchaseOrder } from 'app/main/purchasings/models/void-purchase-order.model';
import { OliveOnEdit } from 'app/core/interfaces/on-edit';
import { OliveEditDialogComponent } from 'app/core/components/dialogs/edit-dialog/edit-dialog.component';

@Component({
  selector: 'olive-in-warehouse-pendings',
  templateUrl: './in-warehouse-pendings.component.html',
  styleUrls: ['./in-warehouse-pendings.component.scss'],
  animations: fuseAnimations
})
export class OliveInWarehousePendingComponent extends OliveEntityListComponent {
  purchaseService: OlivePurchaseOrderService;

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService, 
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    documentService: OliveDocumentService, dialog: MatDialog, 
    dataService: OlivePurchaseOrderService, private cacheService: OliveCacheService
  ) {
    super(
      translator, alertService, 
      accountService, messageHelper, 
      documentService, dialog, 
      dataService
    );

    this.purchaseService = dataService;
    this.standCurrency = this.cacheService.standCurrency;
  }

  initializeChildComponent() {
    this.setting = {
      icon: NavIcons.Purchase.inWarehousePending,
      translateTitleId: NavTranslates.Purchase.inWarehousePending,
      managePermission: null,
      columns: [
        { data: 'id', orderable: false},
        { data: 'c1', orderable: false},
        { data: 'c2', orderable: false},
        { data: 'c3', orderable: false},
        { data: 'c4', orderable: false},
        { data: 'c5', orderable: false},
        { data: 'c6', orderable: false},
        { data: 'c7', orderable: false}
      ],
      editComponent: OlivePurchaseOrderManagerComponent,
      searchComponent: OliveSearchPurchaseOrderComponent,
      itemType: PurchaseOrder,
      orders: [['id', 'desc']],
      extraSearches: [{ name: 'InWarehousePending', value: 'true' }] as NameValue[],
      isEditDialogReadOnly: true,
      hideSortArrow: true,
      hideSelectCheckBox: true
    };
  }

  isMaster(order: PurchaseOrder): boolean {
    return order.tagCode === 'M';
  }

  purchaseOrderId(order: PurchaseOrder): string {
    return purchaseOrderId(order);
  }

  productVariantId(item: PurchaseOrderItem): string {
    return this.id26(item.productVariantId);
  }

  // Table에 표시하기 위해 Sub에 있는 Items를 Empty PurchaseOrder를 만들어 올린다.
  convertModel(model: PurchaseOrder[]) {
    for (let i = 0; i < model.length; i++) {
      if (!model[i].tagCode) {
        if (model[i].purchaseOrderItems && model[i].purchaseOrderItems.some(s => !s.tagProcessed && s.balance > 0)) {
          const purchaseOrder = jQuery.extend(true, {}, model[i]);

          purchaseOrder.tagCode = 'D';

          const purchaseOrderItem = model[i].purchaseOrderItems.find(p => !p.tagProcessed && p.balance > 0);
          purchaseOrderItem.tagProcessed = true;
          
          purchaseOrder.tagPurchaseOrderItem = jQuery.extend(true, {}, purchaseOrderItem);

          model.splice(i + 1, 0, purchaseOrder);
        }
        else {
          model[i].tagCode = 'M';
        }

        this.convertModel(model);
      }
    }

    return model;
  }

  onTdClick(event: any, order: PurchaseOrder, columnName: string) {
    if (hasTextSelection()) {
      return;
    }

    const setting = new OliveDialogSetting(
      OliveVoidPurchaseOrderManagerComponent,
      {
        item: null,
        itemType: VoidPurchaseOrder,
        customTitle: this.translator.get('purchasing.inWarehousePendingHeader.cancelInWarehouseLink'),
        extraParameter: order
      } as OliveOnEdit
    );

    const dialogRef = this.dialog.open(
      OliveEditDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: setting
      });

    dialogRef.afterClosed().subscribe(item => {
      if (item) {
        this.reRender();
      }
    });
  }

  getEditorCustomTitle(item: PurchaseOrder) {
    if (item) {
      return `${this.translator.get('navi.purchase.group')} ID : ${purchaseOrderId(item)} ${purchaseOrderStatusRemark(item, this.translator)}`;
    }
    else {
      return this.translator.get(NavTranslates.Purchase.entry);
    }
  }

  // TODO : onPrint
  onPrint() {
    console.log('print');
  }

  // TODO : onExcel
  onExcel() {
    console.log('excel');
  }
}
