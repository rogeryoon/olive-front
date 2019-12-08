import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { Country } from '../../../models/country.model';
import { requiredValidator } from 'app/core/validators/general-validators';

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
      name: formModel.name,
      activated: formModel.activated,
      isShipOutCountry: formModel.isShipOutCountry
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      code: ['', requiredValidator()],
      name: ['', requiredValidator()],
      activated: false,
      isShipOutCountry: false
    });
}

  resetForm() {
    this.oForm.reset({
      code: this.item.code || '',
      name: this.item.name || '',
      activated: this.boolValue(this.item.activated),
      isShipOutCountry: this.boolValue(this.item.isShipOutCountry),
    });
  }

  createEmptyObject() {
    return new Country();
  }
}
