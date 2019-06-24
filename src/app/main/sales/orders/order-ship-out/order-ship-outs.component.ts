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

import { OliveSearchOrderShipOutComponent } from './search-order-ship-out/search-order-ship-out.component';
import { OliveOrderShipOutService } from '../../services/order-ship-out.service';
import { OrderShipOut } from '../../models/order-ship-out.model';
import { OliveOrderShipOutManagerComponent } from './order-ship-out-manager/order-ship-out-manager.component';
import { OliveUtilities } from 'app/core/classes/utilities';
import { OliveConstants } from 'app/core/classes/constants';

const Selected = 'selected';
const Id = 'id';
const SellerCode = 'sellerCode';
const OrdererName = 'ordererName';
const ProductName = 'productName';
const Quantity = 'quantity';
const Status = 'status';
const CreatedUtc = 'createdUtc';

@Component({
  selector: 'olive-order-ship-out',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./order-ship-outs.component.scss'],
  animations: fuseAnimations
})
export class OliveOrderShipOutsComponent extends OliveEntityListComponent {
  constructor(
    translater: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveOrderShipOutService
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
      icon: NavIcons.Sales.orderList,
      translateTitleId: NavTranslates.Sales.orderList,
      managePermission: null,
      columns: [
        // 1
        { data: Selected },
        // 2
        { data: Id, thName: this.translater.get('common.tableHeader.id'), tdClass: 'print -ex-type-id', thClass: 'print -ex-type-id' },
        // 3
        { data: SellerCode, orderable: false, thName: this.translater.get('common.tableHeader.seller'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 4        
        { data: OrdererName, orderable: false, thName: this.translater.get('common.tableHeader.orderer'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 5
        { data: ProductName, orderable: false, thName: this.translater.get('common.tableHeader.itemsName'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 6
        { data: Quantity, orderable: false, thName: this.translater.get('common.tableHeader.quantity'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 7
        { data: Status, orderable: false, thName: this.translater.get('common.tableHeader.status'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 8
        { data: CreatedUtc, orderable: false, thName: this.translater.get('common.tableHeader.createdUtc'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' }
      ],
      editComponent: OliveOrderShipOutManagerComponent,
      searchComponent: OliveSearchOrderShipOutComponent,
      itemType: OrderShipOut,
      disabledContextMenus: [ OliveConstants.contextMenu.newItem, OliveConstants.contextMenu.upload ],
      editCustomButtons : [
        {id : OliveConstants.customButton.cancelOrder, iconName: 'cancel', titleId: 'common.word.cancelOrder'},
        {id : OliveConstants.customButton.restoreOrder, iconName: 'cached', titleId: 'common.word.restoreOrder'}
      ]
    };
  }

  getEditDialogReadOnly(item: OrderShipOut): boolean {
    return item && item.shipOutDate;
  }

  renderItem(item: OrderShipOut, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Id:
        retValue = this.id36(item.id);
        break;
      case SellerCode:
        retValue = item.orderFk.marketSellerFk.code;
        break;
      case OrdererName:
        retValue = item.orderFk.marketOrdererName;
        break;
      case ProductName:
        retValue = OliveUtilities.getItemsFirstName(item.orderShipOutDetails);
        break;
      case Quantity:
        retValue = this.getOrderCount(item);
        break;
      case CreatedUtc:
        retValue = this.date(item.createdUtc);
        break;
    }

    return retValue;
  }

  getOrderCount(item: OrderShipOut): string {
    return this.commaNumber(item.orderShipOutDetails.map(x => x.quantity).reduce((a, b) => a + b));
  }

  icon(item: OrderShipOut, columnName: string): boolean {
    return columnName === Status;
  }

  iconName(item: OrderShipOut, columnName: string): string {
    let retValue = '';    

    if (columnName !== Status) {
      return retValue;
    }

    if (item.canceledDate) {
      retValue = OliveConstants.orderStatus.canceled;
    }
    else if (item.shipOutDate) {
      retValue = OliveConstants.orderStatus.shipped;
    }
    else {
      retValue = OliveConstants.orderStatus.pending;
    }

    return retValue;
  }

  getEditorCustomTitle(item: OrderShipOut) {
    if (item) {
      return `${item.orderFk.marketSellerFk.code} - ${item.orderFk.marketOrdererName} (${this.getOrderCount(item)})`;
    }
    else {
      return this.translater.get(NavTranslates.Sales.orderList);
    }
  }

  renderTDClass(item: OrderShipOut, column: any): string {
    let addedClass = '';

    if (column.data === Status) {
      if (item.canceledDate) {
        addedClass = OliveConstants.foregroundColor.red;
      }
      else if (item.shipOutDate) {
        addedClass = OliveConstants.foregroundColor.blue;
      }
      else {
        addedClass = OliveConstants.foregroundColor.orange;
      }
    }
    else if (column.data === ProductName && item.orderFk.itemsChanged) {
      addedClass = OliveConstants.foregroundColor.red;
    }

    return super.renderTDClass(item, column, addedClass);
  }
}
