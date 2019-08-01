import { Injectable } from '@angular/core';

import { ConfigurationService } from '@quick/services/configuration.service';

import { OliveEntityService } from 'app/core/services/entity-service';
import { OliveEntityEndpointService } from 'app/core/services/entity-endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class OliveOrderShipOutPackageService extends OliveEntityService {

  constructor
    (
    endpoint: OliveEntityEndpointService,
    configurations: ConfigurationService
    ) {
    super(
      endpoint,
      configurations
    );

    this.setApiUrl('orderShipOutPackages');
  }

  cancelPackages(orderShipOutIds: number[]) {
    return this.post(`cancel`, orderShipOutIds);
  }
  
  finishPackages(packageIds: number[]) {
    return this.post(`finish`, packageIds);
  } 
}
