import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { Market } from '../../models/market.model';
import { OliveUtilities } from 'app/core/classes/utilities';
import { StandMarket } from '../../models/stand-market';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveStandMarketService } from '../../services/stand-market.service';

@Component({
  selector: 'olive-market-editor',
  templateUrl: './market-editor.component.html',
  styleUrls: ['./market-editor.component.scss']
})
export class OliveMarketEditorComponent extends OliveEntityFormComponent {
  standMarkets: StandMarket[];

  constructor(
    formBuilder: FormBuilder, translater: FuseTranslationLoaderService,
    private cacheService: OliveCacheService, private standMarketService: OliveStandMarketService
  ) 
  {
    super(
      formBuilder, translater
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
      memo: formModel.memo,
      activated: formModel.activated,
      standMarketId : formModel.standMarket
    } as Market);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      phoneNumber: '',
      email: '',
      webSite: '',
      memo: '',
      activated: false,
      standMarket: ''
    });
  }

  resetForm() {
    this.oForm.reset({
      code: this.item.code || OliveUtilities.make36Id(4),
      name: this.item.name || '',
      phoneNumber: this.item.phoneNumber || '',
      email: this.item.email || '',
      webSite: this.item.webSite || '',
      memo: this.item.memo || '',
      activated: this.boolValue(this.item.activated),
      standMarket: this.item.standMarketFk ? this.item.standMarketFk.id : null
    });

    this.cacheService.getItems(this.standMarketService, 'standMarkets', null)
    .then(items => {
      const standMarkets = items as StandMarket[];
      this.standMarkets = standMarkets.filter(e => e.activated);
      this.oForm.patchValue({standMarket: this.item.standMarketFk ? this.item.standMarketFk.id : null});
    });    
  }

  createEmptyObject() {
    return new Market();
  }
}
