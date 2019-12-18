import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { OliveWarehouseService } from 'app/main/supports/services/warehouse.service';
import { OliveCacheService } from 'app/core/services/cache.service';
import { createDefaultSearchOption } from 'app/core/utils/search-helpers';

@Injectable({
    providedIn: 'root'
})
export class OliveOrderShipOutPackageListerPageResolver implements Resolve<any> {

    constructor(
        private warehouseService: OliveWarehouseService,
        private cacheService: OliveCacheService
    ) {
    }

    resolve() {
        return this.cacheService.getItems(
            this.warehouseService,
            OliveCacheService.cacheKeys.getItemsKey.warehouse + 'activated', createDefaultSearchOption());
    }
}


