import { Component } from '@angular/core';
import { FormBuilder, AbstractControl } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { Product } from '../../../models/product.model';
import { OliveConstants } from 'app/core/classes/constants';
import { numberValidator, volumeValidator, requiredValidator } from 'app/core/classes/validators';
import { OliveCacheService } from 'app/core/services/cache.service';
import { renderVolumeWeight } from 'app/core/utils/shipping-helpers';
import { customsTypeCodeValidator, addCustomsTypeErrorMessageByControl, addCustomsTypeErrorByControl } from 'app/core/classes/customs-validators';

@Component({
  selector: 'olive-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.scss']
})
export class OliveProductEditorComponent extends OliveEntityFormComponent {
  weightTypes: any[] = OliveConstants.weightTypes;
  lengthTypes: any[] = OliveConstants.lengthTypes;

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private cacheService: OliveCacheService
  ) {
    super(
      formBuilder, translator
    );
  }

  getEditedItem(): any {
    const formModel = this.oForm.value;

    return this.itemWithIdNAudit({
      code: formModel.code,
      name: formModel.name,
      activated: formModel.activated,
      customsName: formModel.customsName,
      customsPrice: formModel.customsPrice,
      customsTypeCode: formModel.customsTypeCode,
      hsCode: formModel.hsCode,
      memo: formModel.memo,
      standPrice: formModel.standPrice,
      weight: formModel.weight,
      weightTypeCode: formModel.weightTypeCode,
      volume: formModel.volume,
      lengthTypeCode: formModel.lengthTypeCode
    } as Product);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      code: '',
      name: ['', requiredValidator()],
      activated: false,
      customsName: '',
      customsPrice: ['', [numberValidator(this.standCurrency.decimalPoint, false)]],
      customsTypeCode: '',
      hsCode: '',
      memo: '',
      standPrice: ['', [numberValidator(this.standCurrency.decimalPoint, false)]],
      weight: ['', [numberValidator(2, false)]],
      weightTypeCode: ['', requiredValidator()],
      volume: ['', [volumeValidator()]],
      volumeWeight: '',
      lengthTypeCode: ['', requiredValidator()]
    });
  }

  resetForm() {
    this.oForm.reset({
      code: this.item.code || '',
      name: this.item.name || '',
      activated: this.boolValue(this.item.activated),
      customsName: this.item.customsName || '',
      customsPrice: this.item.customsPrice || '',
      customsTypeCode: this.item.customsTypeCode || '',
      hsCode: this.item.hsCode || '',
      memo: this.item.memo || '',
      standPrice: this.item.standPrice || '',
      weight: this.item.weight || '',
      weightTypeCode: this.item.weightTypeCode || '',
      volume: this.item.volume || '',
      volumeWeight: this.item.volume || '',
      lengthTypeCode: this.item.lengthTypeCode || ''
    });

    if (!this.item.weightTypeCode || !this.item.lengthTypeCode) {
      this.cacheService.GetCompanyGroupSetting()
        .then(setting => {
          this.oForm.patchValue({
            weightTypeCode: setting.productWeightTypeCode,
            lengthTypeCode: setting.productLengthTypeCode
          });
        });
    }

    this.cacheService.getCustomsConfigs()
      .then((configs: Map<string, any>) => {
        const control = this.getControl('customsTypeCode');
        control.clearValidators();
        control.setValidators([customsTypeCodeValidator(configs, false)]);
      });
  }

  createEmptyObject() {
    return new Product();
  }

  initializeChildComponent() {
    this.standCurrency = this.cacheService.standCurrency;
  }

  /**
   * 부피 무게 문자를 빌드
   * @param volumeCtrl 
   * @param weightTypeCtrl 
   * @param lengthTypeCtrl 
   * @returns  부피 무게 표현 문자열
   */  
  renderVolumeWeight(volumeCtrl: any, weightTypeCtrl: any, lengthTypeCtrl: any) {
    return renderVolumeWeight(volumeCtrl, weightTypeCtrl, lengthTypeCtrl);
  }

  hasEntryErrorByControl(control: any): boolean {
    let hasError = super.hasEntryErrorByControl(control);

    if (hasError) { return hasError; }

    hasError = addCustomsTypeErrorByControl(control);

    return control.touched && hasError;
  }

  errorMessageByControl(control: AbstractControl): string {
    let message = super.errorMessageByControl(control);

    if (message) { return message; }

    message = addCustomsTypeErrorMessageByControl(control, this.translator);       

    return message;
  }
}
