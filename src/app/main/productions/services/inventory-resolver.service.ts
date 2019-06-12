import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { OliveWarehouseService } from 'app/main/supports/services/warehouse.service';
import { OliveCacheService } from 'app/core/services/cache.service';

@Injectable({
  providedIn: 'root'
})
export class OliveInventoryResolverService implements Resolve<any> {

  constructor(
    private warehouseService: OliveWarehouseService,
    private cacheService: OliveCacheService
  ) {
  }

  resolve() {
    return this.cacheService.getItems(
      this.warehouseService,
      'warehouses', {
        extSearch: [{ name: 'activated', value: true }],
        columns: [{ data: 'code', name: '', searchable: true, orderable: true, search: { value: '', regex: false} }],
        order: [{column: 0, dir: 'asc'}]
      });
  }
}
