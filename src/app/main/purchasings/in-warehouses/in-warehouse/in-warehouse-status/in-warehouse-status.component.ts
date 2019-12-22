import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';

import { OliveLookupDialogComponent } from 'app/core/components/dialogs/lookup-dialog/lookup-dialog.component';

import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { LookupListerSetting } from 'app/core/interfaces/setting/lookup-lister-setting';
import { InWarehouseItem } from '../../../models/in-warehouse-item.model';
import { OliveDialogSetting } from 'app/core/classes/dialog-setting';
import { OliveInWarehouseService } from '../../../services/in-warehouse.service';
import { OliveInWarehouseManagerComponent } from '../in-warehouse-manager/in-warehouse-manager.component';
import { InWarehouse } from '../../../models/in-warehouse.model';
import { OliveOnEdit } from 'app/core/interfaces/on-edit';
import { OliveEditDialogComponent } from 'app/core/components/dialogs/edit-dialog/edit-dialog.component';
import { createdDateShortId } from 'app/core/utils/olive-helpers';

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
  private inWarehouses = new Map<number, InWarehouse>();

  constructor(
    dialog: MatDialog, formBuilder: FormBuilder, 
    alertService: AlertService, messageHelper: OliveMessageHelperService,
    dialogRef: MatDialogRef<OliveInWarehouseStatusComponent>,     
    @Inject(MAT_DIALOG_DATA) setting: LookupListerSetting,
    translator: FuseTranslationLoaderService, private oliveInWarehouseService: OliveInWarehouseService
  ) { 
    super(
      dialog, formBuilder,
      alertService, messageHelper,
      dialogRef, setting,
      translator
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
          retValue = this.id26(item.productShortId);
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
          retValue = createdDateShortId(item, 'inWarehouseCreatedDate', 'inWarehouseShortId');
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
      OliveInWarehouseManagerComponent, 
      {
        item: item,
        itemType: InWarehouse,
        managePermission: null,
        customTitle: `${this.translator.get('navi.inWarehouse.group')} ID : ${createdDateShortId(item)}`,
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
