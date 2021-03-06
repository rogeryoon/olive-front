﻿import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { numberValidator, requiredAnyValidator, requiredValidator } from 'app/core/validators/general-validators';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { MatSnackBar } from '@angular/material';
import { OliveProductService } from 'app/main/productions/services/product.service';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveConstants } from 'app/core/classes/constants';
import { ProductWeight } from 'app/main/productions/models/product-weight.model';

@Component({
  selector: 'olive-product-weight-editor',
  templateUrl: './product-weight-editor.component.html',
  styleUrls: ['./product-weight-editor.component.scss']
})
export class OliveProductWeightEditorComponent extends OliveEntityEditComponent {
  weightTypes: any[] = OliveConstants.weightTypes;
  variantCount = 0;

  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService,
    snackBar: MatSnackBar, formBuilder: FormBuilder,
    dataService: OliveProductService, private cacheService: OliveCacheService
  ) {
    super(
      translator, alertService,
      accountService, messageHelper,
      snackBar, formBuilder,
      dataService
    );
  }

  getEditedItem(): ProductWeight {
    const formModel = this.oFormValue;

    return {
      productVariantId: this.item.productVariantId,
      productGroupWeight: formModel.productGroupWeight,
      productGroupWeightTypeCode: formModel.productGroupWeightTypeCode,
      productVariantWeight: formModel.productVariantWeight,
      productVariantWeightTypeCode: formModel.productVariantWeightTypeCode,
      productOverrideWeight: formModel.productOverrideWeight,
      productOverrideWeightTypeCode: formModel.productOverrideWeightTypeCode,
    };
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      productGroupWeight: ['', [numberValidator(2, false)]],
      productGroupWeightTypeCode: ['', requiredValidator()],
      productVariantWeight: ['', [numberValidator(2, false)]],
      productVariantWeightTypeCode: ['', requiredValidator()],
      productOverrideWeight: ['', [numberValidator(2, false)]],
      productOverrideWeightTypeCode: ['', requiredValidator()]
    });
  }

  get hasRequiredAnyError() {
    return this.hasFormError('requiredAny');
  }

  get isMultiProductVariants(): boolean {
    return this.variantCount > 1;
  }

  resetForm() {
    this.getVariantCount();

    this.oForm.reset({
      productGroupWeight: this.item.productGroupWeight || '',
      productGroupWeightTypeCode: this.item.productGroupWeightTypeCode || '',
      productVariantWeight: this.item.productVariantWeight || '',
      productVariantWeightTypeCode: this.item.productVariantWeightTypeCode || '',
      productOverrideWeight: this.extraParameter && this.extraParameter.overrideWeight || '',
      productOverrideWeightTypeCode: this.extraParameter && this.extraParameter.overrideWeightTypeCode || '',
    });

    this.cacheService.GetCompanyGroupSetting()
      .then(setting => {
        if (!this.item.productGroupWeightTypeCode) {
          this.oForm.patchValue({
            productGroupWeightTypeCode: setting.productWeightTypeCode
          });
        }

        if (!this.item.productVariantWeightTypeCode) {
          this.oForm.patchValue({
            productVariantWeightTypeCode: setting.productWeightTypeCode
          });
        }

        if (!this.extraParameter || !this.extraParameter.overrideWeightTypeCode) {
          this.oForm.patchValue({
            productOverrideWeightTypeCode: setting.productWeightTypeCode
          });
        }
      });
  }

  getVariantCount() {
    if (!this.item.productFk) {
      return;
    }

    const productService = this.dataService as OliveProductService;

    productService.getVariantCount(this.item.productId).subscribe(response => {
      this.variantCount = response.model;
    },
      error => {
        this.messageHelper.showLoadFailedSticky(error);
      });
  }

  get productName() {
    return this.extraParameter.productName;
  }

  sendToEndPoint(item: any) {
    this.isSaving = false;

    this.dataService.post('weight/', item).subscribe(
      response => this.onSaveSuccess(response.model),
      error => this.onSaveFail(error)
    );
  }

  notifyItemSaved(kiloWeight: number) {
    const formModel = this.oFormValue;

    const overrideWeight = formModel.productOverrideWeight.toString().trim() as string;

    this.onItemSaved.next({
      customsWeight: kiloWeight, 
      overrideCustomsWeight : overrideWeight.length === 0 ? null : overrideWeight,
      overrideWeightTypeCode : formModel.productOverrideWeightTypeCode,
    });
  }
}
