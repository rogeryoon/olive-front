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

import { OliveSearchCompanyComponent } from './search-company/search-company.component';
import { OliveCompanyService } from '../services/company.service';
import { Company } from '../models/company.model';
import { OliveCompanyManagerComponent } from './company-manager/company-manager.component';

const Selected = 'selected';
const Id = 'id';
const Code = 'code';
const Name = 'name';
const Memo = 'memo';
const Activated = 'activated';
const CreateUtc = 'createdUtc';

@Component({
  selector: 'olive-company',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./companies.component.scss'],
  animations: fuseAnimations
})
export class OliveCompaniesComponent extends OliveEntityListComponent {
  constructor(
    translater: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveCompanyService
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
      name: 'Company',
      icon: NavIcons.Company.list,
      translateTitleId: NavTranslates.Company.list,
      managePermission: Permission.assignCompanyGroups,
      columns: [
        // 1
        { data: Selected },
        // 2
        { data: Code, thName: 'Code', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 3
        { data: Name, thName: 'Name', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        // 4
        { data: Memo, thName: 'Memo', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 5
        { data: Activated, thName: 'Activated', tdClass: '', thClass: '' },
        // 6
        { data: CreateUtc, thName: 'Date', thClass: 'print -ex-type-text' }
      ],
      editComponent: OliveCompanyManagerComponent,
      searchComponent: OliveSearchCompanyComponent,
      itemType: Company
    };
  }

  renderItem(item: Company, columnName: string): string {

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

      case Memo:
        retValue = item.memo;
        break;

      case CreateUtc:
        retValue = this.date(item.createdUtc);
        break;
    }

    return retValue;
  }

  icon(item: Company, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case Activated:
        retValue = true;
        break;
    }

    return retValue;
  }

  iconName(item: Company, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Activated:
        retValue = OliveUtilities.iconName(item.activated);
        break;
    }

    return retValue;
  }
}
