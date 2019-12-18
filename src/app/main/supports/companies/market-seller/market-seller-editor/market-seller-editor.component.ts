import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { MarketSeller } from '../../../models/market-seller.model';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveMarketService } from '../../../services/market.service';
import { Market } from '../../../models/market.model';
import { requiredValidator } from 'app/core/validators/general-validators';
import { Company } from 'app/main/supports/models/company.model';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveCompanyService } from 'app/main/supports/services/company.service';
import { OliveQueryParameterService } from 'app/core/services/query-parameter.service';
import { createSearchOption, createDefaultSearchOption } from 'app/core/utils/search-helpers';
import { makeRandom36Id } from 'app/core/utils/encode-helpers';
import { addActivatedCacheKey } from 'app/core/utils/olive-helpers';

@Component({
  selector: 'olive-market-seller-editor',
  templateUrl: './market-seller-editor.component.html',
  styleUrls: ['./market-seller-editor.component.scss']
})
export class OliveMarketSellerEditorComponent extends OliveEntityFormComponent {
  companies: Company[];
  markets: Market[];

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private marketService: OliveMarketService, private cacheService: OliveCacheService,
    private companyService: OliveCompanyService, private queryParams: OliveQueryParameterService
  ) {
    super(
      formBuilder, translator
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
      marketId: this.markets.find(item => item.id === formModel.market).id,
      companyId: this.companies.find(item => item.id === formModel.company).id,
    } as MarketSeller);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      code: ['', requiredValidator()],
      name: ['', requiredValidator()],
      memo: '',
      activated: false,
      market: ['', requiredValidator()],
      company: ['', requiredValidator()]
    });
  }

  resetForm() {
    this.oForm.reset({
      code: this.item.code || makeRandom36Id(4),
      name: this.item.name || '',
      memo: this.item.memo || '',
      activated: this.boolValue(this.item.activated),
      market: this.item.marketId || '',
      company: this.item.companyId || ''
    });
  }

  createEmptyObject() {
    return new MarketSeller();
  }

  initializeChildComponent() {
    this.getCompanies();
    this.getMarkets();
  }

  private getCompanies() {
    const companyGroupId = this.queryParams.CompanyGroupId.toString();

    // 문맥 회사그룹의 서브 회사를 로드
    const option = createSearchOption(
      [
        { name: 'activated', value: true }, 
        { name: 'companyGroupId', value: companyGroupId }
      ],
      'name',
      'asc'
    );

    this.cacheService.getItems(this.companyService, OliveCacheService.cacheKeys.getItemsKey.country + companyGroupId, option)
      .then((items: Company[]) => {
        this.companies = items;
      });
  }

  private getMarkets() {
    this.cacheService.getItems(this.marketService, addActivatedCacheKey(OliveCacheService.cacheKeys.getItemsKey.market), createDefaultSearchOption())
      .then((items: Market[]) => {
        this.markets = items;
      });
  }
}
