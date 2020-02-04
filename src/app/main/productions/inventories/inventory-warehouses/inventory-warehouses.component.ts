import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

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
import { OliveConstants } from 'app/core/classes/constants';
import { Warehouse } from 'app/main/supports/models/warehouse.model';
import { InventoryWarehouse } from '../../models/inventory-warehouse';

const Id = 'id';
const ProductName = 'productName';
const VariantName = 'variantName';
const TotalQuantity = 'totalQuantity';

@Component({
  selector: 'olive-inventory-warehouses',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./inventory-warehouses.component.scss'],
  animations: fuseAnimations
})
export class OliveInventoryWarehousesComponent extends OliveEntityListComponent {
  warehouses: Warehouse[] = [];

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService, 
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    documentService: OliveDocumentService, dialog: MatDialog, 
    dataService: OliveInventoryService, private route: ActivatedRoute
  ) {
    super(
      translator, alertService, 
      accountService, messageHelper, 
      documentService, dialog, 
      dataService
    );
  }

  initializeChildComponent() {
    this.warehouses = this.route.snapshot.data.warehouses;
    this.initializeSetting();
  }

  initializeSetting() {
    this.setting = {
      icon: NavIcons.Product.inventoriesWarehouse,
      translateTitleId: NavTranslates.Product.inventoriesWarehouse,
      itemType: InventoryBalance,      
      columns: this.columns,
      footerColumns: this.footerColumns,
      disabledContextMenus: [ OliveConstants.contextMenu.newItem, OliveConstants.contextMenu.upload ],
      extraSearches: [{name: 'warehouses', value: this.warehouses.map(m => m.id).join()}]
    };    
  }

  get columns() {
    const columns = [
        // 2
        { data: Id, orderable: true, thName: this.translator.get('common.tableHeader.productVariantId'), tdClass: 'print -ex-type-id', thClass: 'print -ex-type-id' },
        // 3
        { data: ProductName, orderable: false, thName: this.translator.get('common.word.productName'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        // 4
        { data: VariantName, orderable: false, thName: this.translator.get('common.word.productType'), 
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 5
        { data: TotalQuantity, thName: this.translator.get('common.word.quantity'), tdClass: 'print -ex-type-number', thClass: 'print' }
    ];

    this.warehouses.forEach(warehouse => {
      columns.push({ data: warehouse.id.toString(), orderable: false, thName: warehouse.code, tdClass: 'print -ex-type-number', thClass: 'print' });
    });

    return columns;
  }

  get footerColumns() {
    const columns = [
      // 1
      { value: '', colSpan: 3 },
      // 2
      { value: this.translator.get('common.tableHeader.dueAmount'), style: OliveConstants.style.footerCell },
      // 3
      { id: TotalQuantity, style: OliveConstants.style.footerCell }
    ];

    this.warehouses.forEach(warehouse => {
      columns.push({ id: warehouse.id.toString(), style: OliveConstants.style.footerCell });
    });    

    return columns;
  }

  renderTableClass(): string{
    return 'hover olive-datatable cell-border';
  }

  loadItems(dataTablesParameters: any, callback) {
    this.itemsLoader((this.dataService as OliveInventoryService).getInventoryWarehouse(dataTablesParameters), callback);
  }

  renderItem(item: InventoryWarehouse, columnName: string): string {

    let retValue = '';
    const isSingleItem = item.productName === '' && item.variantName.length > 0;
    switch (columnName) {
      case Id:
        retValue = this.id26(item.shortId);
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
      default:
        if (item.inventories) {
          const row = item.inventories.find(i => i.id === +columnName);
          if (row && row.value !== 0) {
            retValue = this.commaNumber(row.value);
          }
        }
        break;
    }

    return retValue;
  }

  renderFooterItem(column: any): string { 
    if (!this.items) { return null; }
    if (!column.id) { return ''; }

    const items = this.items as InventoryWarehouse[];

    let retValue = '';
    switch (column.id) {
      case TotalQuantity:
        // tslint:disable-next-line:no-shadowed-variable
        retValue = this.commaNumber(items.map(item => item.totalQuantity).reduce((total, count) => total + count));
        break;

      default:
        let total = 0;
        items.forEach(item => {
          if (item.inventories) {
            const row = item.inventories.find(i => i.id === +column.id);
            if (row) {
              total += row.value;
            }
          }
        });
        retValue = this.commaNumber(total);
        break;        
    }

    return retValue;
  }
}
