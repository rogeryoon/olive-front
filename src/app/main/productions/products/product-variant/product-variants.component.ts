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

import { OliveSearchProductVariantComponent } from './search-product-variant/search-product-variant.component';
import { OliveProductVariantService } from '../services/product-variant.service';
import { ProductVariant } from '../models/product-variant.model';
import { OliveProductVariantManagerComponent } from './product-variant-manager/product-variant-manager.component';

const Selected  = 'selected';
const Id = 'id';
const Code = 'code';
const Name = 'name';
const GroupName = 'productFk.Name';
const StandPrice = 'standPrice';
const CreatedUtc = 'createdUtc';

@Component({
  selector: 'olive-product-variant',
  templateUrl: '../../../../core/components/entity-list/entity-list.component.html',
  styleUrls: ['./product-variants.component.scss'],
  animations: fuseAnimations
})
export class OliveProductVariantsComponent extends OliveEntityListComponent {
  constructor(
    translater: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveProductVariantService
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
      name: 'ProductVariant',
      icon: NavIcons.Product.ProductVariant,
      translateTitleId: NavTranslates.Product.ProductVariant,
      managePermission: null,
      columns: [
        { data: Selected },
        { data: Id, thName: 'Id', tdClass: 'print -ex-type-id', thClass: 'print -ex-type-id' },
        { data: Code, thName: 'Code', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: GroupName, thName: 'Name', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        { data: Name, thName: 'Type', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        { data: StandPrice, thName: 'StandPrice', tdClass: 'print right -ex-type-money', thClass: 'print -ex-type-money' },
        { data: CreatedUtc, thName: 'CreatedUtc', tdClass: '', thClass: '' }
      ],
      editComponent: OliveProductVariantManagerComponent,
      searchComponent: OliveSearchProductVariantComponent,
      itemType: ProductVariant
    };
  }

  renderItem(item: ProductVariant, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Id:
        retValue = OliveUtilities.convertToBase36(item.id);
        break;
      case Code:
        retValue = item.code;
        break;
      case GroupName:
        retValue = item.productFk.name;
        break;
      case Name:
        retValue = item.name;
        break;
      case StandPrice:
        retValue = item.standPrice ? item.standPrice.toString() : '';
        break;
      case CreatedUtc:
        retValue = OliveUtilities.getShortDate(item.createdUtc);
        break;
    }

    return retValue;
  }
}
