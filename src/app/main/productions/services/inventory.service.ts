import { Injectable } from '@angular/core';

import { ConfigurationService } from '@quick/services/configuration.service';

import { OliveEntityService } from 'app/core/services/entity-service';
import { OliveEntityEndpointService } from 'app/core/services/entity-endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class OliveInventoryService extends OliveEntityService {

  constructor
    (
    endpoint: OliveEntityEndpointService,
    configurations: ConfigurationService
    ) {
    super(
      endpoint,
      configurations
    );

    this.setApiUrl('inventories');
  }

  getInventoryBalance(dataTablesParameters: any) {
    return this.post('balance/', dataTablesParameters);
  }

  getInventoryWarehouse(dataTablesParameters: any) {
    return this.post('warehouse/', dataTablesParameters);
  }

  getCurrentAvailWarehouseInventories() {
    return this.get('currentInventory');
  }
}
