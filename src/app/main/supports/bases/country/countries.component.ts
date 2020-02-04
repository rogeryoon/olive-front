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

import { OliveSearchCountryComponent } from './search-country/search-country.component';
import { OliveCountryService } from '../../services/country.service';
import { Country } from '../../models/country.model';
import { OliveCountryManagerComponent } from './country-manager/country-manager.component';
import { checkIcon } from 'app/core/utils/olive-helpers';

const Id = 'id';
const Code = 'code';
const Name = 'name';
const Activated = 'activated';
const IsShipOutCountry = 'isShipOutCountry';
const CreatedUtc = 'createdUtc';

@Component({
  selector: 'olive-country',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./countries.component.scss'],
  animations: fuseAnimations
})
export class OliveCountriesComponent extends OliveEntityListComponent {
  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService, 
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    documentService: OliveDocumentService, dialog: MatDialog, 
    dataService: OliveCountryService
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
      icon: NavIcons.Basic.country,
      translateTitleId: NavTranslates.Basic.country,
      managePermission: null,
      columns: [
        { data: Code, thName: this.translator.get('common.tableHeader.code'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: Name, thName: this.translator.get('common.tableHeader.name'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        { data: Activated, thName: this.translator.get('common.tableHeader.activated'), tdClass: '', thClass: '' },
        { data: IsShipOutCountry, thName: this.translator.get('common.tableHeader.isShipOutCountry'), tdClass: '', thClass: '' },
        { data: CreatedUtc, thName: this.translator.get('common.tableHeader.createdUtc'), tdClass: '', thClass: '' }
      ],
      editComponent: OliveCountryManagerComponent,
      searchComponent: OliveSearchCountryComponent,
      itemType: Country
    };
  }

  renderItem(item: Country, columnName: string): string {

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
      case CreatedUtc:
        retValue = this.date(item.createdUtc);
        break;
    }

    return retValue;
  }

  icon(item: Country, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case Activated:
        retValue = true;
        break;

      case IsShipOutCountry:
        retValue = true;
        break;        
    }

    return retValue;
  }

  iconName(item: Country, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Activated:
        retValue = checkIcon(item.activated);
        break;

      case IsShipOutCountry:
        retValue = checkIcon(item.isShipOutCountry);
        break;        
    }

    return retValue;
  }
}
