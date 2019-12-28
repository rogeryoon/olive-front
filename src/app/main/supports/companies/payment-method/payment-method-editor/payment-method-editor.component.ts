import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { PaymentMethod } from '../../../models/payment-method.model';
import { requiredValidator } from 'app/core/validators/general-validators';

@Component({
  selector: 'olive-payment-method-editor',
  templateUrl: './payment-method-editor.component.html',
  styleUrls: ['./payment-method-editor.component.scss']
})
export class OlivePaymentMethodEditorComponent extends OliveEntityFormComponent {

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
      memo: formModel.memo,
      activated: formModel.activated
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      code: ['', requiredValidator()],
      name: ['', requiredValidator()],
      memo: '',
      activated: false
    });
}

  resetForm() {
    this.oForm.reset({
      code: this.item.code || '',
      name: this.item.name || '',
      memo: this.item.memo || '',
      activated: this.boolValue(this.item.activated),
    });
  }

  createEmptyObject() {
    return new PaymentMethod();
  }
}
