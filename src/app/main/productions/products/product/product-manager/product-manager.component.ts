import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';

import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { OliveQueryParameterService } from 'app/core/services/query-parameter.service';
import { OliveProductService } from '../../../services/product.service';
import { OliveProductEditorComponent } from '../product-editor/product-editor.component';
import { OliveProductClassEditorComponent } from '../product-class-editor/product-class-editor.component';

@Component({
  selector: 'olive-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.scss']
})
export class OliveProductManagerComponent extends OliveEntityEditComponent {
  @ViewChild(OliveProductEditorComponent) 
  private productEditor: OliveProductEditorComponent;

  @ViewChild(OliveProductClassEditorComponent)
  private productClassEditor: OliveProductClassEditorComponent;

  constructor(
    translater: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveProductService, private queryParams: OliveQueryParameterService
  ) {
    super(
      translater, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder, 
      dataService
    );
  }

  registerSubControl() {
    this.subControls.push(this.productEditor);
    this.subControls.push(this.productClassEditor);
  }

  getEditedItem(): any {
    const product = this.productEditor.getEditedItem();
    const productClass = this.productClassEditor.getEditedItem();

    return this.itemWithIdNAudit({
      code: product.code,
      name: product.name,
      activated: product.activated,
      hsCode: product.hsCode,
      customsName: product.customsName,
      customsPrice: product.customsPrice,
      customsTypeCode: product.customsTypeCode,
      memo: product.memo,
      standPrice: product.standPrice,
      weight: product.weight,
      weightTypeCode: product.weightTypeCode,
      volume: product.volume,
      lengthTypeCode: product.lengthTypeCode,      
      brands: productClass.brands,
      categories: productClass.categories,
      tags: productClass.tags
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({});
  }

  resetForm() {
    this.oForm.reset({});
  }
}
