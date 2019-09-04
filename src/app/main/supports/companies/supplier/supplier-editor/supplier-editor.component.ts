import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OliveUtilities } from 'app/core/classes/utilities';
import { Supplier } from '../../../models/supplier.model';
import { requiredValidator } from 'app/core/validators/general-validators';

@Component({
  selector: 'olive-supplier-editor',
  templateUrl: './supplier-editor.component.html',
  styleUrls: ['./supplier-editor.component.scss']
})
export class OliveSupplierEditorComponent extends OliveEntityFormComponent {

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
      phoneNumber: formModel.phoneNumber,
      email: formModel.email,
      webSite: formModel.webSite,
      address: formModel.address,
      memo: formModel.memo,
      activated: formModel.activated
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      code: ['', requiredValidator()],
      name: ['', requiredValidator()],
      phoneNumber: '',
      email: '',
      webSite: '',
      address: '',
      memo: '',
      activated: false
    });
}

  resetForm() {
    this.oForm.reset({
      code: this.item.code || OliveUtilities.make36Id(4),
      name: this.item.name || '',
      phoneNumber: this.item.phoneNumber || '',
      email: this.item.email || '',
      webSite: this.item.webSite || '',
      address: this.item.address || '',
      memo: this.item.memo || '',
      activated: this.boolValue(this.item.activated),
    });
  }

  createEmptyObject() {
    return new Supplier();
  }
}
