import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OliveUtilities } from 'app/core/classes/utilities';
import { Product } from '../../models/product.model';

@Component({
  selector: 'olive-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.scss']
})
export class OliveProductEditorComponent extends OliveEntityFormComponent {

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
      id: this.id36(this.item.id),
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
