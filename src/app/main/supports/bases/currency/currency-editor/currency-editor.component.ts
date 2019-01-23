import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { OliveEntityFormComponent } from 'app/core/components/entity-edit/entity-form.component';
import { OliveUtilities } from 'app/core/classes/utilities';
import { Currency } from '../../models/currency.model';

@Component({
  selector: 'olive-currency-editor',
  templateUrl: './currency-editor.component.html',
  styleUrls: ['./currency-editor.component.scss']
})
export class OliveCurrencyEditorComponent extends OliveEntityFormComponent {

  constructor(formBuilder: FormBuilder) {
    super(
      formBuilder
    );
  }

  get code() {
    return this.oForm.get('code');
  }

  get symbol() {
    return this.oForm.get('symbol');
  }

  get decimalPoint() {
    return this.oForm.get('decimalPoint');
  }

  get activated() {
    return this.oForm.get('activated');
  }

  getEditedItem(): any {
    const formModel = this.oForm.value;

    return this.itemWithIdNAudit({
      code: formModel.code,
      name: formModel.name,
      symbol: formModel.symbol,
      decimalPoint: formModel.decimalPoint,
      activated: formModel.activated
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      id: '',
      code: ['', Validators.required],
      name: ['', Validators.required],
      symbol: ['', Validators.required],
      decimalPoint: ['', Validators.required],
      activated: false
    });
}

  resetForm() {
    this.oForm.reset({
      id: OliveUtilities.convertToBase36(this.item.id),
      code: this.item.code || '',
      name: this.item.name || '',
      symbol: this.item.symbol || '',
      decimalPoint: this.item.decimalPoint,
      activated: this.boolValue(this.item.activated),
    });
  }

  createEmptyObject() {
    return new Currency();
  }
}
