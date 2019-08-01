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

import { OliveSearchWarehouseComponent } from './search-warehouse/search-warehouse.component';
import { OliveWarehouseService } from '../../services/warehouse.service';
import { Warehouse } from '../../models/warehouse.model';
import { OliveWarehouseManagerComponent } from './warehouse-manager/warehouse-manager.component';

const Selected = 'selected';
const Id = 'id';
const Code = 'code';
const Name = 'name';
const Company = 'company';
const Branch = 'branch';
const Activated = 'activated';
const CreatedUtc = 'createdUtc';

@Component({
  selector: 'olive-warehouse',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./warehouses.component.scss'],
  animations: fuseAnimations
})
export class OliveWarehousesComponent extends OliveEntityListComponent {
  constructor(
    translator: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveWarehouseService
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
      icon: NavIcons.Company.warehouse,
      translateTitleId: NavTranslates.Company.warehouse,
      managePermission: null,
      columns: [
        { data: Selected },
        { data: Code, thName: 'Code', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: Name, thName: 'Name', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        { data: Company, thName: 'Company', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: Branch, thName: 'Branch', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: Activated, thName: 'Activated', tdClass: '', thClass: '' },
        { data: CreatedUtc, thName: 'CreatedUtc', tdClass: '', thClass: '' }
      ],
      editComponent: OliveWarehouseManagerComponent,
      searchComponent: OliveSearchWarehouseComponent,
      itemType: Warehouse
    };
  }

  renderItem(item: Warehouse, columnName: string): string {

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
      case Company:
        retValue = item.companyFk.name;
        break;
      case Branch:
        retValue = item.companyMasterBranchFk.name;
        break;
      case CreatedUtc:
        retValue = this.date(item.createdUtc);
        break;
    }

    return retValue;
  }

  icon(item: Warehouse, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case Activated:
        retValue = true;
        break;
    }

    return retValue;
  }

  iconName(item: Warehouse, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Activated:
        retValue = OliveUtilities.iconName(item.activated);
        break;
    }

    return retValue;
  }
}
