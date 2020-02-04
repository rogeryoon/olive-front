import { Component } from '@angular/core';
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

import { OliveSearchCurrencyComponent } from './search-currency/search-currency.component';
import { OliveCurrencyService } from '../../services/currency.service';
import { Currency } from '../../models/currency.model';
import { OliveCurrencyManagerComponent } from './currency-manager/currency-manager.component';
import { checkIcon } from 'app/core/utils/olive-helpers';

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
    translator: FuseTranslationLoaderService, alertService: AlertService, 
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    documentService: OliveDocumentService, dialog: MatDialog, 
    dataService: OliveCurrencyService
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
      icon: NavIcons.Basic.currency,
      translateTitleId: NavTranslates.Basic.currency,
      managePermission: null,
      columns: [
        // 2
        { data: Code, thName: this.translator.get('common.tableHeader.code'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 3
        { data: Name, thName: this.translator.get('common.tableHeader.name'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        // 4
        { data: Symbols, thName: this.translator.get('common.tableHeader.symbol'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 5
        { data: DecimalPoint, thName: this.translator.get('common.tableHeader.decimalPoint'), tdClass: 'print right', thClass: '' },
        // 6
        { data: Activated, thName: this.translator.get('common.tableHeader.activated'), tdClass: '', thClass: '' },
        // 7
        { data: CreatedUtc, thName: this.translator.get('common.tableHeader.createdUtc'), tdClass: '', thClass: '' }
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
        retValue = checkIcon(item.activated);
        break;
    }

    return retValue;
  }
}
