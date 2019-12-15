import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DeviceDetectorService } from 'ngx-device-detector';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';

import { OliveLookupDialogComponent } from 'app/core/components/dialogs/lookup-dialog/lookup-dialog.component';

import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { LookupListerSetting } from 'app/core/interfaces/setting/lookup-lister-setting';
import { OliveDialogSetting } from 'app/core/classes/dialog-setting';
import { OliveVoidPurchaseOrderManagerComponent } from '../void-purchase-order-manager/void-purchase-order-manager.component';
import { OliveOnEdit } from 'app/core/interfaces/on-edit';
import { OliveEditDialogComponent } from 'app/core/components/dialogs/edit-dialog/edit-dialog.component';
import { InWarehouse } from 'app/main/purchasings/models/in-warehouse.model';
import { OliveInWarehouseService } from 'app/main/purchasings/services/in-warehouse.service';
import { InWarehouseItem } from 'app/main/purchasings/models/in-warehouse-item.model';

const ProductVariantId = 'id';
const ItemName = 'name';
const Quantity = 'quantity';
const Balance = 'balance';
const InWarehouseId = 'inWarehouseId';

@Component({
  selector: 'olive-void-purchase-order-status',
  templateUrl: '../../../../../core/components/dialogs/lookup-dialog/lookup-dialog.component.html',
  styleUrls: ['./void-purchase-order-status.component.scss']
})
export class OliveVoidPurchaseOrderStatusComponent extends OliveLookupDialogComponent {
  private inWarehouses = new Map<number, InWarehouse>();

  constructor(
    dialog: MatDialog, formBuilder: FormBuilder, 
    dialogRef: MatDialogRef<OliveVoidPurchaseOrderStatusComponent>,     
    @Inject(MAT_DIALOG_DATA) setting: LookupListerSetting,
    translator: FuseTranslationLoaderService, alertService: AlertService,
    messageHelper: OliveMessageHelperService, deviceService: DeviceDetectorService,
    private oliveInWarehouseService: OliveInWarehouseService
  ) { 
    super(
      dialog, formBuilder,
      dialogRef, setting,
      translator, alertService,
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
          retValue = item.productName;
          break;

        case Quantity:
          retValue = this.commaNumber(item.quantity);
          break;

        case Balance:
          retValue = this.commaNumber(item.balance);
          break;

        case InWarehouseId:
          retValue = this.dateCode(item.createdUtc, item.inWarehouseId);
          break;        
      }
      return retValue;
    }
  }

  getCustomTableColumns(): any {
    return [
      // 1
      { data: ProductVariantId, orderable: true, 
          name: this.translator.get('purchasing.inWarehouseStatusHeader.productVariantId')},
      // 2
      { data: ItemName, orderable: false, 
          name: this.translator.get('purchasing.inWarehouseStatusHeader.itemName')},
      // 3
      { data: Quantity, orderable: true, 
          name: this.translator.get('purchasing.inWarehouseStatusHeader.quantity')},
      // 4
      { data: Balance, orderable: true, 
          name: this.translator.get('purchasing.inWarehouseStatusHeader.balance')},
      // 5
      { data: InWarehouseId, orderable: false, 
          name: this.translator.get('purchasing.inWarehouseStatusHeader.inWarehouseId')},
    ];
  }

  onCustomClick(item: InWarehouseItem) {
    this.loadingIndicator = true;

    if (this.inWarehouses.has(item.inWarehouseId)) {
      this.openDialog(this.inWarehouses.get(item.inWarehouseId));
    }
    else {
      this.oliveInWarehouseService.getItem(item.inWarehouseId).subscribe(
        response => {
          this.loadingIndicator = false;
  
          this.openDialog(response.model);
          this.inWarehouses.set(item.inWarehouseId, response.model);
        },
        error => {
          this.loadingIndicator = false;            
          this.messageHelper.showLoadFailedSticky(error);
        }
      );
    }
  }

  private openDialog(item: InWarehouse) {
    const setting = new OliveDialogSetting(
      OliveVoidPurchaseOrderManagerComponent, 
      {
        item: item,
        itemType: InWarehouse,
        managePermission: null,
        customTitle: `${this.translator.get('navi.inWarehouse.group')} ID : ${this.dateCode(item.createdUtc, item.id)}`,
        readOnly : true
      } as OliveOnEdit
    );

    const dialogRef = this.dialog.open(
      OliveEditDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: setting
      });            
  }
}
