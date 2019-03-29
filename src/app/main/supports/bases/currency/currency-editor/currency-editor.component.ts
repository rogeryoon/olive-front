import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { Currency } from '../../models/currency.model';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { numberValidator } from 'app/core/classes/validators';

@Component({
  selector: 'olive-currency-editor',
  templateUrl: './currency-editor.component.html',
  styleUrls: ['./currency-editor.component.scss']
})
export class OliveCurrencyEditorComponent extends OliveEntityFormComponent {

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
      decimalPoint: ['', [numberValidator(0, true, 0)]],
      activated: false
    });
}

  resetForm() {
    this.oForm.reset({
      id: this.id36(this.item.id),
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
