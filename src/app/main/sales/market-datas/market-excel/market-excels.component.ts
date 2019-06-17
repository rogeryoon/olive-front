import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
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

import { OliveMarketExcelService } from '../../services/market-excel.service';
import { MarketExcel } from '../../models/market-excel.model';
import { OliveConstants } from 'app/core/classes/constants';
import { OliveUtilities } from 'app/core/classes/utilities';
import { OliveMarketExcelImportDialogComponent } from './market-excel-import-dialog/market-excel-import-dialog.component';

const Selected  = 'selected';
const Id = 'id';
const InterfaceName = 'interfaceName';
const TransferredUtc = 'transferredUtc';
const CreatedUtc = 'createdUtc';

@Component({
  selector: 'olive-market-excel',
  templateUrl: '../../../../core/components/extends/entity-list/entity-list.component.html',
  styleUrls: ['./market-excels.component.scss'],
  animations: fuseAnimations
})
export class OliveMarketExcelsComponent extends OliveEntityListComponent {
  constructor(
    translater: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveMarketExcelService,
    private router: Router
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
      icon: NavIcons.Sales.marketExcels,
      translateTitleId: NavTranslates.Sales.marketExcels,
      managePermission: null,
      columns: [
        { data: Selected },
        { data: Id, thName: this.translater.get('common.tableHeader.id'), tdClass: 'print -ex-type-id', thClass: 'print -ex-type-id' },
        { data: InterfaceName, thName: this.translater.get('common.tableHeader.interfaceName'),  tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text -ex-width-60' },
        { data: TransferredUtc, thName: this.translater.get('common.tableHeader.imported'), tdClass: '', thClass: '' },
        { data: CreatedUtc, thName: this.translater.get('common.tableHeader.createdUtc'), tdClass: '', thClass: '' }
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
      case Id:
        retValue = this.id36(item.id);
        break;
      case InterfaceName:
        retValue = item.interfaceName;
        break;
      case CreatedUtc:
        retValue = this.date(item.createdUtc);
        break;
    }

    return retValue;
  }

  icon(item: MarketExcel, columnName: string): boolean {

    let retValue = false;

    switch (columnName) {
      case TransferredUtc:
        retValue = true;
        break;        
    }

    return retValue;
  }

  iconName(item: MarketExcel, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case TransferredUtc:
        retValue = OliveUtilities.iconName(item.transferredUtc);
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
