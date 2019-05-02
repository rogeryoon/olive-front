import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

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
import { OliveInventoryService } from '../services/inventory.service';
import { InventoryBalance } from '../models/inventory-balance';
import { OliveConstants } from 'app/core/classes/constants';
import { Warehouse } from 'app/main/supports/companies/models/warehouse.model';
import { InventoryWarehouse } from '../models/inventory-warehouse';
import { GridColumnStyleBuilder } from '@angular/flex-layout/grid/typings/column/column';

const Selected = 'selected';
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
    translater: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveInventoryService,
    private route: ActivatedRoute
  ) {
    super(
      translater, deviceService,
      alertService, accountService,
      messageHelper, documentService,
      dialog, dataService
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
        // 1
        { data: Selected },
        // 2
        { data: Id, orderable: true, thName: this.translater.get('common.word.id'), tdClass: 'print -ex-type-id', thClass: 'print -ex-type-id' },
        // 3
        { data: ProductName, thName: this.translater.get('common.word.productName'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        // 4
        { data: VariantName, thName: this.translater.get('common.word.productType'), tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        // 5
        { data: TotalQuantity, thName: this.translater.get('common.word.quantity'), tdClass: 'print -ex-type-number', thClass: 'print' }
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
      { value: this.translater.get('common.tableHeader.dueAmount'), style: OliveConstants.style.footerCell },
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
    this.loadHandler((this.dataService as OliveInventoryService).getInventoryWarehouse(dataTablesParameters), callback);
  }

  renderItem(item: InventoryWarehouse, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Id:
        retValue = this.id36(item.id);
        break;
      case ProductName:
        retValue = item.productName;
        break;
      case VariantName:
        retValue = item.variantName;
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
