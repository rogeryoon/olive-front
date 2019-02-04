import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/entity-edit/entity-form.component';
import { OliveContants } from 'app/core/classes/contants';
import { OliveUtilities } from 'app/core/classes/utilities';
import { CompanyGroupSetting } from '../../../../../core/models/company-group-setting.model';

@Component({
  selector: 'olive-company-group-setting-editor',
  templateUrl: './company-group-setting-editor.component.html',
  styleUrls: ['./company-group-setting-editor.component.scss']
})
export class OliveCompanyGroupSettingEditorComponent extends OliveEntityFormComponent {

  weightTypes: any[] = OliveContants.weightTypes;

  constructor(formBuilder: FormBuilder, translater: FuseTranslationLoaderService) {
    super(
      formBuilder, translater
    );
  }

  getEditedItem(): any {
    const formModel = this.oForm.value;

    return this.itemWithIdNAudit({
      purchasingEnabled: formModel.purchasingEnabled,
      thirdpartyEnabled: formModel.thirdpartyEnabled,
      shippingAgentEnabled: formModel.shippingAgentEnabled,
      productWeightTypeCode: formModel.productWeightType
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      id: '',
      purchasingEnabled: false,
      thirdpartyEnabled: false,
      shippingAgentEnabled: false,
      productWeightType: ['', Validators.required]
    });
  }

  resetForm() {
    this.oForm.reset({
      id: OliveUtilities.convertToBase36(this.item.id),
      purchasingEnabled: this.item.purchasingEnabled || false,
      thirdpartyEnabled: this.item.thirdpartyEnabled || false,
      shippingAgentEnabled: this.item.shippingAgentEnabled || false,
      productWeightType: this.item.productWeightTypeCode || ''
    });
  }

  createEmptyObject() {
    return new CompanyGroupSetting();
  }
}
