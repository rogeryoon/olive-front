import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';

import { OliveLookupDialogComponent } from 'app/core/components/dialogs/lookup-dialog/lookup-dialog.component';

import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { LookupListerSetting } from 'app/core/interfaces/setting/lookup-lister-setting';
import { PurchaseOrder } from '../../../models/purchase-order.model';
import { IIDName } from 'app/core/models/id-name';
import { getItemsName } from 'app/core/utils/string-helper';
import { purchaseOrderId } from 'app/core/utils/olive-helpers';

const Id = 'id';
const Name = 'name';

@Component({
  selector: 'olive-purchase-order-lookup-dialog',
  templateUrl: '../../../../../core/components/dialogs/lookup-dialog/lookup-dialog.component.html',
  styleUrls: ['../../../../../core/components/dialogs/lookup-dialog/lookup-dialog.component.scss']
})
export class OlivePurchaseOrderLookupDialogComponent extends OliveLookupDialogComponent {
  constructor(
    dialog: MatDialog, formBuilder: FormBuilder,
    alertService: AlertService, messageHelper: OliveMessageHelperService,
    dialogRef: MatDialogRef<OlivePurchaseOrderLookupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) setting: LookupListerSetting,
    translator: FuseTranslationLoaderService
  ) { 
    super(
      dialog, formBuilder,
      alertService, messageHelper,
      dialogRef, setting,
      translator
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
          retValue = purchaseOrderId(item);
          break;

        case Name:
          retValue = getItemsName(item.purchaseOrderItems, 'productName', this.setting.extra);
          break;
      }
      return retValue;
    }
  }

  getCustomTableColumns(): any {
    return [
      { data: Id, name: 'ID', width: '80px', align: 'center' },
      { data: Name, orderable: false, name: 'Name', align: 'justify' }
    ];
  }

  createChip(item: PurchaseOrder) {
    return {
      id: item.id, 
      name: getItemsName(item.purchaseOrderItems, 'productName') 
    } as IIDName;
  }
}
