import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { OliveEntityFormComponent } from 'app/core/components/entity-edit/entity-form.component';
import { OliveUtilities } from 'app/core/classes/utilities';
import { Vendor } from '../../models/vendor.model';

@Component({
  selector: 'olive-vendor-editor',
  templateUrl: './vendor-editor.component.html',
  styleUrls: ['./vendor-editor.component.scss']
})
export class OliveVendorEditorComponent extends OliveEntityFormComponent {

  constructor(formBuilder: FormBuilder) {
    super(
      formBuilder
    );
  }

  get code() {
    return this.oForm.get('code');
  }

  get phoneNumber() {
    return this.oForm.get('phoneNumber');
  }

  get email() {
    return this.oForm.get('email');
  }

  get webSite() {
    return this.oForm.get('webSite');
  }

  get address() {
    return this.oForm.get('address');
  }

  get memo() {
    return this.oForm.get('memo');
  }

  get activated() {
    return this.oForm.get('activated');
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
      id: '',
      code: ['', Validators.required],
      name: '',
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
      id: OliveUtilities.convertToBase36(this.item.id),
      code: this.item.code || OliveUtilities.Make36Id(4),
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
    return new Vendor();
  }
}
