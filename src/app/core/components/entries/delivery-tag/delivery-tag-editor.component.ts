import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { DeliveryTag } from 'app/core/models/delivery-tag.model';

@Component({
  selector: 'olive-delivery-tag-editor',
  templateUrl: './delivery-tag-editor.component.html',
  styleUrls: ['./delivery-tag-editor.component.scss']
})
export class OliveDeliveryTagEditorComponent extends OliveEntityFormComponent {

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService
  ) {
    super(
      formBuilder, translator
    );
  }

  getEditedItem(): DeliveryTag {
    const formModel = this.oForm.value;

    return this.itemWithIdNAudit({
      buyerCellPhoneNumber: formModel.buyerCellPhoneNumber,
      consigneeCellPhoneNumber: formModel.consigneeCellPhoneNumber,
      consigneePhoneNumber2: formModel.consigneePhoneNumber2,
      customsName: formModel.customsName,
      customsId: formModel.customsId,
      consigneeName: formModel.consigneeName,
      deliveryMemo: formModel.deliveryMemo
    } as DeliveryTag);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      buyerCellPhoneNumber: '',
      consigneeCellPhoneNumber: '',
      consigneePhoneNumber2: '',
      customsName: '',
      customsId: '',
      consigneeName: '',
      deliveryMemo: ''
    });
  }

  resetForm() {
    this.oForm.reset({
      buyerCellPhoneNumber: this.item.buyerCellPhoneNumber || '',
      consigneeCellPhoneNumber: this.item.consigneeCellPhoneNumber || '',
      consigneePhoneNumber2: this.item.consigneePhoneNumber2 || '',
      customsName: this.item.customsName || '',
      customsId: this.item.customsId || '',
      consigneeName: this.item.consigneeName || '',
      deliveryMemo: this.item.deliveryMemo || ''
    });
  }

  createEmptyObject() {
    return new DeliveryTag();
  }
}



