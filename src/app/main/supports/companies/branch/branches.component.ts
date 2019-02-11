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
import { OliveEntityListComponent } from 'app/core/components/entity-list/entity-list.component';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveDocumentService } from 'app/core/services/document.service';
import { OliveUtilities } from 'app/core/classes/utilities';

import { OliveSearchBranchComponent } from './search-branch/search-branch.component';
import { OliveBranchService } from '../services/branch.service';
import { Branch } from '../models/branch.model';
import { OliveBranchManagerComponent } from './branch-manager/branch-manager.component';

const Selected  = 'selected';
const Id = 'id';
const Code = 'code';
const Name = 'name';
const Outsourcing = 'outsourcing';
const Private = 'private';
const Activated = 'activated';
const PhoneNumber = 'phoneNumber';
const FaxNumber = 'faxNumber';
const Email = 'email';
const WeekdayBusinessHours = 'weekdayBusinessHours';
const WeekendBusinessHours = 'weekendBusinessHours';
const CreatedUtc = 'createdUtc';

@Component({
  selector: 'olive-branch',
  templateUrl: '../../../../core/components/entity-list/entity-list.component.html',
  styleUrls: ['./branches.component.scss'],
  animations: fuseAnimations
})
export class OliveBranchesComponent extends OliveEntityListComponent {
  constructor(
    translater: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveBranchService
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
      name: 'Branch',
      icon: NavIcons.Company.Branch,
      translateTitleId: NavTranslates.Company.Branch,
      managePermission: Permission.assignCompanyGroups,
      columns: [
        { data: Selected },
        { data: Code, thName: 'Code',  tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: Name, thName: 'Name',  tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        { data: Outsourcing, thName: '협력사', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: Private, thName: '비공개', tdClass: 'print -ex-type-text', thClass: 'print -ex-type-text' },
        { data: Activated, thName: '활동', tdClass: 'print -ex-type-text', thClass: 'print -ex-type-text' },
        { data: CreatedUtc, thName: 'Date', thClass: 'print -ex-type-text' }
      ],
      editComponent: OliveBranchManagerComponent,
      searchComponent: OliveSearchBranchComponent,
      itemType: Branch
    };
  }

  renderItem(item: Branch, columnName: string): string {

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
      case PhoneNumber:
        retValue = item.phoneNumber;
        break;
      case FaxNumber:
        retValue = item.faxNumber;
        break;
      case Email:
        retValue = item.email;
        break;
      case WeekdayBusinessHours:
        retValue = item.weekdayBusinessHours;
        break;
      case WeekendBusinessHours:
        retValue = item.weekendBusinessHours;
        break;
      case CreatedUtc:
        retValue = this.date(item.createdUtc);
        break;
    }

    return retValue;
  }

  icon(item: Branch, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case Outsourcing:
      case Private:
      case Activated:
        retValue = true;
        break;        
    }

    return retValue;
  }

  iconName(item: Branch, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Outsourcing:
        retValue = OliveUtilities.iconName(item.outsourcing);
        break;
      case Private:
        retValue = OliveUtilities.iconName(item.private);
        break;
      case Activated:
        retValue = OliveUtilities.iconName(item.activated);
        break;
    }

    return retValue;
  }
}
