import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { MarketSeller } from '../../models/market-seller.model';
import { OliveUtilities } from 'app/core/classes/utilities';

@Component({
  selector: 'olive-market-seller-editor',
  templateUrl: './market-seller-editor.component.html',
  styleUrls: ['./market-seller-editor.component.scss']
})
export class OliveMarketSellerEditorComponent extends OliveEntityFormComponent {

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
    } as MarketSeller);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      memo: '',
      activated: false
    });
  }

  resetForm() {
    this.oForm.reset({
      code: this.item.code || OliveUtilities.make36Id(4),
      name: this.item.name || '',
      memo: this.item.memo || '',
      activated: this.boolValue(this.item.activated)
    });
  }

  createEmptyObject() {
    return new MarketSeller();
  }
}
