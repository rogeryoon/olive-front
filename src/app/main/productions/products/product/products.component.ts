import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DeviceDetectorService } from 'ngx-device-detector';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { NavIcons } from 'app/core/navigations/nav-icons';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveEntityListComponent } from 'app/core/components/entity-list/entity-list.component';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveDocumentService } from 'app/core/services/document.service';
import { OliveUtilities } from 'app/core/classes/utilities';

import { OliveSearchProductComponent } from './search-product/search-product.component';
import { OliveProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { OliveProductManagerComponent } from './product-manager/product-manager.component';

const Selected = 'selected';
const Id = 'id';
const Name = 'name';
const Activated = 'activated';
const MinPrice = 'minPrice';
const MaxPrice = 'maxPrice';
const VariantCount = 'variantCount';
const CreatedUtc = 'createdUtc';

@Component({
  selector: 'olive-product',
  templateUrl: '../../../../core/components/entity-list/entity-list.component.html',
  styleUrls: ['./products.component.scss'],
  animations: fuseAnimations
})
export class OliveProductsComponent extends OliveEntityListComponent {
  constructor(
    translater: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveProductService
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
      name: 'Product',
      icon: NavIcons.Product.ProductGroup,
      translateTitleId: NavTranslates.Product.ProductGroup,
      managePermission: null,
      columns: [
        // 1
        { data: Selected },
        // 2
        { data: Id, thName: 'Id', tdClass: 'print -ex-type-id', thClass: 'print -ex-type-id' },
        // 3
        { data: Name, thName: 'Name', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        // 4
        { data: MinPrice, thName: 'Min', tdClass: 'print right -ex-type-money', thClass: 'print -ex-type-money' },
        // 5
        { data: MaxPrice, thName: 'Max', tdClass: 'print right -ex-type-money', thClass: 'print -ex-type-money' },
        // 6
        { data: VariantCount, thName: 'Types', tdClass: '', thClass: '' },
        // 7
        { data: Activated, thName: 'Activated', tdClass: '', thClass: '' },
        // 8
        { data: CreatedUtc, thName: 'CreatedUtc', tdClass: '', thClass: '' }
      ],
      editComponent: OliveProductManagerComponent,
      searchComponent: OliveSearchProductComponent,
      itemType: Product,
      loadDetail: true
    };
  }

  renderItem(item: Product, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Id:
        retValue = this.id36(item.id);
        break;
      case Name:
        retValue = item.name;
        break;
      case MinPrice:
        retValue = item.variants ? OliveUtilities.minNumber(item.variants.map(x => x.standPrice)) : '';
        break;
      case MaxPrice:
        retValue = item.variants ? OliveUtilities.maxNumber(item.variants.map(x => x.standPrice)) : '';
        break;
      case VariantCount:
        retValue = item.variants ? item.variants.length.toString() : '';
        break;
      case CreatedUtc:
        retValue = this.date(item.createdUtc);
        break;
    }

    return retValue;
  }

  icon(item: Product, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case Activated:
        retValue = true;
        break;
    }

    return retValue;
  }

  iconName(item: Product, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Activated:
        retValue = OliveUtilities.iconName(item.activated);
        break;
    }

    return retValue;
  }
}
