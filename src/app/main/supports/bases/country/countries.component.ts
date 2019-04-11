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

import { OliveSearchCountryComponent } from './search-country/search-country.component';
import { OliveCountryService } from '../services/country.service';
import { Country } from '../models/country.model';
import { OliveCountryManagerComponent } from './country-manager/country-manager.component';

const Selected  = 'selected';
const Id = 'id';
const Code = 'code';
const Name = 'name';
const CreatedUtc = 'createdUtc';

@Component({
  selector: 'olive-country',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./countries.component.scss'],
  animations: fuseAnimations
})
export class OliveCountriesComponent extends OliveEntityListComponent {
  constructor(
    translater: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveCountryService
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
      name: 'Country',
      icon: NavIcons.Basic.country,
      translateTitleId: NavTranslates.Basic.country,
      managePermission: null,
      columns: [
        { data: Selected },
        { data: Code, thName: 'Code', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: Name, thName: 'Name', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        { data: CreatedUtc, thName: 'CreatedUtc', tdClass: '', thClass: '' }
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
}
