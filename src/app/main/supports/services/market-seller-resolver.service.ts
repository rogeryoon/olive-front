import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { OliveCacheService } from 'app/core/services/cache.service';
import { createDefaultSearchOption } from 'app/core/utils/search-helpers';
import { addActivatedCacheKey } from 'app/core/utils/olive-helpers';
import { OliveMarketSellerService } from './market-seller.service';
import { OliveWarehouseService } from './warehouse.service';

@Injectable({
  providedIn: 'root'
})
export class OliveMarketSellerResolverService implements Resolve<any> {

  constructor(
    private marketSellerService: OliveMarketSellerService,
    private cacheService: OliveCacheService
  ) {
  }

  resolve() {
    return this.cacheService.getItems(
        this.marketSellerService,
        addActivatedCacheKey(OliveCacheService.cacheKeys.getItemsKey.marketSeller), createDefaultSearchOption());
  }
}
