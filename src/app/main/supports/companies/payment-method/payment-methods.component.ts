﻿import { Component } from '@angular/core';
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

import { OliveSearchPaymentMethodComponent } from './search-payment-method/search-payment-method.component';
import { OlivePaymentMethodService } from '../services/payment-method.service';
import { PaymentMethod } from '../models/payment-method.model';
import { OlivePaymentMethodManagerComponent } from './payment-method-manager/payment-method-manager.component';

const Selected  = 'selected';
const Id = 'id';
const Code = 'code';
const Name = 'name';
const Memo = 'memo';
const Activated = 'activated';
const CreatedUtc = 'createdUtc';

@Component({
  selector: 'olive-payment-method',
  templateUrl: '../../../../core/components/entity-list/entity-list.component.html',
  styleUrls: ['./payment-methods.component.scss'],
  animations: fuseAnimations
})
export class OlivePaymentMethodsComponent extends OliveEntityListComponent {
  constructor(
    translater: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OlivePaymentMethodService
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
      name: 'PaymentMethod',
      icon: NavIcons.Purchase.PaymentMethod,
      translateTitleId: NavTranslates.Purchase.PaymentMethod,
      managePermission: null,
      columns: [
        { data: Selected },
        { data: Code, thName: 'Code', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: Name, thName: 'Name', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        { data: Memo, thName: 'Memo', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: Activated, thName: 'Activated', tdClass: '', thClass: '' },
        { data: CreatedUtc, thName: 'CreatedUtc', tdClass: '', thClass: '' }
      ],
      editComponent: OlivePaymentMethodManagerComponent,
      searchComponent: OliveSearchPaymentMethodComponent,
      itemType: PaymentMethod
    };
  }

  renderItem(item: PaymentMethod, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Id:
        retValue = OliveUtilities.convertToBase36(item.id);
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
      case CreatedUtc:
        retValue = OliveUtilities.getShortDate(item.createdUtc);
        break;
    }

    return retValue;
  }

  icon(item: PaymentMethod, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case Activated:
        retValue = true;
        break;        
    }

    return retValue;
  }

  iconName(item: PaymentMethod, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Activated:
        retValue = OliveUtilities.iconName(item.activated);
        break;
    }

    return retValue;
  }
}
