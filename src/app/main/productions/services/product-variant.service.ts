import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';

import { ConfigurationService } from '@quick/services/configuration.service';

import { OliveEntityService } from 'app/core/services/entity-service';
import { OliveEntityEndpointService } from 'app/core/services/entity-endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class OliveProductVariantService extends OliveEntityService {

  constructor
    (
    endpoint: OliveEntityEndpointService,
    configurations: ConfigurationService
    ) {
    super(
      endpoint,
      configurations
    );

    this.setApiUrl('productVariants');
  }

  search(keyword: any) {
    if (typeof keyword !== 'string') {
      return EMPTY;
    }

    keyword = keyword.trim();

    if (keyword.length === 0) {
      return EMPTY;
    }

    return this.get(`search/${encodeURI(keyword)}`);
  }
}
