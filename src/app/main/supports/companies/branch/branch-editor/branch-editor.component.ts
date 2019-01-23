import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { OliveEntityFormComponent } from 'app/core/components/entity-edit/entity-form.component';
import { OliveUtilities } from 'app/core/classes/utilities';
import { Branch } from '../../models/branch.model';

@Component({
  selector: 'olive-branch-editor',
  templateUrl: './branch-editor.component.html',
  styleUrls: ['./branch-editor.component.scss']
})
export class OliveBranchEditorComponent extends OliveEntityFormComponent {

  constructor(formBuilder: FormBuilder) {
    super(
      formBuilder
    );
  }

  get code() {
    return this.oForm.get('code');
  }

  get outsourcing() {
    return this.oForm.get('outsourcing');
  }

  get private() {
    return this.oForm.get('private');
  }

  get activated() {
    return this.oForm.get('activated');
  }

  get phoneNumber() {
    return this.oForm.get('phoneNumber');
  }

  get faxNumber() {
    return this.oForm.get('faxNumber');
  }

  get email() {
    return this.oForm.get('email');
  }

  get weekdayBusinessHours() {
    return this.oForm.get('weekdayBusinessHours');
  }

  get weekendBusinessHours() {
    return this.oForm.get('weekendBusinessHours');
  }

  getEditedItem(): any {
    const formModel = this.oForm.value;

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
      id: '',
      code: '',
      name: ['', Validators.required],
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
      id: OliveUtilities.convertToBase36(this.item.id),
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
