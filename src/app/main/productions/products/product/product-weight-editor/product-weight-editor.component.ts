import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { numberValidator, volumeValidator, requiredAnyValidator } from 'app/core/classes/validators';
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
  
  constructor(
    translater: FuseTranslationLoaderService, alertService: AlertService,
    accountService: AccountService, messageHelper: OliveMessageHelperService, 
    snackBar: MatSnackBar, formBuilder: FormBuilder, 
    dataService: OliveProductService, private cacheService: OliveCacheService
  ) {
    super(
      translater, alertService,
      accountService, messageHelper, 
      snackBar, formBuilder, 
      dataService
    );
  }

  getEditedItem(): any {
    const formModel = this.oForm.value;

    return this.itemWithIdNAudit({
      productVariantId: this.item.productVariantId,
      productGroupWeight: formModel.productGroupWeight,
      productGroupWeightTypeCode: formModel.productGroupWeightTypeCode,
      productVariantWeight: formModel.productVariantWeight,
      productVariantWeightTypeCode: formModel.productVariantWeightTypeCode,
    } as ProductWeight);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      productGroupWeight: ['', [numberValidator(2, false)]],
      productGroupWeightTypeCode: ['', Validators.required],
      productVariantWeight: ['', [numberValidator(2, false)]],
      productVariantWeightTypeCode: ['', Validators.required]      
    }, { validators: [requiredAnyValidator(['productGroupWeight', 'productVariantWeight'])] } );
  }

  get hasRequiredAnyError() {
    return this.oForm.errors && this.oForm.errors['requiredAny'];
  }

  get weightInputUserNames(): string[] {
    return [
      this.translater.get('common.word.productGroupWeight'), 
      this.translater.get('common.word.productVariantWeight')
    ];
  }

  resetForm() {
    this.oForm.reset({
      productGroupWeight: this.item.productGroupWeight || '',
      productGroupWeightTypeCode: this.item.productGroupWeightTypeCode || '',
      productVariantWeight: this.item.productVariantWeight || '',
      productVariantWeightTypeCode: this.item.productVariantWeightTypeCode || '',       
    });

    if (!this.item.productGroupWeightTypeCode || !this.item.productVariantWeightTypeCode) {
      this.cacheService.GetCompanyGroupSetting()
        .then(setting => {
          this.oForm.patchValue({
            productGroupWeightTypeCode: setting.productWeightTypeCode,
            productVariantWeightTypeCode: setting.productWeightTypeCode
          });
        });  
    }
  }

  sendToEndPoint(item: any) {
    this.dataService.post('weight/', item).subscribe(
      response => this.onSaveSuccess(response.model),
      error => this.onSaveFail(error)
    );
  }
}
