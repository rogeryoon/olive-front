import { Injectable } from '@angular/core';

import { ConfigurationService } from '@quick/services/configuration.service';
import { OliveEntityService } from './entity-service';
import { OliveEntityEndpointService } from './entity-endpoint.service';

@Injectable()
export class OliveCompanyGroupSettingService extends OliveEntityService {

  constructor
    (
    endpoint: OliveEntityEndpointService,
    configurations: ConfigurationService
    ) {
    super(
      endpoint,
      configurations
    );

    this.setApiUrl('companygroupsettings');
  }
}
