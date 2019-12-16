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

import { OliveSearchCarrierTrackingNumberRangeComponent } from './search-carrier-tracking-number-range/search-carrier-tracking-number-range.component';
import { OliveCarrierTrackingNumberRangeManagerComponent } from './carrier-tracking-number-range-manager/carrier-tracking-number-range-manager.component';
import { OliveCarrierTrackingNumberRangeService } from '../../../shippings/services/carrier-tracking-number-range.service';
import { CarrierTrackingNumberRange } from '../../../shippings/models/carrier-tracking-number-range.model';
import { checkIcon } from 'app/core/utils/helpers';

const Selected  = 'selected';
const Id = 'id';
const Name = 'name';
const AvailNumbers = 'availNumbers';
const Carrier = 'carrier';
const Branch = 'branch';
const CompanyGroup = 'companyGroup';
const Activated = 'activated';
const CreatedUtc = 'createdUtc';

@Component({
  selector: 'olive-carrier-tracking-number-range',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./carrier-tracking-number-ranges.component.scss'],
  animations: fuseAnimations
})
export class OliveCarrierTrackingNumberRangesComponent extends OliveEntityListComponent {
  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService, 
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    documentService: OliveDocumentService, dialog: MatDialog, 
    dataService: OliveCarrierTrackingNumberRangeService
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
      icon: NavIcons.Basic.carrierTrackingNumberRange,
      translateTitleId: NavTranslates.Basic.carrierTrackingNumberRange,
      managePermission: null,
      columns: [
        { data: Selected },
        { data: Id, thName: this.translator.get('common.tableHeader.id'), tdClass: 'print -ex-type-id', thClass: 'print -ex-type-id' },
        { data: Name, thName: this.translator.get('common.tableHeader.name'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        { data: AvailNumbers, thName: this.translator.get('common.tableHeader.availTrackingNumbers'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: Carrier, thName: this.translator.get('common.tableHeader.carrier'), tdClass: 'print right', thClass: '' },
        { data: Branch, thName: this.translator.get('common.tableHeader.branch'), tdClass: 'print right', thClass: '' },
        { data: CompanyGroup, thName: this.translator.get('common.tableHeader.companyGroup'), tdClass: 'print right', thClass: '' },
        { data: Activated, thName: this.translator.get('common.tableHeader.activated'), tdClass: '', thClass: '' },
        { data: CreatedUtc, thName: this.translator.get('common.tableHeader.createdUtc'), tdClass: '', thClass: '' }
      ],
      editComponent: OliveCarrierTrackingNumberRangeManagerComponent,
      searchComponent: OliveSearchCarrierTrackingNumberRangeComponent,
      itemType: CarrierTrackingNumberRange
    };
  }

  renderItem(item: CarrierTrackingNumberRange, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Id:
        retValue = this.id36(item.id);
        break;
      case Name:
        retValue = item.name;
        break;
      case AvailNumbers:
        let lastNumber = 0;
        if (item.lastTrackingNumber) {
          lastNumber = item.lastTrackingNumber;
        }
        retValue = this.commaNumber(item.toTrackingNumber - lastNumber) ;
        break;
      case Carrier:
        retValue = item.carrierName;
        break;
      case Branch:
        retValue = item.branchCode;
        break;
      case CompanyGroup:
        retValue = item.companyGroupName;
        break;
      case CreatedUtc:
        retValue = this.date(item.createdUtc);
        break;
    }

    return retValue;
  }

  icon(item: CarrierTrackingNumberRange, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case Activated:
        retValue = true;
        break;        
    }

    return retValue;
  }

  iconName(item: CarrierTrackingNumberRange, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Activated:
        retValue = checkIcon(item.activated);
        break;
    }

    return retValue;
  }
}
