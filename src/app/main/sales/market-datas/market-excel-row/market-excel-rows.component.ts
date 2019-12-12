import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { String } from 'typescript-string-operations';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService, DialogType } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { NavIcons } from 'app/core/navigations/nav-icons';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveEntityListComponent } from 'app/core/components/extends/entity-list/entity-list.component';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveDocumentService } from 'app/core/services/document.service';

import { OliveSearchMarketExcelRowComponent } from './search-market-excel-row/search-market-excel-row.component';
import { OliveMarketExcelRowService } from '../../services/market-excel-row.service';
import { MarketExcelRow } from '../../models/market-excel-row.model';
import { NameValue } from 'app/core/models/name-value';
import { OliveConstants } from 'app/core/classes/constants';
import { OliveMarketExcelRowManagerComponent } from './market-excel-row-manager/market-excel-row-manager.component';
import { OliveTaskCountDialogComponent } from 'app/core/components/dialogs/task-count-dialog/task-count-dialog.component';
import { OliveTaskCountSetting } from 'app/core/interfaces/dialog-setting/task-count-setting';
import { MarketExcelRowsStatus } from '../../models/market-excel-rows-status.model';
import { MarketExcel } from '../../models/market-excel.model';
import { checkIcon } from 'app/core/utils/helpers';
import { convertBase36ToNumber } from 'app/core/utils/encode-helpers';

const Selected = 'selected';
const Id = 'id';
const OrderNumber = 'orderNumber';
const Consignee = 'consignee';
const ProductName = 'productName';
const Quantity = 'quantity';
const MarketItemMappingId = 'marketItemMappingId';
const OrderId = 'orderId';

@Component({
  selector: 'olive-market-excel-row',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./market-excel-rows.component.scss'],
  animations: fuseAnimations
})
export class OliveMarketExcelRowsComponent extends OliveEntityListComponent {
  excelId: number;
  interfaceName: string;
  sub: Subscription;
  excelRowsStatus: MarketExcelRowsStatus;

  constructor(
    translator: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveMarketExcelRowService,
    private route: ActivatedRoute, private router: Router
  ) {
    super(
      translator, deviceService,
      alertService, accountService,
      messageHelper, documentService,
      dialog, dataService
    );

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;    
  }

  initializeChildComponent() {
    this.sub = this.route.params.subscribe(params => {
      this.excelId = convertBase36ToNumber(params['id']);
    });

    this.interfaceName = decodeURI(this.route.snapshot.queryParamMap.get('name'));

    this.initEntityList();

    this.notifyUserTask();
  }

  initEntityList() {
    this.setting = {
      icon: NavIcons.Sales.marketExcelRows,
      translateTitleId: NavTranslates.Sales.marketExcelRows,
      managePermission: null,
      columns: [
        // 1
        { data: Selected },
        // 2
        {
          data: Id, thName: this.translator.get('common.tableHeader.id'),
          tdClass: 'print -ex-type-id', thClass: 'print -ex-type-id'
        },
        // 3
        {
          data: OrderNumber, orderable: false, thName: this.translator.get('common.tableHeader.orderNumber'),
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text'
        },
        // 4
        {
          data: Consignee, orderable: false, thName: this.translator.get('common.tableHeader.consignee'),
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text'
        },
        // 5
        {
          data: ProductName, orderable: false, thName: this.translator.get('common.tableHeader.itemsName'),
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text'
        },
        // 6
        {
          data: Quantity, orderable: false, thName: this.translator.get('common.tableHeader.quantity'),
          tdClass: 'print left -ex-type-number', thClass: 'print -ex-type-number'
        },
        // 7
        {
          data: MarketItemMappingId, orderable: false, thName: this.translator.get('common.tableHeader.productMatched'),
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text'
        },
        // 8
        {
          data: OrderId, orderable: false, thName: this.translator.get('common.tableHeader.orderTransferred'),
          tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text'
        },
      ],
      searchComponent: OliveSearchMarketExcelRowComponent,
      itemType: MarketExcelRow,
      extraSearches: [{ name: 'marketExcelId', value: this.excelId }],
      disabledContextMenus: [ OliveConstants.contextMenu.newItem ],
      editComponent: OliveMarketExcelRowManagerComponent,
      isEditDialogReadOnly: true
    };
  }

  notifyUserTask() {
    this.loadingIndicator = true;

    const service = this.dataService as OliveMarketExcelRowService;

    service.getStatus(this.excelId).subscribe(
      response => {
        this.loadingIndicator = false;

        this.excelRowsStatus = response.model;

        if (this.excelRowsStatus.unmappedProducts > 0) {
          this.setting.customContextMenus = [{
            iconName: NavIcons.Sales.matchItems,
            titleId: 'sales.marketExcelRows.linkProductMenu'
          }];

          const dialogRef = this.dialog.open(
            OliveTaskCountDialogComponent,
            {
              disableClose: false,
              panelClass: 'mat-dialog-md',
              data: { 
                title: this.translator.get('sales.marketExcelRows.unmappedProductsTitle'),
                numerator: this.excelRowsStatus.unmappedProducts,
                denominator: this.excelRowsStatus.mappedProducts + this.excelRowsStatus.unmappedProducts,
                buttonDescription: this.translator.get('sales.marketExcelRows.goToLinkProduct'),
                subCounts: [{name: this.translator.get('sales.marketExcelRows.transferableOrdersSubCount'), value: this.excelRowsStatus.transferableOrders}]
              } as OliveTaskCountSetting
            });
      
          dialogRef.componentInstance.onTask.subscribe(data => {
            this.router.navigateByUrl(`/data/market/orders/matches/${this.id36(this.excelId)}?name=${this.interfaceName}`);
          });
        }
        else if (this.excelRowsStatus.transferableOrders > 0) {
          this.setting.customContextMenus = [{
            iconName: NavIcons.Sales.orderList,
            titleId: 'sales.marketExcelRows.transferOrders'
          }];

          const dialogRef = this.dialog.open(
            OliveTaskCountDialogComponent,
            {
              disableClose: false,
              panelClass: 'mat-dialog-md',
              data: { 
                title: this.translator.get('sales.marketExcelRows.transferableOrdersTitle'),
                count: this.excelRowsStatus.transferableOrders,
                buttonColor: 'primary',
                buttonDescription: this.translator.get('sales.marketExcelRows.goToTransferOrders')
              } as OliveTaskCountSetting
            });
      
          dialogRef.componentInstance.onTask.subscribe(data => {
            this.alertService.showDialog(
              this.translator.get('common.title.finalConfirm'),
              this.translator.get('sales.marketExcelRows.finalTransferOrdersConfirmMessage'),
              DialogType.confirm,
              () => this.transferOrders(),
              () => null,
              this.translator.get('common.button.yes'),
              this.translator.get('common.button.no')
            );
          });
        }
      },
      error => {
        this.loadingIndicator = false;
        this.messageHelper.showLoadFailedSticky(error);
      }
    );    
  }

  listTitle() {
    return `${this.translator.get('common.word.excel')}-${this.interfaceName}`;
  }

  getEditorCustomTitle(item: MarketExcelRow) {
    if (item) {
      return `${item.orderNumber}-${item.consigneeName}`;
    }
    else {
      return this.listTitle();
    }
  }

  onDestroy() {
    this.sub.unsubscribe();
  }

  customContextMenu(id: string) { 
    this.notifyUserTask();
  }

  renderItem(item: MarketExcelRow, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Id:
        retValue = this.id36(item.id);
        break;
      case OrderNumber:
        retValue = item.orderNumber;
        break;
      case Consignee:
        retValue = item.consigneeName;
        break;
      case ProductName:
        retValue = item.productName;
        break;
      case Quantity:
        retValue = this.commaNumber(item.quantity);
        break;
    }

    return retValue;
  }

  icon(item: MarketExcelRow, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case MarketItemMappingId:
        retValue = true;
        break;
      case OrderId:
        retValue = true;
        break;
    }

    return retValue;
  }

  iconName(item: MarketExcelRow, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case MarketItemMappingId:
        retValue = checkIcon(!this.isNull(item.marketItemMappingId));
        break;
      case OrderId:
        retValue = checkIcon(!this.isNull(item.orderId));
        break;
    }

    return retValue;
  }

  navigateDetailPage(item: MarketExcel) { 
    this.router.navigateByUrl(`/data/market/orders/${this.id36(item.id)}?name=${encodeURI(item.interfaceName)}`);
  }

  onUploaded(item: MarketExcel) {
    super.onUploaded(item);
    this.navigateDetailPage(item);
  }

  transferOrders() {
    this.loadingIndicator = true;

    const service = this.dataService as OliveMarketExcelRowService;

    service.transferOrders(this.excelId).subscribe(
      response => {
        this.loadingIndicator = false;

        const transferredOrderCount: number = response.model;

        this.alertService.showDialog
        (
          this.translator.get('common.title.success'),
          String.Format(this.translator.get('sales.marketExcelRows.transferOrdersSuccessMessage'), transferredOrderCount),
          DialogType.alert,
          () => this.router.navigateByUrl('/orders/list')
        );          
      },
      error => {
        this.loadingIndicator = false;
        this.messageHelper.showLoadFailedSticky(error);
      }
    );    
  }
}
