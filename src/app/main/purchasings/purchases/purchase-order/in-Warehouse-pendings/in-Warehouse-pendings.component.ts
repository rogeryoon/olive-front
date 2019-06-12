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

import { OliveSearchPurchaseOrderComponent } from '../search-purchase-order/search-purchase-order.component';
import { OlivePurchaseOrderService } from '../../../services/purchase-order.service';
import { PurchaseOrder } from '../../../models/purchase-order.model';
import { OlivePurchaseOrderManagerComponent } from '../purchase-order-manager/purchase-order-manager.component';
import { OliveCacheService } from 'app/core/services/cache.service';
import { NameValue } from 'app/core/models/name-value';

@Component({
  selector: 'olive-in-warehouse-pendings',
  templateUrl: './in-warehouse-pendings.component.html',
  styleUrls: ['./in-warehouse-pendings.component.scss'],
  animations: fuseAnimations
})
export class OliveInWarehousePendingComponent extends OliveEntityListComponent {
  purchaseService: OlivePurchaseOrderService;

  constructor(
    translater: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OlivePurchaseOrderService, 
    private cacheService: OliveCacheService
  ) {
    super(
      translater, deviceService,
      alertService, accountService,
      messageHelper, documentService,
      dialog, dataService
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
      order: [[0, 'desc']],
      extraSearches: [{ name: 'InWarehousePending', value: 'true' }] as NameValue[],
      isEditDialogReadOnly: true
    };
  }

  isMaster(item: PurchaseOrder): boolean {
    return item.tagCode === 'M';
  }

  // Table에 표시하기 위해 Sub에 있는 Items를 Empty PurchaseOrder를 만들어 올린다.
  convertModel(model: PurchaseOrder[]) {
    for (let i = 0; i < model.length; i++) {
      if (!model[i].tagCode) {
        if (model[i].purchaseOrderItems && model[i].purchaseOrderItems.some(s => !s.tagProcessed && s.balance > 0)) {
          const purchaseOrder = jQuery.extend(true, {}, model[i]);

          purchaseOrder.tagCode = 'D';

          const purchseOrderItem = model[i].purchaseOrderItems.find(p => !p.tagProcessed && p.balance > 0);
          purchseOrderItem.tagProcessed = true;
          
          purchaseOrder.tagPurchaseOrderItem = jQuery.extend(true, {}, purchseOrderItem);

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

  getEditorCustomTitle(item: PurchaseOrder) {
    if (item) {
      return `${this.translater.get('navi.purchase.group')} ID : ${this.dateCode(item.date, item.id)}`;
    }
    else {
      return this.translater.get(NavTranslates.Purchase.entry);
    }
  }

  onPrint() {
    console.log('print');
  }

  onExcel() {
    console.log('excel');
  }
}
