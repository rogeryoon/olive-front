import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { OliveWarehouseService } from 'app/main/supports/services/warehouse.service';
import { OliveCacheService } from 'app/core/services/cache.service';
import { createDefaultSearchOption } from 'app/core/utils/search-helpers';
import { addActivatedCacheKey } from 'app/core/utils/olive-helpers';

@Injectable({
  providedIn: 'root'
})
export class OliveWarehouseResolverService implements Resolve<any> {

  constructor(
    private warehouseService: OliveWarehouseService,
    private cacheService: OliveCacheService
  ) {
  }

  resolve() {
    return this.cacheService.getItems(
        this.warehouseService,
        addActivatedCacheKey(OliveCacheService.cacheKeys.getItemsKey.warehouse), createDefaultSearchOption());
  }
}
