import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';

import { String } from 'typescript-string-operations';

import { DeviceDetectorService } from 'ngx-device-detector';

import { DataTableDirective } from 'angular-datatables';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';
import { Permission } from '@quick/models/permission.model';

import { InventoryWarehouse } from '../models/inventory-warehouse';
import { OliveInventoryService } from '../services/inventory.service';
import { OliveDocumentService } from '../../../../core/services/document.service';
import { OliveMessageHelperService } from '../../../../core/services/message-helper.service';
import { locale as english } from '../../../../core/i18n/en';
import { OliveCacheService } from '../../../../core/services/cache.service';
import { OliveProductService } from '../../products/services/product.service';
import { InventoryWarehouseUnit } from '../models/inventory-warehouse-unit';

@Component({
  selector: 'olive-inventory-warehouse',
  templateUrl: './inventory-warehouse.component.html',
  styleUrls: ['./inventory-warehouse.component.scss'],
  animations: fuseAnimations
})
export class OliveInventoryWarehouseComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  sourceInventory: InventoryWarehouse;
  editingInventoryName: { name: string };
  loadingIndicator: boolean;

  inventories: InventoryWarehouse[] = [];
  selectedAll: any;
  savedFilterValue = '';
  warehouseMap: any;

  inventoryTableId = 'inventories-table';
  constructor(
    private translater: FuseTranslationLoaderService,
    private deviceService: DeviceDetectorService,
    private alertService: AlertService,
    private accountService: AccountService,
    private messageHelper: OliveMessageHelperService,
    private inventoryService: OliveInventoryService,
    private productService: OliveProductService,
    private dictionaryService: OliveCacheService,
    private documentService: OliveDocumentService,
    private dialog: MatDialog
  ) {
    this.translater.loadTranslations(english);
  }

  get canManageInventories(): boolean {
    return this.accountService.userHasPermission(Permission.manageInventoriesPermission);
  }

  onSearch(event: any): void {
    if (
      this.savedFilterValue !== event.target.value &&
      (
        (this.deviceService.isDesktop() && event.key === 'Enter') ||
        this.deviceService.isMobile() ||
        event.type === 'blur'
      )
    ) {
      const table = $('#inventories-table').DataTable();
      table.search(event.target.value).draw();
      this.savedFilterValue = event.target.value;
    }
  }

  ngOnInit() {
    this.setWarehouseListCache();

    this.dtOptions = {
      pagingType: 'full_numbers',
      serverSide: true,
      processing: true,
      scrollX: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        dataTablesParameters['extsearch'] = [{ name: 'date', value: '2018-09-06' }];

        this.inventoryService.getInventoryWarehouse(dataTablesParameters)
          .subscribe(response => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;

            this.inventories = response.model;

            callback({
              recordsTotal: response.itemsCount,
              recordsFiltered: response.itemsCount,
              data: []
            });
          },
            error => {
              this.alertService.stopLoadingMessage();
              this.loadingIndicator = false;

              this.messageHelper.showLoadFaild(error);
            });
      },
      columns: [
        { data: 'selected' },
        { data: 'productId' },
        { data: 'productName' },
        { data: 'variantName' },
        { data: 'stockQtyDue' },
        { data: 'inventories' }
      ],
      dom: 'ltip',
      columnDefs: [
        { targets: 'nosort', orderable: false }
      ],
      order: [[1, 'desc']]
    };

    $(document).ready(function () {
      $('.olive-datatable').css('width', '100%');
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  private warehouseSummary(warehouseInventories: InventoryWarehouseUnit[]): string {
    const strArry = [];
    warehouseInventories.forEach(warehouse => {
      strArry.push(String.Format('{0}:({1})', this.warehouseMap.get(warehouse.warehouseId).code, warehouse.stockQty));
    });

    return strArry.join(' ');
  }

  private setWarehouseListCache() {
    const dictionaryKey = 'warehouse';

    if (!this.dictionaryService.exist(dictionaryKey)) {
      // this.productService.getCacheValues(dictionaryKey).subscribe(
      //   response => {
      //     this.warehouseMap = new Map(response.model.map(i => [i.id, i]));
      //     this.dictionaryService.set(dictionaryKey, this.warehouseMap);
      //   },
      //   error => {
      //     this.messageHelper.showLoadFaild(error);
      //   }
      // );
    }
    else {
      this.warehouseMap = this.dictionaryService.get(dictionaryKey);
    }
  }

  openDialog() {
    // const dialogRef = this.dialog.open(
    // OliveEditProductDialogComponent,
    // {
    //   disableClose: true,
    //   panelClass: 'mat-dialog-md',
    //   data: { product: this.sourceProduct }
    // });

    // dialogRef.afterClosed().subscribe(item => {
    //   if (item && this.canManageInventories) {
    //     if ( typeof item === 'object' ) {
    //       this.updateProduct(item);  
    //     }
    //     else {
    //       this.products = this.products.filter(p => p.id !== item);
    //     }
    //   }
    // });
  }

  selectAll() {
    for (let i = 0; i < this.inventories.length; i++) {
      this.inventories[i].selected = this.selectedAll;
    }
  }

  checkIfAllSelected() {
    this.selectedAll = this.inventories.every(function (item: any) {
      return item.selected === true;
    });
  }

  onExcel() {
    this.documentService.exportExcel(this.translater.get('navi.product.inventoriesBalance'), this.inventoryTableId);
  }

  onPrint() {
    this.documentService.printTable(this.translater.get('navi.product.inventoriesBalance'), this.inventoryTableId);
  }
}
