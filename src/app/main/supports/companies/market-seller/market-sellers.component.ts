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

import { OliveSearchMarketSellerComponent } from './search-market-seller/search-market-seller.component';
import { OliveMarketSellerService } from '../../services/market-seller.service';
import { MarketSeller } from '../../models/market-seller.model';
import { OliveMarketSellerManagerComponent } from './market-seller-manager/market-seller-manager.component';

const Selected  = 'selected';
const Code = 'code';
const Name = 'name';
const Activated = 'activated';
const CreatedUtc = 'createdUtc';

@Component({
  selector: 'olive-market-seller',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./market-sellers.component.scss'],
  animations: fuseAnimations
})
export class OliveMarketSellersComponent extends OliveEntityListComponent {
  constructor(
    translater: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveMarketSellerService
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
      icon: NavIcons.Company.marketSeller,
      translateTitleId: NavTranslates.Company.marketSeller,
      managePermission: null,
      columns: [
        { data: Selected },
        { data: Code, thName: this.translater.get('common.tableHeader.code'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: Name, thName: this.translater.get('common.tableHeader.name'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        { data: Activated, thName: this.translater.get('common.tableHeader.activated'), tdClass: '', thClass: '' },
        { data: CreatedUtc, thName: this.translater.get('common.tableHeader.createdUtc'), tdClass: '', thClass: '' }
      ],
      editComponent: OliveMarketSellerManagerComponent,
      searchComponent: OliveSearchMarketSellerComponent,
      itemType: MarketSeller
    };
  }

  renderItem(item: MarketSeller, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Code:
        retValue = item.code;
        break;
      case Name:
        retValue = item.name;
        break;
      case CreatedUtc:
        retValue = this.date(item.createdUtc);
        break;
    }

    return retValue;
  }

  icon(item: MarketSeller, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case Activated:
        retValue = true;
        break;        
    }

    return retValue;
  }

  iconName(item: MarketSeller, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Activated:
        retValue = OliveUtilities.iconName(item.activated);
        break;
    }

    return retValue;
  }
}
