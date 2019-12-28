import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { Branch } from '../../../models/branch.model';
import { requiredValidator } from 'app/core/validators/general-validators';

@Component({
  selector: 'olive-branch-editor',
  templateUrl: './branch-editor.component.html',
  styleUrls: ['./branch-editor.component.scss']
})
export class OliveBranchEditorComponent extends OliveEntityFormComponent {

  constructor(formBuilder: FormBuilder, translator: FuseTranslationLoaderService) {
    super(
      formBuilder, translator
    );
  }

  getEditedItem(): any {
    const formModel = this.oFormValue;

    return this.itemWithIdNAudit({
      code: formModel.code,
      name: formModel.name,
      outsourcing: formModel.outsourcing,
      private: formModel.private,
      activated: formModel.activated,
      phoneNumber: formModel.phoneNumber,
      faxNumber: formModel.faxNumber,
      email: formModel.email,
      weekdayBusinessHours: formModel.weekdayBusinessHours,
      weekendBusinessHours: formModel.weekendBusinessHours
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      code: ['', requiredValidator()],
      name: ['', requiredValidator()],
      outsourcing: false,
      private: false,
      activated: false,
      phoneNumber: '',
      faxNumber: '',
      email: '',
      weekdayBusinessHours: '',
      weekendBusinessHours: ''
    });
}

  resetForm() {
    this.oForm.reset({
      code: this.item.code || '',
      name: this.item.name || '',
      outsourcing: this.item.outsourcing,
      private: this.item.private,
      activated: this.boolValue(this.item.activated),
      phoneNumber: this.item.phoneNumber || '',
      faxNumber: this.item.faxNumber || '',
      email: this.item.email || '',
      weekdayBusinessHours: this.item.weekdayBusinessHours || '',
      weekendBusinessHours: this.item.weekendBusinessHours || ''
    });
  }

  createEmptyObject() {
    return new Branch();
  }
}
