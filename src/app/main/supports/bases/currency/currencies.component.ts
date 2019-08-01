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

import { OliveSearchCurrencyComponent } from './search-currency/search-currency.component';
import { OliveCurrencyService } from '../../services/currency.service';
import { Currency } from '../../models/currency.model';
import { OliveCurrencyManagerComponent } from './currency-manager/currency-manager.component';

const Selected  = 'selected';
const Id = 'id';
const Code = 'code';
const Name = 'name';
const Symbols = 'symbol';
const DecimalPoint = 'decimalPoint';
const Activated = 'activated';
const CreatedUtc = 'createdUtc';

@Component({
  selector: 'olive-currency',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./currencies.component.scss'],
  animations: fuseAnimations
})
export class OliveCurrenciesComponent extends OliveEntityListComponent {
  constructor(
    translator: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveCurrencyService
  ) {
      super(
        translator, deviceService,
        alertService, accountService,
        messageHelper, documentService, 
        dialog, dataService
      );
  }

  initializeChildComponent() {
    this.setting = {
      icon: NavIcons.Basic.currency,
      translateTitleId: NavTranslates.Basic.currency,
      managePermission: null,
      columns: [
        // 1
        { data: Selected },
        // 2
        { data: Code, thName: 'Code', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 3
        { data: Name, thName: 'Name', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        // 4
        { data: Symbols, thName: 'Symbol', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 5
        { data: DecimalPoint, thName: 'DecimalPoint', tdClass: 'print right', thClass: '' },
        // 6
        { data: Activated, thName: 'Activated', tdClass: '', thClass: '' },
        // 7
        { data: CreatedUtc, thName: 'CreatedUtc', tdClass: '', thClass: '' }
      ],
      editComponent: OliveCurrencyManagerComponent,
      searchComponent: OliveSearchCurrencyComponent,
      itemType: Currency
    };
  }

  renderItem(item: Currency, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Id:
        retValue = this.id36(item.id);
        break;
      case Code:
        retValue = item.code;
        break;
      case Name:
        retValue = item.name;
        break;
      case Symbols:
        retValue = item.symbol;
        break;
      case DecimalPoint:
        retValue = item.decimalPoint.toString();
        break;
      case CreatedUtc:
        retValue = this.date(item.createdUtc);
        break;
    }

    return retValue;
  }

  icon(item: Currency, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case Activated:
        retValue = true;
        break;        
    }

    return retValue;
  }

  iconName(item: Currency, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Activated:
        retValue = OliveUtilities.iconName(item.activated);
        break;
    }

    return retValue;
  }
}
