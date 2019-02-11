﻿import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/entity-edit/entity-form.component';
import { OliveUtilities } from 'app/core/classes/utilities';
import { Branch } from '../../models/branch.model';

@Component({
  selector: 'olive-branch-editor',
  templateUrl: './branch-editor.component.html',
  styleUrls: ['./branch-editor.component.scss']
})
export class OliveBranchEditorComponent extends OliveEntityFormComponent {

  constructor(formBuilder: FormBuilder, translater: FuseTranslationLoaderService) {
    super(
      formBuilder, translater
    );
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
      code: ['', Validators.required],
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
      id: this.id36(this.item.id),
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
