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
import { OliveUtilities } from 'app/core/classes/utilities';

import { OliveSearchSupplierComponent } from './search-supplier/search-supplier.component';
import { OliveSupplierService } from '../../services/supplier.service';
import { Supplier } from '../../models/supplier.model';
import { OliveSupplierManagerComponent } from './supplier-manager/supplier-manager.component';
import { checkIcon } from 'app/core/utils/helpers';
import { webSiteHostName, webSiteUrl } from 'app/core/utils/string-helper';

const Selected = 'selected';
const Code = 'code';
const Name = 'name';
const WebSite = 'webSite';
const Activated = 'activated';
const CreatedUtc = 'createdUtc';

@Component({
  selector: 'olive-suppliers',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./suppliers.component.scss'],
  animations: fuseAnimations
})
export class OliveSuppliersComponent extends OliveEntityListComponent {
  constructor(
    translator: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveSupplierService
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
      icon: NavIcons.Company.supplier,
      translateTitleId: NavTranslates.Company.supplier,
      managePermission: null,
      columns: [
        { data: Selected },
        { data: Code, thName: this.translator.get('common.tableHeader.code'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: Name, thName: this.translator.get('common.tableHeader.name'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        { data: WebSite, thName: this.translator.get('common.tableHeader.webSite'), tdClass: 'print left -ex-type-text link', thClass: 'print -ex-type-text' }, 
        { data: Activated, thName: this.translator.get('common.tableHeader.activated'), tdClass: '', thClass: '' },
        { data: CreatedUtc, thName: this.translator.get('common.tableHeader.createdUtc'), tdClass: '', thClass: '' }
      ],
      editComponent: OliveSupplierManagerComponent,
      searchComponent: OliveSearchSupplierComponent,
      itemType: Supplier
    };
  }

  renderItem(item: Supplier, columnName: string): string {

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

  icon(item: Supplier, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case Activated:
        retValue = true;
        break;
    }

    return retValue;
  }

  iconName(item: Supplier, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Activated:
        retValue = checkIcon(item.activated);
        break;
    }

    return retValue;
  }

  onTdClick(event: any, item: Supplier, columnName: string): boolean {
    let retValue = false;

    switch (columnName) {
      case WebSite:
        const url = webSiteUrl(item.webSite);
        if (url) {
          this.setTdId(item.id, columnName);
          retValue = true;
          window.open(url, '_blank');
        }
        break;
    }

    return retValue;
  }
}
