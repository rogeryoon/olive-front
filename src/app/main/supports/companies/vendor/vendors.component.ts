﻿import { Component } from '@angular/core';
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

import { OliveSearchVendorComponent } from './search-vendor/search-vendor.component';
import { OliveVendorService } from '../services/vendor.service';
import { Vendor } from '../models/vendor.model';
import { OliveVendorManagerComponent } from './vendor-manager/vendor-manager.component';

const Selected = 'selected';
const Id = 'id';
const Code = 'code';
const Name = 'name';
const WebSite = 'webSite';
const Activated = 'activated';
const CreatedUtc = 'createdUtc';

@Component({
  selector: 'olive-vendor',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./vendors.component.scss'],
  animations: fuseAnimations
})
export class OliveVendorsComponent extends OliveEntityListComponent {
  constructor(
    translater: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveVendorService
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
      name: 'Vendor',
      icon: NavIcons.Company.vendor,
      translateTitleId: NavTranslates.Company.vendor,
      managePermission: null,
      columns: [
        { data: Selected },
        { data: Code, thName: 'Code', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: Name, thName: 'Name', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        { data: WebSite, thName: 'WebSite', tdClass: 'print left -ex-type-text link', thClass: 'print -ex-type-text' }, 
        { data: Activated, thName: 'Activated', tdClass: '', thClass: '' },
        { data: CreatedUtc, thName: 'CreatedUtc', tdClass: '', thClass: '' }
      ],
      editComponent: OliveVendorManagerComponent,
      searchComponent: OliveSearchVendorComponent,
      itemType: Vendor
    };
  }

  renderItem(item: Vendor, columnName: string): string {

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
      case WebSite:
        retValue = OliveUtilities.webSiteHostName(item.webSite);
        break;
      case CreatedUtc:
        retValue = this.date(item.createdUtc);
        break;
    }

    return retValue;
  }

  icon(item: Vendor, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case Activated:
        retValue = true;
        break;
    }

    return retValue;
  }

  iconName(item: Vendor, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Activated:
        retValue = OliveUtilities.iconName(item.activated);
        break;
    }

    return retValue;
  }

  onTdClick(event: any, item: Vendor, columnName: string): boolean {
    let retValue = false;

    switch (columnName) {
      case WebSite:
        const url = OliveUtilities.webSiteUrl(item.webSite);
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
