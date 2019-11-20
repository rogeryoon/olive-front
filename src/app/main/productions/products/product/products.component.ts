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

import { OliveSearchProductComponent } from './search-product/search-product.component';
import { OliveProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { OliveProductManagerComponent } from './product-manager/product-manager.component';
import { checkIcon } from 'app/core/utils/helpers';
import { minNumber, maxNumber } from 'app/core/utils/number-helper';

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
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./products.component.scss'],
  animations: fuseAnimations
})
export class OliveProductsComponent extends OliveEntityListComponent {
  constructor(
    translator: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveProductService
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
      icon: NavIcons.Product.productGroup,
      translateTitleId: NavTranslates.Product.productGroup,
      managePermission: null,
      columns: [
        // 1
        { data: Selected },
        // 2
        { data: Id, thName: this.translator.get('common.tableHeader.id'), tdClass: 'print -ex-type-id', thClass: 'print -ex-type-id' },
        // 3
        { data: Name, thName: this.translator.get('common.tableHeader.name'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        // 4
        { data: MinPrice, orderable: false, thName: this.translator.get('common.tableHeader.min'), tdClass: 'print right -ex-type-number', thClass: 'print -ex-type-number' },
        // 5
        { data: MaxPrice, orderable: false, thName: this.translator.get('common.tableHeader.max'), tdClass: 'print right -ex-type-number', thClass: 'print -ex-type-number' },
        // 6
        { data: VariantCount, thName: this.translator.get('common.tableHeader.type'), tdClass: '', thClass: '' },
        // 7
        { data: Activated, thName: this.translator.get('common.tableHeader.activated'), tdClass: '', thClass: '' },
        // 8
        { data: CreatedUtc, thName: this.translator.get('common.tableHeader.createdUtc'), tdClass: '', thClass: '' }
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
        retValue = item.name === '' && item.variants.length === 1 ? item.variants[0].name : item.name;
        break;
      case MinPrice:
        retValue = item.variants ? minNumber(item.variants.filter(f => f.standPrice).map(x => x.standPrice), item.standPrice ? [item.standPrice] : []) : '';
        break;
      case MaxPrice:
        retValue = item.variants ? maxNumber(item.variants.filter(f => f.standPrice).map(x => x.standPrice), item.standPrice ? [item.standPrice] : []) : '';
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

  getEditorCustomTitle(item: any): string { 
    if (item && item.variants.length === 1) {
      return item.variants[0].name;
    }
    return super.getEditorCustomTitle(item);
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
        retValue = checkIcon(item.activated);
        break;
    }

    return retValue;
  }
}
