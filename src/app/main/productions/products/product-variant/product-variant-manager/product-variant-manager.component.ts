import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveProductVariantService } from '../../../services/product-variant.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OliveProductVariantEditorComponent } from '../product-variant-editor/product-variant-editor.component';

@Component({
  selector: 'olive-product-variant-manager',
  templateUrl: './product-variant-manager.component.html',
  styleUrls: ['./product-variant-manager.component.scss']
})
export class OliveProductVariantManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveProductVariantEditorComponent) 
  private productVariantEditor: OliveProductVariantEditorComponent;

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveProductVariantService
  ) {
    super(
      translator, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder, 
      dataService
    );
  }

  registerSubControl() {
    this.subControls.push(this.productVariantEditor);
  }

  getEditedItem(): any {
    const productVariant = this.productVariantEditor.getEditedItem();

    return this.itemWithIdNAudit({
      code: productVariant.code,
      name: productVariant.name,
      activated: productVariant.activated,
      memo: productVariant.memo,
      standPrice: productVariant.standPrice,
      weight: productVariant.weight,
      weightTypeCode: productVariant.weightTypeCode,
      volume: productVariant.volume,
      lengthTypeCode: productVariant.lengthTypeCode,
      customsName: productVariant.customsName,
      customsPrice: productVariant.customsPrice,
      customsTypeCode: productVariant.customsTypeCode,
      hsCode: productVariant.hsCode,      
      productId: productVariant.productId
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({});
  }

  resetForm() {
    this.oForm.reset({});
  }
}
