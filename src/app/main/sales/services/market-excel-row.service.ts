﻿import { Injectable } from '@angular/core';

import { ConfigurationService } from '@quick/services/configuration.service';

import { OliveEntityService } from 'app/core/services/entity-service';
import { OliveEntityEndpointService } from 'app/core/services/entity-endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class OliveMarketExcelRowService extends OliveEntityService {

  constructor
    (
    endpoint: OliveEntityEndpointService,
    configurations: ConfigurationService
    ) {
    super(
      endpoint,
      configurations
    );

    this.setApiUrl('marketexcelrows');
  }

  getStatus(excelId: number) {
    return this.get(`status/${excelId}`);
  }
  
  transferOrders(excelId: number) {
    return this.post(`transferOrders/${excelId}`, null);
  }  
}
