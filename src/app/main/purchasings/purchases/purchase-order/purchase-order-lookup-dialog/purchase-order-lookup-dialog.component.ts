import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DeviceDetectorService } from 'ngx-device-detector';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';

import { OliveLookupDialogComponent } from 'app/core/components/lookup-dialog/lookup-dialog.component';

import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { LookupListerSetting } from 'app/core/interfaces/lister-setting';
import { OliveUtilities } from 'app/core/classes/utilities';
import { PurchaseOrder } from '../../models/purchase-order.model';
import { IIDName } from 'app/core/models/id-name';

const Id = 'id';
const Name = 'name';
const PODate = 'date';

@Component({
  selector: 'olive-purchase-order-lookup-dialog',
  templateUrl: '../../../../../core/components/lookup-dialog/lookup-dialog.component.html',
  styleUrls: ['../../../../../core/components/lookup-dialog/lookup-dialog.component.scss']
})
export class OlivePurchaseOrderLookupDialogComponent extends OliveLookupDialogComponent {
  constructor(
    dialog: MatDialog,
    formBuilder: FormBuilder,
    dialogRef: MatDialogRef<OlivePurchaseOrderLookupDialogComponent>,
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

  renderItem(item: PurchaseOrder, columnName: string): string {
    if (this.setting.renderCallback) {
      return this.setting.renderCallback(item, columnName);
    }
    else {
      let retValue = '';
      switch (columnName) {
        case Id:
          retValue = this.id36(item.id);
          break;

        case Name:
          retValue = OliveUtilities.getItemsFirstName(item.purchaseOrderItems);
          break;

        case PODate:
          retValue = this.date(item.date);
          break;
      }
      return retValue;
    }
  }

  getCustomTableColumns(): any {
    return [
      { data: Id, name: 'ID', width: '50px', align: 'center' },
      { data: Name, orderable: false, name: 'Name', align: 'justify' },
      { data: PODate, orderable: false, name: 'Date', width: '90px', align: 'center' }
    ];
  }

  createChip(item: PurchaseOrder) {
    return {id: item.id, name: OliveUtilities.getItemsFirstName(item.purchaseOrderItems) } as IIDName;
  }
}
