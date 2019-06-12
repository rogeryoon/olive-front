import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { Product } from '../../../models/product.model';
import { OliveConstants } from 'app/core/classes/constants';
import { numberValidator, volumeValidator } from 'app/core/classes/validators';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveUtilities } from 'app/core/classes/utilities';

@Component({
  selector: 'olive-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.scss']
})
export class OliveProductEditorComponent extends OliveEntityFormComponent {

  weightTypes: any[] = OliveConstants.weightTypes;
  lenghtTypes: any[] = OliveConstants.lengthTypes;

  constructor(
    formBuilder: FormBuilder, translater: FuseTranslationLoaderService,
    private cacheService: OliveCacheService
  ) {
    super(
      formBuilder, translater
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
      name: ['', Validators.required],
      activated: false,
      customsName: '',
      customsPrice: ['', [numberValidator(this.standCurrency.decimalPoint, false)]],
      customsTypeCode: '',
      hsCode: '',      
      memo: '',
      standPrice: ['', [numberValidator(this.standCurrency.decimalPoint, false)]],
      weight: ['', [numberValidator(2, false)]],
      weightTypeCode: ['', Validators.required],
      volume: ['', [volumeValidator()]],
      volumeWeight: '',
      lengthTypeCode: ['', Validators.required]
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
  }

  createEmptyObject() {
    return new Product();
  }

  initializeChildComponent() {
    this.standCurrency = this.cacheService.standCurrency;
  }

  renderVolumeWeight(volumeCtrl: any, weightTypeCtrl: any, lengthTypeCtrl: any) {
    return OliveUtilities.renderVolumeWeight(volumeCtrl, weightTypeCtrl, lengthTypeCtrl);
  }
}
