import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ConfigurationService } from '@quick/services/configuration.service';
import { EndpointFactory } from '@quick/services/endpoint-factory.service';
import { OliveQueryParameterService } from './query-parameter.service';

@Injectable()
export class OliveEndpointBaseService extends EndpointFactory {
  constructor(
    http: HttpClient, configurations: ConfigurationService, 
    injector: Injector, protected queryParams: OliveQueryParameterService
  ) 
  {
    super(http, configurations, injector);
  }

  get companyGroupParam(): string {
    return `?cgroup=${this.queryParams.CompanyGroupId}`;
  }
}
