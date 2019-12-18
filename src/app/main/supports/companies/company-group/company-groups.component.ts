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

import { OliveSearchCompanyGroupComponent } from './search-company-group/search-company-group.component';
import { OliveCompanyGroupService } from '../../services/company-group.service';
import { CompanyGroup } from '../../models/company-group.model';
import { OliveCompanyGroupManagerComponent } from './company-group-manager/company-group-manager.component';
import { checkIcon } from 'app/core/utils/olive-helpers';

const Selected  = 'selected';
const Id = 'id';
const Name = 'name';
const Companies = 'companies';
const Memo = 'memo';
const Activated = 'activated';
const CreateUtc = 'createdUtc';

@Component({
  selector: 'olive-company-group',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./company-groups.component.scss'],
  animations: fuseAnimations
})
export class OliveCompanyGroupsComponent extends OliveEntityListComponent {
  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService, 
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    documentService: OliveDocumentService, dialog: MatDialog, 
    dataService: OliveCompanyGroupService
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
      icon: NavIcons.Company.groupList,
      translateTitleId: NavTranslates.Company.groupList,
      managePermission: Permission.assignCompanyGroups,
      columns: [
        // 1
        { data: Selected },
        // 2
        { data: Id, thName: this.translator.get('common.tableHeader.id'), tdClass: 'print -ex-type-id', thClass: 'print -ex-type-id' },
        // 3
        { data: Name, thName: this.translator.get('common.tableHeader.name'),  tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        // 4
        { data: Companies, thName: this.translator.get('common.tableHeader.count'), tdClass: 'print right', thClass: '' },
        // 5
        { data: Memo, thName: this.translator.get('common.tableHeader.activated'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 6
        { data: Activated, thName: this.translator.get('common.tableHeader.activated'), tdClass: '', thClass: '' },
        // 7
        { data: CreateUtc, thName: this.translator.get('common.tableHeader.createdUtc'), thClass: 'print -ex-type-text' }
      ],
      editComponent: OliveCompanyGroupManagerComponent,
      searchComponent: OliveSearchCompanyGroupComponent,
      itemType: CompanyGroup
    };
  }

  renderItem(item: CompanyGroup, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Id:
        retValue = this.id36(item.id);
        break;

      case Name:
        retValue = item.name;
        break;

      case Companies:
        retValue = item.companies.length.toString();
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

  icon(item: CompanyGroup, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case Activated:
        retValue = true;
        break;        
    }

    return retValue;
  }

  iconName(item: CompanyGroup, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Activated:
        retValue = checkIcon(item.activated);
        break;
    }

    return retValue;
  }
}
