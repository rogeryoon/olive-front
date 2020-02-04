import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { NavIcons } from 'app/core/navigations/nav-icons';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveDocumentService } from 'app/core/services/document.service';

import { OliveSearchCarrierComponent } from './search-carrier/search-carrier.component';
import { OliveCarrierService } from '../../services/carrier.service';
import { Carrier } from '../../models/carrier.model';
import { OliveCarrierManagerComponent } from './carrier-manager/carrier-manager.component';
import { OliveEntityListComponent } from 'app/core/components/extends/entity-list/entity-list.component';
import { checkIcon, hasTextSelection } from 'app/core/utils/olive-helpers';
import { webSiteHostName, webSiteUrl } from 'app/core/utils/string-helper';

const Code = 'code';
const Name = 'name';
const WebSite = 'website';
const Activated = 'activated';
const CreatedUtc = 'createdUtc';

@Component({
  selector: 'olive-carrier',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./carriers.component.scss'],
  animations: fuseAnimations
})
export class OliveCarriersComponent extends OliveEntityListComponent {
  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService, 
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    documentService: OliveDocumentService, dialog: MatDialog, 
    dataService: OliveCarrierService
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
      icon: NavIcons.Basic.carrier,
      translateTitleId: NavTranslates.Basic.carrier,
      managePermission: null,
      columns: [
        // 2
        { data: Code, thName: this.translator.get('common.tableHeader.code'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 3
        { data: Name, thName: this.translator.get('common.tableHeader.name'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        // 4
        { data: WebSite, thName: this.translator.get('common.tableHeader.webSite'), 
          tdClass: 'print left -ex-type-text link', thClass: 'print -ex-type-text' },
        // 5
        { data: Activated, thName: this.translator.get('common.tableHeader.activated'), 
          tdClass: '', thClass: '' },
        // 6
        { data: CreatedUtc, thName: this.translator.get('common.tableHeader.createdUtc'), 
          tdClass: '', thClass: '' }
      ],
      editComponent: OliveCarrierManagerComponent,
      searchComponent: OliveSearchCarrierComponent,
      itemType: Carrier
    };
  }

  renderItem(item: Carrier, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Code:
        retValue = item.code;
        break;
      case Name:
        retValue = item.name;
        break;
      case WebSite:
        retValue = webSiteHostName(item.webSite);
        break;
      case CreatedUtc:
        retValue = this.date(item.createdUtc);
        break;
    }

    return retValue;
  }

  icon(item: Carrier, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case Activated:
        retValue = true;
        break;        
    }

    return retValue;
  }

  iconName(item: Carrier, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Activated:
        retValue = checkIcon(item.activated);
        break;
    }

    return retValue;
  }

  onTdClick(event: any, item: Carrier, columnName: string) {
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
