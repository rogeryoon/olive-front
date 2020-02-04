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

import { OliveSearchProductVariantComponent } from './search-product-variant/search-product-variant.component';
import { OliveProductVariantService } from '../../services/product-variant.service';
import { ProductVariant } from '../../models/product-variant.model';
import { OliveProductVariantManagerComponent } from './product-variant-manager/product-variant-manager.component';

const Id = 'id';
const Code = 'code';
const Name = 'name';
const GroupName = 'productFk.Name';
const StandPrice = 'standPrice';
const CreatedUtc = 'createdUtc';

@Component({
  selector: 'olive-product-variant',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./product-variants.component.scss'],
  animations: fuseAnimations
})
export class OliveProductVariantsComponent extends OliveEntityListComponent {
  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService,
    documentService: OliveDocumentService, dialog: MatDialog,
    dataService: OliveProductVariantService
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
      icon: NavIcons.Product.productVariant,
      translateTitleId: NavTranslates.Product.productVariant,
      managePermission: null,
      columns: [
        { data: Id, thName: this.translator.get('common.tableHeader.productVariantId'), tdClass: 'print -ex-type-id', thClass: 'print -ex-type-id' },
        { data: Code, thName: this.translator.get('common.tableHeader.code'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: GroupName, thName: this.translator.get('common.tableHeader.name'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-80' },
        { data: Name, thName: this.translator.get('common.tableHeader.type'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-30' },
        { data: StandPrice, thName: this.translator.get('common.tableHeader.standPrice'), tdClass: 'print right -ex-type-number', thClass: 'print -ex-type-number' },
        { data: CreatedUtc, thName: this.translator.get('common.tableHeader.createdUtc'), tdClass: '', thClass: '' }
      ],
      editComponent: OliveProductVariantManagerComponent,
      searchComponent: OliveSearchProductVariantComponent,
      itemType: ProductVariant
    };
  }

  renderItem(item: ProductVariant, columnName: string): string {

    let retValue = '';

    const isSingleItem = item.productFk.name === '' && item.name.length > 0;
    switch (columnName) {
      case Id:
        retValue = this.id26(item.shortId);
        break;
      case Code:
        retValue = item.code;
        break;
      case GroupName:
        retValue = isSingleItem ? item.name : item.productFk.name;
        break;
      case Name:
        retValue = isSingleItem ? '' : item.name;
        break;
      case StandPrice:
        retValue = item.standPrice ? item.standPrice.toString() : '';
        break;
      case CreatedUtc:
        retValue = this.date(item.createdUtc);
        break;
    }

    return retValue;
  }
}
