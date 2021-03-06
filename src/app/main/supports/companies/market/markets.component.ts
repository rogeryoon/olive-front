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

import { OliveSearchMarketComponent } from './search-market/search-market.component';
import { OliveMarketService } from '../../services/market.service';
import { Market } from '../../models/market.model';
import { OliveMarketManagerComponent } from './market-manager/market-manager.component';
import { checkIcon, hasTextSelection } from 'app/core/utils/olive-helpers';
import { webSiteUrl } from 'app/core/utils/string-helper';

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
    translator: FuseTranslationLoaderService, alertService: AlertService, 
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    documentService: OliveDocumentService, dialog: MatDialog, 
    dataService: OliveMarketService
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
      icon: NavIcons.Company.market,
      translateTitleId: NavTranslates.Company.market,
      managePermission: null,
      columns: [
        { data: Code, thName: this.translator.get('common.tableHeader.code'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: Name, thName: this.translator.get('common.tableHeader.name'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        { data: WebSite, thName: this.translator.get('common.tableHeader.webSite'), 
          tdClass: 'print left -ex-type-text link', thClass: 'print -ex-type-text' }, 
        { data: Activated, thName: this.translator.get('common.tableHeader.activated'), 
          tdClass: '', thClass: '' },
        { data: CreatedUtc, thName: this.translator.get('common.tableHeader.createdUtc'), 
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
        retValue = checkIcon(item.activated);
        break;
    }

    return retValue;
  }

  onTdClick(event: any, item: Market, columnName: string) {
    if (hasTextSelection()) {
      return;
    }

    switch (columnName) {
      case WebSite:
        const url = webSiteUrl(item.webSite);
        if (url) {
          this.setTdId(item.id, columnName);
          window.open(url, '_blank');
        }
        break;
    }
  }
}
