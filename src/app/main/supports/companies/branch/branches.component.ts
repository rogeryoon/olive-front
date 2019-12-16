import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

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

import { OliveSearchBranchComponent } from './search-branch/search-branch.component';
import { OliveBranchService } from '../../services/branch.service';
import { Branch } from '../../models/branch.model';
import { OliveBranchManagerComponent } from './branch-manager/branch-manager.component';
import { checkIcon } from 'app/core/utils/helpers';

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
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./branches.component.scss'],
  animations: fuseAnimations
})
export class OliveBranchesComponent extends OliveEntityListComponent {
  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService, 
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    documentService: OliveDocumentService, dialog: MatDialog, 
    dataService: OliveBranchService
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
      icon: NavIcons.Company.branch,
      translateTitleId: NavTranslates.Company.branch,
      managePermission: Permission.assignCompanyGroups,
      columns: [
        { data: Selected },
        { data: Code, thName: this.translator.get('common.tableHeader.code'),  tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: Name, thName: this.translator.get('common.tableHeader.name'),  tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        { data: Outsourcing, thName: this.translator.get('common.tableHeader.outsourcing'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: Private, thName: this.translator.get('common.tableHeader.private'), tdClass: 'print -ex-type-text', thClass: 'print -ex-type-text' },
        { data: Activated, thName: this.translator.get('common.tableHeader.activated'), tdClass: 'print -ex-type-text', thClass: 'print -ex-type-text' },
        { data: CreatedUtc, thName: this.translator.get('common.tableHeader.createdUtc'), thClass: 'print -ex-type-text' }
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
        retValue = checkIcon(item.outsourcing);
        break;
      case Private:
        retValue = checkIcon(item.private);
        break;
      case Activated:
        retValue = checkIcon(item.activated);
        break;
    }

    return retValue;
  }
}
