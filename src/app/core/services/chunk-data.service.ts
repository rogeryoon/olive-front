import { Injectable } from '@angular/core';

import { ConfigurationService } from '@quick/services/configuration.service';

import { OliveEntityEndpointService } from './entity-endpoint.service';
import { OliveEntityService } from './entity-service';

@Injectable()
export class OliveChunkDataService extends OliveEntityService {

  constructor
    (
    endpoint: OliveEntityEndpointService,
    configurations: ConfigurationService
    ) {
    super(
      endpoint,
      configurations
    );

    this.setApiUrl('chunkdatas');
  }

  getUserNames(userNames: string[]) {
    return this.post('userNames', {userAuditKeys: userNames});
  }

  getChuckItems(key: string) {
    return this.post('items/' + key, null);
  }
}
