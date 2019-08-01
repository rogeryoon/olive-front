import { Injectable } from '@angular/core';

import { ConfigurationService } from '@quick/services/configuration.service';

import { OliveEntityService } from 'app/core/services/entity-service';
import { OliveEntityEndpointService } from 'app/core/services/entity-endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class OliveOrderShipOutService extends OliveEntityService {

  constructor
    (
    endpoint: OliveEntityEndpointService,
    configurations: ConfigurationService
    ) {
    super(
      endpoint,
      configurations
    );

    this.setApiUrl('orderShipOuts');
  }

  cancelOrder(id: number) {
    return this.post(`cancelOrder/${id}`, null);
  }

  restoreOrder(id: number) {
    return this.post(`restoreOrder/${id}`, null);
  }
}
