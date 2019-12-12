import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { Market } from '../../../models/market.model';
import { MarketExcelInterface } from '../../../models/market-excel-interface';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveMarketExcelInterfaceService } from '../../../services/market-excel-interface.service';
import { requiredValidator } from 'app/core/validators/general-validators';
import { activatedNameOrderedSearchOption } from 'app/core/utils/search-helpers';
import { makeRandom36Id } from 'app/core/utils/encode-helpers';

@Component({
  selector: 'olive-market-editor',
  templateUrl: './market-editor.component.html',
  styleUrls: ['./market-editor.component.scss']
})
export class OliveMarketEditorComponent extends OliveEntityFormComponent {
  marketExcelInterfaces: MarketExcelInterface[];

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private cacheService: OliveCacheService, private marketExcelInterfaceService: OliveMarketExcelInterfaceService
  ) 
  {
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
      memo: formModel.memo,
      activated: formModel.activated,
      marketExcelInterfaceId : formModel.marketExcelInterface
    } as Market);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      code: ['', requiredValidator()],
      name: ['', requiredValidator()],
      phoneNumber: '',
      email: '',
      webSite: '',
      memo: '',
      activated: false,
      marketExcelInterface: ''
    });
  }

  resetForm() {
    this.oForm.reset({
      code: this.item.code || makeRandom36Id(4),
      name: this.item.name || '',
      phoneNumber: this.item.phoneNumber || '',
      email: this.item.email || '',
      webSite: this.item.webSite || '',
      memo: this.item.memo || '',
      activated: this.boolValue(this.item.activated),
      marketExcelInterface: this.item.marketExcelInterfaceFk ? this.item.marketExcelInterfaceFk.id : null
    });

    this.cacheService.getItems(this.marketExcelInterfaceService, OliveCacheService.cacheKeys.getItemsKey.marketExcelInterface + 'activated', activatedNameOrderedSearchOption())
    .then((items: MarketExcelInterface[]) => {
      this.marketExcelInterfaces = items.filter(e => e.activated);
      this.oForm.patchValue({marketExcelInterface: this.item.marketExcelInterfaceFk ? this.item.marketExcelInterfaceFk.id : null});
    });    
  }

  createEmptyObject() {
    return new Market();
  }
}
