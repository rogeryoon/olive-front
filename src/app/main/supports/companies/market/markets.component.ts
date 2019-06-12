﻿import { Component } from '@angular/core';
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
import { OliveUtilities } from 'app/core/classes/utilities';

import { OliveSearchMarketComponent } from './search-market/search-market.component';
import { OliveMarketService } from '../../services/market.service';
import { Market } from '../../models/market.model';
import { OliveMarketManagerComponent } from './market-manager/market-manager.component';

const Selected  = 'selected';
const Code = 'code';
const Name = 'name';
const WebSite = 'webSite';
const Activated = 'activated';
const CreatedUtc = 'createdUtc';

@Component({
  selector: 'olive-market',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./markets.component.scss'],
  animations: fuseAnimations
})
export class OliveMarketsComponent extends OliveEntityListComponent {
  constructor(
    translater: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveMarketService
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
      icon: NavIcons.Company.market,
      translateTitleId: NavTranslates.Company.market,
      managePermission: null,
      columns: [
        { data: Selected },
        { data: Code, thName: this.translater.get('common.tableHeader.code'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: Name, thName: this.translater.get('common.tableHeader.name'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        { data: WebSite, thName: this.translater.get('common.tableHeader.webSite'), 
          tdClass: 'print left -ex-type-text link', thClass: 'print -ex-type-text' }, 
        { data: Activated, thName: this.translater.get('common.tableHeader.activated'), 
          tdClass: '', thClass: '' },
        { data: CreatedUtc, thName: this.translater.get('common.tableHeader.createdUtc'), 
          tdClass: '', thClass: '' }
      ],
      editComponent: OliveMarketManagerComponent,
      searchComponent: OliveSearchMarketComponent,
      itemType: Market
    };
  }

  renderItem(item: Market, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Code:
        retValue = item.code;
        break;
      case Name:
        retValue = item.name;
        break;
      case WebSite:
        retValue = item.webSite;
        break;
      case CreatedUtc:
        retValue = this.date(item.createdUtc);
        break;
    }

    return retValue;
  }

  icon(item: Market, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case Activated:
        retValue = true;
        break;        
    }

    return retValue;
  }

  iconName(item: Market, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Activated:
        retValue = OliveUtilities.iconName(item.activated);
        break;
    }

    return retValue;
  }

  onTdClick(event: any, item: Market, columnName: string): boolean {
    let retValue = false;

    switch (columnName) {
      case WebSite:
        const url = OliveUtilities.webSiteUrl(item.webSite);
        if (url) {
          this.setTdId(item.id, columnName);
          retValue = true;
          window.open(url, '_blank');
        }
        break;
    }

    return retValue;
  }
}
