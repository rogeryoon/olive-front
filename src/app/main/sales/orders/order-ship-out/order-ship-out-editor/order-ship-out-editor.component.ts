import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OrderShipOut } from '../../../models/order-ship-out.model';
import { OliveUtilities } from 'app/core/classes/utilities';

@Component({
  selector: 'olive-order-ship-out-editor',
  templateUrl: './order-ship-out-editor.component.html',
  styleUrls: ['./order-ship-out-editor.component.scss']
})
export class OliveOrderShipOutEditorComponent extends OliveEntityFormComponent {

  constructor(formBuilder: FormBuilder, translater: FuseTranslationLoaderService) {
    super(
      formBuilder, translater
    );
  }

  getEditedItem(): any {
    const formModel = this.oForm.value;

    return this.itemWithIdNAudit({
      shipOutDate: formModel.shipOutDate,
      canceledDate: formModel.canceledDate,
      canceledUser: formModel.canceledUser
    } as OrderShipOut);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      shipOutDate: '',
      canceledDate: '',
      canceledUser: ''
    });
  }

  resetForm() {
    this.oForm.reset({
      shipOutDate: this.item.shipOutDate || '',
      canceledDate: this.item.canceledDate || '',
      canceledUser: this.item.canceledUser || ''
    });
  }

  createEmptyObject() {
    return new OrderShipOut();
  }
}
