import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { CompanyGroup } from '../../../models/company-group.model';
import { requiredValidator } from 'app/core/validators/general-validators';

@Component({
  selector: 'olive-company-group-editor',
  templateUrl: './company-group-editor.component.html',
  styleUrls: ['./company-group-editor.component.scss']
})
export class OliveCompanyGroupEditorComponent extends OliveEntityFormComponent {
  constructor(formBuilder: FormBuilder, translator: FuseTranslationLoaderService) {
    super(
      formBuilder, translator
    );
  }

  getEditedItem(): any {
    const formModel = this.oForm.value;
    return this.itemWithIdNAudit({
      name: formModel.name,
      memo: formModel.memo,
      activated: formModel.activated
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      name: ['', requiredValidator()],
      memo: '',
      activated: false
    });
  }

  resetForm() {
    this.oForm.reset({
      name: this.item.name || '',
      memo: this.item.memo || '',
      activated: this.boolValue(this.item.activated),
    });
  }

  createEmptyObject() {
    return new CompanyGroup();
  }
}
