import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { OliveEntityFormComponent } from 'app/core/components/entity-edit/entity-form.component';
import { OliveUtilities } from 'app/core/classes/utilities';
import { Country } from '../../models/country.model';

@Component({
  selector: 'olive-country-editor',
  templateUrl: './country-editor.component.html',
  styleUrls: ['./country-editor.component.scss']
})
export class OliveCountryEditorComponent extends OliveEntityFormComponent {

  constructor(formBuilder: FormBuilder) {
    super(
      formBuilder
    );
  }

  get code() {
    return this.oForm.get('code');
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
      id: '',
      code: ['', Validators.required],
      name: ['', Validators.required]
    });
}

  resetForm() {
    this.oForm.reset({
      id: OliveUtilities.convertToBase36(this.item.id),
      code: this.item.code || '',
      name: this.item.name || ''
    });
  }

  createEmptyObject() {
    return new Country();
  }
}
