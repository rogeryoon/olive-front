import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { fuseAnimations } from '@fuse/animations';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { NavIcons } from 'app/core/navigations/nav-icons';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveEntityListComponent } from 'app/core/components/extends/entity-list/entity-list.component';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveDocumentService } from 'app/core/services/document.service';

import { OliveMarketExcelService } from '../../services/market-excel.service';
import { MarketExcel } from '../../models/market-excel.model';
import { OliveConstants } from 'app/core/classes/constants';
import { OliveMarketExcelImportDialogComponent } from './market-excel-import-dialog/market-excel-import-dialog.component';
import { getShortDate } from 'app/core/utils/date-helper';

const Selected  = 'selected';
const CreatedUtc = 'id';
const InterfaceName = 'interfaceName';
const ExcelRowCount = 'excelRowCount';
const DuplicatedOrderCount = 'duplicatedOrderCount';
const MappingItemCount = 'mappingItemCount';
const OrderTransferredCount = 'orderTransferredCount';

@Component({
  selector: 'olive-market-excel',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./market-excels.component.scss'],
  animations: fuseAnimations
})
export class OliveMarketExcelsComponent extends OliveEntityListComponent {
  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService, 
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    documentService: OliveDocumentService, dialog: MatDialog, 
    dataService: OliveMarketExcelService, private router: Router
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
      icon: NavIcons.Sales.marketExcels,
      translateTitleId: NavTranslates.Sales.marketExcels,
      managePermission: null,
      columns: [
        { data: Selected },
        { data: CreatedUtc, thName: this.translator.get('common.tableHeader.createdUtc'), 
          tdClass: 'print -ex-type-text created-utc', thClass: 'print -ex-type-text created-utc' },
        { data: InterfaceName, thName: this.translator.get('common.tableHeader.interfaceName'),  
          tdClass: 'print left -ex-type-text inInterface-name', thClass: 'print -ex-type-text -ex-width-60 inInterface-name' },
        { data: ExcelRowCount, thName: this.translator.get('common.tableHeader.excelRowCount'), 
          tdClass: 'print right -ex-type-number excel-row-count', thClass: 'print right -ex-type-number excel-row-count' },
        { data: OrderTransferredCount, thName: this.translator.get('common.tableHeader.orderTransferredCount'), 
          tdClass: 'print right -ex-type-number order-transferred-count', thClass: 'print right -ex-type-number order-transferred-count' },
        { data: DuplicatedOrderCount, thName: this.translator.get('common.tableHeader.duplicatedOrderCount'), 
          tdClass: 'print right -ex-type-number duplicated-order-count', thClass: 'print right -ex-type-number duplicated-order-count' },
        { data: MappingItemCount, thName: this.translator.get('common.tableHeader.mappingItemCount'), 
          tdClass: 'print right -ex-type-number mapping-item-count', thClass: 'print right -ex-type-number mapping-item-count' },
      ],
      itemType: MarketExcel,
      disabledContextMenus: [ OliveConstants.contextMenu.newItem, OliveConstants.contextMenu.excel, OliveConstants.contextMenu.print ],
      noSearchBox: true,
      navigateDetailPage: true
    };
  }

  renderItem(item: MarketExcel, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case CreatedUtc:
        retValue = getShortDate(item.createdUtc, true);
        break;
      case InterfaceName:
        retValue = item.interfaceName;
        break;
      case ExcelRowCount:
        retValue = this.commaNumber(item.excelRowCount);
        break;
      case DuplicatedOrderCount:
        retValue = this.commaNumber(item.duplicatedOrderCount);
        break;
      case MappingItemCount:
        retValue = this.commaNumber(item.mappingItemCount);
        break;
      case OrderTransferredCount:
        retValue = this.commaNumber(item.orderTransferredCount);
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

  onUpload() {
    const dialogRef = this.dialog.open(
      OliveMarketExcelImportDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: { importType: this.setting.itemType.name }
      });

    dialogRef.componentInstance.onSave.subscribe(data => {
      this.uploadItems(data, dialogRef);
    });
  }
}
