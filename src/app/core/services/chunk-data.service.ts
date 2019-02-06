import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigurationService } from '@quick/services/configuration.service';

import { OliveQueryParameterService } from './query-parameter.service';
import { OliveEndpointBaseService } from './endpoint-base.service';

@Injectable()
export class OliveChunkDataEndpointService extends OliveEndpointBaseService {
  private readonly _url: string = '/api/chunkdatas';

  get url() { return this.configurations.baseUrl + this._url; }

  constructor(
    http: HttpClient, configurations: ConfigurationService, 
    injector: Injector, queryParams: OliveQueryParameterService
  ) 
  { 
    super(http, configurations, injector, queryParams); 
  }

  getItemsEndpoint<T>(parameter: any, type: string): Observable<T> {
    const endpointUrl = `${this.url}/${type}/${this.queryParams.CompanyGroupId}`;
    
    return this.http.post<T>(endpointUrl, parameter ? JSON.stringify(parameter) : null, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () => this.getItemsEndpoint(parameter, endpointUrl));
      });
  } 
}

@Injectable()
export class OliveChunkDataService {

  constructor(private endpoint: OliveChunkDataEndpointService) { }

  getItems(parameter: any, type: string) {
    return this.endpoint.getItemsEndpoint<any>(parameter, type);
  }
}
