import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DeviceDetectorService } from 'ngx-device-detector';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';

import { OliveLookupDialogComponent } from 'app/core/components/dialogs/lookup-dialog/lookup-dialog.component';

import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { LookupListerSetting } from 'app/core/interfaces/lister-setting';
import { InWarehouseItem } from '../../models/in-warehouse-item.model';
import { OliveDialogSetting } from 'app/core/classes/dialog-setting';

const ProductVariantId = 'id';
const ItemName = 'name';
const Quantity = 'quantity';
const Balance = 'balance';
const InWarehouseId = 'inWarehouseId';

@Component({
  selector: 'olive-in-warehouse-status',
  templateUrl: '../../../../../core/components/dialogs/lookup-dialog/lookup-dialog.component.html',
  styleUrls: ['./in-warehouse-status.component.scss']
})
export class OliveInWarehouseStatusComponent extends OliveLookupDialogComponent {
  constructor(
    dialog: MatDialog,
    formBuilder: FormBuilder,
    dialogRef: MatDialogRef<OliveInWarehouseStatusComponent>,
    @Inject(MAT_DIALOG_DATA) setting: LookupListerSetting,
    translater: FuseTranslationLoaderService,
    alertService: AlertService,
    messageHelper: OliveMessageHelperService,
    deviceService: DeviceDetectorService
  ) { 
    super(
      dialog, formBuilder,
      dialogRef, setting,
      translater, alertService,
      messageHelper, deviceService
    );
  }

  renderItem(item: InWarehouseItem, columnName: string): string {
    if (this.setting.renderCallback) {
      return this.setting.renderCallback(item, columnName);
    }
    else {
      let retValue = '';
      switch (columnName) {
        case ProductVariantId:
          retValue = this.id36(item.id);
          break;

        case ItemName:
          retValue = item.name;
          break;

        case Quantity:
          retValue = this.commaNumber(item.quantity);
          break;

        case Balance:
          retValue = this.commaNumber(item.balance);
          break;

        case InWarehouseId:
          retValue = this.id36(item.inWarehouseId) + '-' + this.dateCode(item.createdUtc);
          break;        
      }
      return retValue;
    }
  }

  getCustomTableColumns(): any {
    return [
      // 1
      { data: ProductVariantId, orderable: true, 
          name: this.translater.get('purchasing.inWarehouseStatusHeader.ProductVariantId')},
      // 2
      { data: ItemName, orderable: false, 
          name: this.translater.get('purchasing.inWarehouseStatusHeader.ItemName')},
      // 3
      { data: Quantity, orderable: true, 
          name: this.translater.get('purchasing.inWarehouseStatusHeader.Quantity')},
      // 4
      { data: Balance, orderable: true, 
          name: this.translater.get('purchasing.inWarehouseStatusHeader.Balance')},
      // 5
      { data: InWarehouseId, orderable: false, 
          name: this.translater.get('purchasing.inWarehouseStatusHeader.InWarehouseId')},
    ];
  }

  onCustomClick() {
    // const setting = new OliveDialogSetting(
    //   this.setting.editComponent, 
    //   {
    //     item: _.cloneDeep(this.sourceItem),
    //     itemType: this.setting.itemType,
    //     managePermission: this.setting.managePermission,
    //     translateTitleId: this.setting.translateTitleId,
    //     customTitle: this.getEditorCustomTitle(this.sourceItem),
    //     startTabIndex: startTabIndex
    //   }
    // );

    // const dialogRef = this.dialog.open(
    //   OliveEditDialogComponent,
    //   {
    //     disableClose: true,
    //     panelClass: 'mat-dialog-md',
    //     data: setting
    //   });
  }
}
