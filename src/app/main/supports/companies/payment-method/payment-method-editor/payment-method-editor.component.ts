import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/entity-edit/entity-form.component';
import { OliveUtilities } from 'app/core/classes/utilities';
import { PaymentMethod } from '../../models/payment-method.model';

@Component({
  selector: 'olive-payment-method-editor',
  templateUrl: './payment-method-editor.component.html',
  styleUrls: ['./payment-method-editor.component.scss']
})
export class OlivePaymentMethodEditorComponent extends OliveEntityFormComponent {

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
      memo: formModel.memo,
      activated: formModel.activated
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      id: '',
      code: ['', Validators.required],
      name: ['', Validators.required],
      memo: '',
      activated: false
    });
}

  resetForm() {
    this.oForm.reset({
      id: this.id36(this.item.id),
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
