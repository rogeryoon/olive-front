import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigurationService } from '@quick/services/configuration.service';

import { OliveEndpointBaseService } from 'app/core/services/endpoint-base.service';
import { OliveQueryParameterService } from 'app/core/services/query-parameter.service';

@Injectable()
export class OlivePurchasingMiscEndpointService extends OliveEndpointBaseService {
  private readonly _url: string = '/api/purchasingmisc';

  get url() { return this.configurations.baseUrl + this._url; }

  constructor(
    http: HttpClient, configurations: ConfigurationService, 
    injector: Injector, queryParams: OliveQueryParameterService
  ) 
  { 
    super(http, configurations, injector, queryParams); 
  }

  patchPurchaseOrderEndpoint<T>(transactionType: string, id: number): Observable<T> {
    const endpointUrl = `${this.url}/${transactionType}/${id}${this.companyGroupParam}`;
    
    return this.http.post<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () => this.patchPurchaseOrderEndpoint(transactionType, id));
      });
  } 
}

@Injectable()
export class OlivePurchasingMiscService {

  constructor(private endpoint: OlivePurchasingMiscEndpointService) { }

  patchPurchaseOrder(transactionType: string, id: number) {
    return this.endpoint.patchPurchaseOrderEndpoint<any>(transactionType, id);
  }
}
