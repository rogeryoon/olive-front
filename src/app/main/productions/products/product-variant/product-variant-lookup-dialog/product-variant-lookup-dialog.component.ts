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
import { ProductVariant } from '../../models/product-variant.model';
import { IdName, IIDName } from 'app/core/models/id-name';

const Id = 'id';
const Name = 'name';

@Component({
  selector: 'olive-product-variant-lookup-dialog',
  templateUrl: '../../../../../core/components/lookup-dialog/lookup-dialog.component.html',
  styleUrls: ['../../../../../core/components/lookup-dialog/lookup-dialog.component.scss']
})
export class OliveProductVariantLookupDialogComponent extends OliveLookupDialogComponent {

  constructor(
    dialog: MatDialog,
    formBuilder: FormBuilder,
    dialogRef: MatDialogRef<OliveProductVariantLookupDialogComponent>,
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

  renderItem(item: ProductVariant, columnName: string): string {
    if (this.setting.renderCallback) {
      return this.setting.renderCallback(item, columnName);
    }
    else {
      let retValue = '';
      switch (columnName) {
        case Id:
          retValue = OliveUtilities.convertToBase36(item.id);
          break;

        case Name:
          retValue = this.getItemName(item);
          break;
      }
      return retValue;
    }
  }

  getItemName(item: ProductVariant) {
    return `${item.productFk.name} ${item.name}`.trimRight();
  }

  createChip(item: ProductVariant) {
    return {id: item.id, name: this.getItemName(item) } as IIDName;
  }
}
