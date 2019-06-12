import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';

import { DeviceDetectorService } from 'ngx-device-detector';

import { DataTableDirective } from 'angular-datatables';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService, DialogType } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';
import { Permission } from '@quick/models/permission.model';

import { InventoryBalance } from '../../models/inventory-balance';
import { OliveInventoryService } from '../../services/inventory.service';
import { OliveDocumentService } from '../../../../core/services/document.service';
import { OliveMessageHelperService } from '../../../../core/services/message-helper.service';

@Component({
  selector: 'olive-inventory-balance-save',
  templateUrl: './inventory-balance-save.component.html',
  styleUrls: ['./inventory-balance-save.component.scss'],
  animations: fuseAnimations
})
export class OliveInventoryBalanceSaveComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  sourceInventory: InventoryBalance;
  editingInventoryName: { name: string };
  loadingIndicator: boolean;

  inventories: InventoryBalance[] = [];
  selectedAll: any;
  savedFilterValue = '';

  inventoryTableId = 'inventories-table';
  constructor(
    private translater: FuseTranslationLoaderService,
    private deviceService: DeviceDetectorService,
    private alertService: AlertService,
    private accountService: AccountService,
    private messageHelper: OliveMessageHelperService,
    private inventoryService: OliveInventoryService,
    private documentService: OliveDocumentService,
    private dialog: MatDialog
  ) {
  }

  get canManageInventories() {
    return this.accountService.userHasPermission(Permission.manageInventoriesPermission);
  }

  onSearch(event: any) {
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
    this.dtOptions = {
      pagingType: 'full_numbers',
      serverSide: true,
      processing: true,
      scrollX: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        dataTablesParameters['extsearch'] = [{name: 'date', value: '2018-09-06'}];

        this.inventoryService.getInventoryBalance(dataTablesParameters)
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

              this.messageHelper.showLoadFaildSticky(error);
            });
      },
      columns: [
        { data: 'selected' },
        { data: 'Id' },
        { data: 'productName' },
        { data: 'variantName' },
        { data: 'totalQuantity' },
        { data: 'inTransitQuantity' },
        { data: 'standPrice' },
        { data: 'priceDue' }
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
