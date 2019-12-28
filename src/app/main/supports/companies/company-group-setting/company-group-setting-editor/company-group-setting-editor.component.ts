import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OliveConstants } from 'app/core/classes/constants';
import { CompanyGroupSetting } from '../../../../../core/models/company-group-setting.model';
import { requiredValidator } from 'app/core/validators/general-validators';

@Component({
  selector: 'olive-company-group-setting-editor',
  templateUrl: './company-group-setting-editor.component.html',
  styleUrls: ['./company-group-setting-editor.component.scss']
})
export class OliveCompanyGroupSettingEditorComponent extends OliveEntityFormComponent {

  weightTypes: any[] = OliveConstants.weightTypes;

  constructor(formBuilder: FormBuilder, translator: FuseTranslationLoaderService) {
    super(
      formBuilder, translator
    );
  }

  getEditedItem(): any {
    const formModel = this.oFormValue;

    return this.itemWithIdNAudit({
      purchasingEnabled: formModel.purchasingEnabled,
      thirdPartyEnabled: formModel.thirdPartyEnabled,
      shippingAgentEnabled: formModel.shippingAgentEnabled,
      productWeightTypeCode: formModel.productWeightType
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      purchasingEnabled: false,
      thirdPartyEnabled: false,
      shippingAgentEnabled: false,
      productWeightType: ['', requiredValidator()]
    });
  }

  resetForm() {
    this.oForm.reset({
      purchasingEnabled: this.item.purchasingEnabled || false,
      thirdPartyEnabled: this.item.thirdPartyEnabled || false,
      shippingAgentEnabled: this.item.shippingAgentEnabled || false,
      productWeightType: this.item.productWeightTypeCode || ''
    });
  }

  createEmptyObject() {
    return new CompanyGroupSetting();
  }
}
