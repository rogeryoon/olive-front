import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { numberValidator, requiredAnyValidator } from 'app/core/validators/general-validators';
import { OliveEntityEditComponent } from 'app/core/components/extends/entity-edit/entity-edit.component';
import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { MatSnackBar } from '@angular/material';
import { OliveProductService } from 'app/main/productions/services/product.service';
import { ProductCustomsPrice } from 'app/main/productions/models/product-customs-price.model';

@Component({
  selector: 'olive-product-customs-price-editor',
  templateUrl: './product-customs-price-editor.component.html',
  styleUrls: ['./product-customs-price-editor.component.scss']
})
export class OliveProductCustomsPriceEditorComponent extends OliveEntityEditComponent {
  constructor(
    translator: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveProductService
  ) {
    super(
      translator, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder, 
      dataService
    );
  }

  getEditedItem(): ProductCustomsPrice {
    const formModel = this.oForm.value;

    return {
      productVariantId: this.item.productVariantId,
      productGroupCustomsPrice: formModel.productGroupCustomsPrice,
      productVariantCustomsPrice: formModel.productVariantCustomsPrice,
      productOverrideCustomsPrice: formModel.productOverrideCustomsPrice
    };
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      productGroupCustomsPrice: ['', [numberValidator(2, false)]],
      productVariantCustomsPrice: ['', [numberValidator(2, false)]],
      productOverrideCustomsPrice: ['', [numberValidator(2, false)]],
    }, { validators: [requiredAnyValidator(['productGroupCustomsPrice', 'productVariantCustomsPrice'])] } );
  }

  get hasRequiredAnyError() {
    return this.oForm.errors && this.oForm.errors['requiredAny'];
  }

  get inputRequiredNames(): string[] {
    return [
      this.translator.get('common.word.productGroupCustomsPrice'), 
      this.translator.get('common.word.productVariantCustomsPrice')
    ];
  }

  resetForm() {
    this.oForm.reset({
      productGroupCustomsPrice: this.item.productGroupCustomsPrice || '',
      productVariantCustomsPrice: this.item.productVariantCustomsPrice || '',
      productOverrideCustomsPrice: this.extraParameter && this.extraParameter.overrideCustomsPrice || ''
    });
  }

  get productName() {
    return this.extraParameter.productName;
  }

  sendToEndPoint(item: any) {
    this.isSaving = false;

    this.dataService.post('customsPrice/', item).subscribe(
      response => this.onSaveSuccess(response.model),
      error => this.onSaveFail(error)
    );
  }

  notifyItemSaved(customsPrice: number) {
    const formModel = this.oForm.value;

    this.onItemSaved.next({
      customsPrice: customsPrice, 
      overrideCustomsPrice : formModel.productOverrideCustomsPrice
    });
  }
}
