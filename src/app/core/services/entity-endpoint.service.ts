import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ConfigurationService } from '@quick/services/configuration.service';
import { EndpointFactory } from '@quick/services/endpoint-factory.service';
import { OliveQueryParameterService } from './query-parameter.service';

@Injectable()
export class OliveEntityEndpointService extends EndpointFactory {
  constructor(
    http: HttpClient, configurations: ConfigurationService, 
    injector: Injector, private queryParams: OliveQueryParameterService
  ) 
  {
    super(http, configurations, injector);
  }

  get companyGroupParam(): string {
    return `?cgroup=${this.queryParams.CompanyGroupId}`;
  }

  getItemEndpoint<T>(id: number, apiUrl: string): Observable<T> {
    const endpointUrl = `${apiUrl}/${id}${this.companyGroupParam}`;

    return this.http.get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () => this.getItemEndpoint(id, endpointUrl));
      });
  }
  
  getItemsEndpoint<T>(dataTablesParameters: any, apiUrl: string): Observable<T> {
    const endpointUrl = `${apiUrl}${this.companyGroupParam}`;

    return this.http.post<T>(endpointUrl, dataTablesParameters ? JSON.stringify(dataTablesParameters) : null, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () => this.getItemsEndpoint(dataTablesParameters, endpointUrl));
      });
  }

  newItemEndpoint<T>(item: any, apiUrl: string): Observable<T> {
    const endpointUrl = `${apiUrl}/new${this.companyGroupParam}`;

    return this.http.post<T>(endpointUrl, JSON.stringify(item), this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () => this.newItemEndpoint(item, endpointUrl));
      });
  }

  uploadItemEndpoint<T>(item: any, apiUrl: string): Observable<T> {
    const endpointUrl = `${apiUrl}/upload${this.companyGroupParam}`;

    return this.http.post<T>(endpointUrl, JSON.stringify(item), this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () => this.uploadItemEndpoint(item, endpointUrl));
      });
  }

  updateItemEndpoint<T>(item: any, id: number, apiUrl: string): Observable<T> {
    const endpointUrl = `${apiUrl}/${id}${this.companyGroupParam}`;

    return this.http.put<T>(endpointUrl, JSON.stringify(item), this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () => this.updateItemEndpoint(item, id, endpointUrl));
      });
  }

  deleteItemGroupEndpoint<T>(id: number, apiUrl: string): Observable<T> {
    const endpointUrl = `${apiUrl}/${id}${this.companyGroupParam}`;

    return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () => this.deleteItemGroupEndpoint(id, endpointUrl));
      });
  }
}
