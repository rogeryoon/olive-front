import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/entity-edit/entity-form.component';
import { OliveUtilities } from 'app/core/classes/utilities';
import { CompanyGroup } from '../../models/company-group.model';

@Component({
  selector: 'olive-company-group-editor',
  templateUrl: './company-group-editor.component.html',
  styleUrls: ['./company-group-editor.component.scss']
})
export class OliveCompanyGroupEditorComponent extends OliveEntityFormComponent {
  constructor(formBuilder: FormBuilder, translater: FuseTranslationLoaderService) {
    super(
      formBuilder, translater
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
      id: '',
      name: ['', Validators.required],
      memo: '',
      activated: false
    });
  }

  resetForm() {
    this.oForm.reset({
      id: OliveUtilities.convertToBase36(this.item.id),
      name: this.item.name || '',
      memo: this.item.memo || '',
      activated: this.boolValue(this.item.activated),
    });
  }

  createEmptyObject() {
    return new CompanyGroup();
  }
}
