import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { MarketSeller } from '../../../models/market-seller.model';
import { OliveUtilities } from 'app/core/classes/utilities';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveLookupHostComponent } from 'app/core/components/entries/lookup-host/lookup-host.component';
import { OliveMarketService } from '../../../services/market.service';
import { OliveMarketManagerComponent } from '../../market/market-manager/market-manager.component';
import { Market } from '../../../models/market.model';

@Component({
  selector: 'olive-market-seller-editor',
  templateUrl: './market-seller-editor.component.html',
  styleUrls: ['./market-seller-editor.component.scss']
})
export class OliveMarketSellerEditorComponent extends OliveEntityFormComponent {
  @ViewChild('marketFk') 
  lookupMarket: OliveLookupHostComponent;

  constructor(
    formBuilder: FormBuilder, translater: FuseTranslationLoaderService,
    private marketService: OliveMarketService
  ) {
    super(
      formBuilder, translater
    );
  }

  get marketTitle() {
    return NavTranslates.Company.market;
  }

  getEditedItem(): any {
    const formModel = this.oForm.value;

    return this.itemWithIdNAudit({
      code: formModel.code,
      name: formModel.name,
      memo: formModel.memo,
      activated: formModel.activated,
      marketId: formModel.marketFk.id
    } as MarketSeller);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      memo: '',
      activated: false,
      marketFk: null
    });
  }

  resetForm() {
    this.oForm.reset({
      code: this.item.code || OliveUtilities.make36Id(4),
      name: this.item.name || '',
      memo: this.item.memo || '',
      activated: this.boolValue(this.item.activated),
      marketFk: this.item.marketFk
    });
  }

  createEmptyObject() {
    return new MarketSeller();
  }

  initializeChildComponent() {
    this.lookupMarket.setting = {
      columnType: 'id',
      dialogTitle: this.translater.get(NavTranslates.Company.market),
      dataService: this.marketService,
      maxSelectItems: 1,
      newComponent: OliveMarketManagerComponent,
      itemType: Market,
      managePermission: null,
      translateTitleId: NavTranslates.Company.market
    };
  }

  markCustomControlsTouched() {
    this.lookupMarket.markAsTouched();   
  }
}
