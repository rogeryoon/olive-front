import { Injectable } from '@angular/core';

import { ConfigurationService } from '@quick/services/configuration.service';

import { OliveEntityService } from 'app/core/services/entity-service';
import { OliveEntityEndpointService } from 'app/core/services/entity-endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class OlivePurchasingMiscService extends OliveEntityService {

  constructor
    (
    endpoint: OliveEntityEndpointService,
    configurations: ConfigurationService
    ) {
    super(
      endpoint,
      configurations
    );

    this.setApiUrl('purchasingMisc');
  }

  patchPurchaseOrder(methodName: string, transactionType: string, id: number) {
    return this.put(`${methodName}/${transactionType}/${id}`, null);
  }
}
