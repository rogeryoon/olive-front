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
import { OliveEntityListComponent } from 'app/core/components/extends/entity-list/entity-list.component';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveDocumentService } from 'app/core/services/document.service';
import { OliveUtilities } from 'app/core/classes/utilities';

import { OliveSearchOrderShipOutComponent } from './search-order-ship-out/search-order-ship-out.component';
import { OliveOrderShipOutService } from '../../services/order-ship-out.service';
import { OrderShipOut } from '../../models/order-ship-out.model';
import { OliveOrderShipOutManagerComponent } from './order-ship-out-manager/order-ship-out-manager.component';

const Selected  = 'selected';
const Id = 'id';
const ShipOutDate = 'shipOutDate';
const CanceledDate = 'canceledDate';
const CanceledUser = 'canceledUser';
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
        { data: Selected },
        { data: Id, thName: this.translater.get('common.tableHeader.id'), tdClass: 'print -ex-type-id', thClass: 'print -ex-type-id' },
        { data: ShipOutDate, thName: this.translater.get('common.tableHeader.shipOutDate'), tdClass: '', thClass: '' },
        { data: CanceledDate, thName: this.translater.get('common.tableHeader.canceledDate'), tdClass: '', thClass: '' },
        { data: CanceledUser, thName: this.translater.get('common.tableHeader.canceledUser'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: CreatedUtc, thName: this.translater.get('common.tableHeader.createdUtc'), tdClass: '', thClass: '' }
      ],
      editComponent: OliveOrderShipOutManagerComponent,
      searchComponent: OliveSearchOrderShipOutComponent,
      itemType: OrderShipOut
    };
  }

  renderItem(item: OrderShipOut, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Id:
        retValue = this.id36(item.id);
        break;
      case ShipOutDate:
        retValue = this.date(item.shipOutDate);
        break;
      case CanceledDate:
        retValue = this.date(item.canceledDate);
        break;
      case CanceledUser:
        retValue = item.canceledUser;
        break;
      case CreatedUtc:
        retValue = this.date(item.createdUtc);
        break;
    }

    return retValue;
  }
}
