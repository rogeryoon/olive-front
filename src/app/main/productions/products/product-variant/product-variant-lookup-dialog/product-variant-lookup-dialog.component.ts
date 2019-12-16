import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';

import { OliveLookupDialogComponent } from 'app/core/components/dialogs/lookup-dialog/lookup-dialog.component';

import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { LookupListerSetting } from 'app/core/interfaces/setting/lookup-lister-setting';
import { ProductVariant } from '../../../models/product-variant.model';
import { IIDName } from 'app/core/models/id-name';

const Id = 'id';
const Name = 'name';

@Component({
  selector: 'olive-product-variant-lookup-dialog',
  templateUrl: '../../../../../core/components/dialogs/lookup-dialog/lookup-dialog.component.html',
  styleUrls: ['../../../../../core/components/dialogs/lookup-dialog/lookup-dialog.component.scss']
})
export class OliveProductVariantLookupDialogComponent extends OliveLookupDialogComponent {

  constructor(
    dialog: MatDialog, formBuilder: FormBuilder,
    alertService: AlertService, messageHelper: OliveMessageHelperService,
    dialogRef: MatDialogRef<OliveProductVariantLookupDialogComponent>,
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

  renderItem(item: ProductVariant, columnName: string): string {
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
          retValue = this.getItemName(item);
          break;
      }
      return retValue;
    }
  }

  getItemName(item: ProductVariant) {
    return `${item.productFk.name} ${item.name}`.trim();
  }

  createChip(item: ProductVariant) {
    return {id: item.id, name: this.getItemName(item) } as IIDName;
  }
}
