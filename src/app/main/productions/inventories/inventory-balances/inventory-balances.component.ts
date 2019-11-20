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
import { OliveInventoryService } from '../../services/inventory.service';
import { InventoryBalance } from '../../models/inventory-balance';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveConstants } from 'app/core/classes/constants';

const Selected = 'selected';
const Id = 'id';
const ProductName = 'productName';
const VariantName = 'variantName';
const TotalQuantity = 'totalQuantity';
const InTransitQuantity = 'inTransitQuantity';
const StandPrice = 'standPrice';
const PriceDue = 'priceDue';

@Component({
  selector: 'olive-inventory-balances',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./inventory-balances.component.scss'],
  animations: fuseAnimations
})
export class OliveInventoryBalancesComponent extends OliveEntityListComponent {
  warehouseColumns: any[] = [];

  constructor(
    translator: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveInventoryService,
    private cacheService: OliveCacheService
  ) {
    super(
      translator, deviceService,
      alertService, accountService,
      messageHelper, documentService,
      dialog, dataService
    );

    this.standCurrency = this.cacheService.standCurrency;    
  }

  initializeChildComponent() {
    this.initializeSetting();
  }

  initializeSetting() {
    this.setting = {
      icon: NavIcons.Product.inventoriesBalance,
      translateTitleId: NavTranslates.Product.inventoriesBalance,
      columns: [
        // 1
        { data: Selected },
        // 2
        { data: Id, thName: this.translator.get('common.word.id'), tdClass: 'print -ex-type-id', thClass: 'print -ex-type-id' },
        // 3
        { data: ProductName, orderable: false, thName: this.translator.get('common.word.productName'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        // 4
        { data: VariantName, orderable: false, thName: this.translator.get('common.word.productType'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 5
        { data: TotalQuantity, thName: this.translator.get('common.word.quantity'), tdClass: 'print -ex-type-number', thClass: 'print' },
        // 6
        { data: InTransitQuantity, thName: this.translator.get('production.inventoryBalances.inTransitQuantity'), tdClass: 'print -ex-type-number', thClass: 'print' },
        // 7
        { data: StandPrice, thName: this.translator.get('common.word.price'), tdClass: 'print right -ex-type-number', thClass: 'print' },
        // 8
        { data: PriceDue, thName: this.translator.get('common.word.dueAmount'), tdClass: 'print right -ex-type-number', thClass: 'print' }
      ],
      itemType: InventoryBalance,
      footerColumns: [
        // 1
        { value: '', colSpan: 3 },
        // 2
        { value: this.translator.get('common.tableHeader.dueAmount'), style: OliveConstants.style.footerCell },
        // 3
        { id: TotalQuantity, style: OliveConstants.style.footerCell },
        // 4
        { id: InTransitQuantity, style: OliveConstants.style.footerCell },
        // 5
        { id: StandPrice, style: OliveConstants.style.footerCell },
        // 6
        { id: PriceDue, style: OliveConstants.style.footerCell }
      ],
      disabledContextMenus: [ OliveConstants.contextMenu.newItem, OliveConstants.contextMenu.upload ]
    };    
  }

  addColumns() {
    if (this.warehouseColumns.length) {
      
    }
  }

  loadItems(dataTablesParameters: any, callback) {
    this.itemsLoader((this.dataService as OliveInventoryService).getInventoryBalance(dataTablesParameters), callback);
  }

  renderItem(item: InventoryBalance, columnName: string): string {

    let retValue = '';
    const isSingleItem = item.productName === '' && item.variantName.length > 0;
    switch (columnName) {
      case Id:
        retValue = this.id36(item.id);
        break;
      case ProductName:
        retValue = isSingleItem ? item.variantName : item.productName;
        break;
      case VariantName:
        retValue = isSingleItem ? '' : item.variantName;
        break;        
      case TotalQuantity:
        retValue = this.commaNumber(item.totalQuantity);
        break;
      case InTransitQuantity:
        retValue = this.commaNumber(item.inTransitQuantity);
        break;
      case StandPrice:
        retValue = this.numberFormat(item.standPrice, this.standCurrency.decimalPoint);
        break;
      case PriceDue:
        retValue = this.numberFormat(item.priceDue, this.standCurrency.decimalPoint);
        break;
    }

    return retValue;
  }

  renderFooterItem(column: any): string { 
    if (!this.items) { return null; }

    const items = this.items as InventoryBalance[];

    let retValue = '';
    let value = 0;
    switch (column.id) {
      case TotalQuantity:
        items.forEach(item => {
          value += isNaN(item.totalQuantity) ? 0 : item.totalQuantity;
        });      
        retValue = this.commaNumber(value);
        break;
      case InTransitQuantity:
        items.forEach(item => {
          value += isNaN(item.inTransitQuantity) ? 0 : item.inTransitQuantity;
        });      
        retValue = this.commaNumber(value);
        break;
      case StandPrice:
        items.forEach(item => {
          value += isNaN(item.standPrice) ? 0 : item.standPrice;
        });      
        retValue = this.numberFormat(value, this.standCurrency.decimalPoint);      
        break;
      case PriceDue:
        items.forEach(item => {
          value += isNaN(item.priceDue) ? 0 : item.priceDue;
        });      
        retValue = this.numberFormat(value, this.standCurrency.decimalPoint);
        break;
    }

    return retValue;
  }
}
