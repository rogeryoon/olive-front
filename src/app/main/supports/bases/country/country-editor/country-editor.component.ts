﻿import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { Country } from '../../../models/country.model';

@Component({
  selector: 'olive-country-editor',
  templateUrl: './country-editor.component.html',
  styleUrls: ['./country-editor.component.scss']
})
export class OliveCountryEditorComponent extends OliveEntityFormComponent {

  constructor(formBuilder: FormBuilder, translator: FuseTranslationLoaderService) {
    super(
      formBuilder, translator
    );
  }

  getEditedItem(): any {
    const formModel = this.oForm.value;

    return this.itemWithIdNAudit({
      code: formModel.code,
      name: formModel.name
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required]
    });
}

  resetForm() {
    this.oForm.reset({
      code: this.item.code || '',
      name: this.item.name || ''
    });
  }

  createEmptyObject() {
    return new Country();
  }
}
