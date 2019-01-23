import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { OliveEntityFormComponent } from 'app/core/components/entity-edit/entity-form.component';
import { OliveUtilities } from 'app/core/classes/utilities';
import { Product } from '../../models/product.model';

@Component({
  selector: 'olive-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.scss']
})
export class OliveProductEditorComponent extends OliveEntityFormComponent {

  constructor(formBuilder: FormBuilder) {
    super(
      formBuilder
    );
  }

  get code() {
    return this.oForm.get('code');
  }

  get activated() {
    return this.oForm.get('activated');
  }

  get memo() {
    return this.oForm.get('memo');
  }

  get hsCode() {
    return this.oForm.get('hsCode');
  }

  getEditedItem(): any {
    const formModel = this.oForm.value;

    return this.itemWithIdNAudit({
      code: formModel.code,
      name: formModel.name,
      activated: formModel.activated,
      memo: formModel.memo,
      hsCode: formModel.hsCode
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      id: '',
      code: '',
      name: ['', Validators.required],
      activated: false,
      memo: '',
      hsCode: ''
    });
  }

  resetForm() {
    this.oForm.reset({
      id: OliveUtilities.convertToBase36(this.item.id),
      code: this.item.code || '',
      name: this.item.name || '',
      activated: this.boolValue(this.item.activated),
      memo: this.item.memo || '',
      hsCode: this.item.hsCode || ''
    });
  }

  createEmptyObject() {
    return new Product();
  }
}
