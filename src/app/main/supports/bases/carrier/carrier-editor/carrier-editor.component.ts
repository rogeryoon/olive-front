import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Carrier } from '../../models/carrier.model';
import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';

@Component({
  selector: 'olive-carrier-editor',
  templateUrl: './carrier-editor.component.html',
  styleUrls: ['./carrier-editor.component.scss']
})
export class OliveCarrierEditorComponent extends OliveEntityFormComponent {

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
      webSite: formModel.webSite,
      memo: formModel.memo,
      activated: formModel.activated,
      standCarrierId: null
    } as Carrier);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      id: '',
      code: ['', Validators.required],
      name: ['', Validators.required],
      webSite: '',
      memo: '',
      activated: false
    });
  }

  resetForm() {
    this.oForm.reset({
      id: this.id36(this.item.id),
      code: this.item.code || '',
      name: this.item.name || '',
      webSite: this.item.webSite || '',
      memo: this.item.memo || '',
      activated: this.boolValue(this.item.activated)
    });
  }

  createEmptyObject() {
    return new Carrier();
  }
}
