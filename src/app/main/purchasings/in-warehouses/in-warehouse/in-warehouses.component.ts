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

import { OliveSearchInWarehouseComponent } from './search-in-warehouse/search-in-warehouse.component';
import { OliveInWarehouseService } from './services/in-warehouse.service';
import { InWarehouse } from './models/in-warehouse.model';
import { OliveInWarehouseManagerComponent } from './in-warehouse-manager/in-warehouse-manager.component';

const Selected  = 'selected';
const Id = 'id';
const Memo = 'memo';
const CreatedUtc = 'createdUtc';

@Component({
  selector: 'olive-in-warehouse',
  templateUrl: '../../../../core/components/entity-list/entity-list.component.html',
  styleUrls: ['./in-warehouses.component.scss'],
  animations: fuseAnimations
})
export class OliveInWarehousesComponent extends OliveEntityListComponent {
  constructor(
    translater: FuseTranslationLoaderService, deviceService: DeviceDetectorService,
    alertService: AlertService, accountService: AccountService,
    messageHelper: OliveMessageHelperService, documentService: OliveDocumentService,
    dialog: MatDialog, dataService: OliveInWarehouseService
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
      name: 'InWarehouse',
      icon: NavIcons.Purchase.InWarehouseList,
      translateTitleId: NavTranslates.Purchase.InWarehouseList,
      managePermission: null,
      columns: [
        { data: Selected },
        { data: Id, thName: 'Id', tdClass: 'print -ex-type-id', thClass: 'print -ex-type-id' },
        { data: Memo, thName: 'Memo', tdClass: 'print left -ex-type-text', thClass: 'print -ex-type-text' },
        { data: CreatedUtc, thName: 'CreatedUtc', tdClass: '', thClass: '' }
      ],
      editComponent: OliveInWarehouseManagerComponent,
      searchComponent: OliveSearchInWarehouseComponent,
      itemType: InWarehouse
    };
  }

  renderItem(item: InWarehouse, columnName: string): string {

    let retValue = '';
    switch (columnName) {
      case Id:
        retValue = this.id36(item.id);
        break;
      case Memo:
        retValue = item.memo;
        break;
      case CreatedUtc:
        retValue = this.date(item.createdUtc);
        break;
    }

    return retValue;
  }

  // icon(item: InWarehouse, columnName: string): boolean {

  //   let retValue = false;

  //   switch (columnName) {

  //       retValue = true;
  //       break;        
  //   }

  //   return retValue;
  // }

  // iconName(item: InWarehouse, columnName: string): string {

  //   let retValue = '';
  //   switch (columnName) {

  //   }

  //   return retValue;
  // }
}
