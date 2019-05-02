import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ConfigurationService } from '@quick/services/configuration.service';
import { OliveQueryParameterService } from './query-parameter.service';
import { OliveEndpointBaseService } from './endpoint-base.service';

@Injectable({
  providedIn: 'root'
})
export class OliveEntityEndpointService extends OliveEndpointBaseService {
  constructor(
    http: HttpClient, configurations: ConfigurationService, 
    injector: Injector, queryParams: OliveQueryParameterService
  ) 
  {
    super(http, configurations, injector, queryParams);
  }

  getItemEndpoint<T>(id: number, apiUrl: string, errorCount = null): Observable<T> {
    return this.getEndpoint(id, apiUrl, errorCount);
  }
  
  getItemsEndpoint<T>(dataTablesParameters: any, apiUrl: string, errorCount = null): Observable<T> {
    return this.postEndpoint('', apiUrl, dataTablesParameters, errorCount);
  }

  newItemEndpoint<T>(item: any, apiUrl: string, errorCount = null): Observable<T> {
    return this.postEndpoint('new', apiUrl, item, errorCount);
  }

  uploadItemEndpoint<T>(item: any, apiUrl: string, errorCount = null): Observable<T> {
    return this.postEndpoint('upload', apiUrl, item, errorCount);
  }

  updateItemEndpoint<T>(item: any, id: number, apiUrl: string, errorCount = null): Observable<T> {
    return this.putEndpoint(id, apiUrl, item, errorCount);
  }

  deleteItemGroupEndpoint<T>(id: number, apiUrl: string, errorCount = null): Observable<T> {
    return this.deleteEndpoint(id, apiUrl, errorCount);
  }

  getEndpoint<T>(subUrl: any, apiUrl: string, errorCount = null): Observable<T> {
    const endpointUrl = `${apiUrl}/${subUrl}${this.companyGroupParam}`;

    return this.http.get<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () => this.getEndpoint(subUrl, apiUrl, errorCount), errorCount);
      });
  }  

  postEndpoint<T>(subUrl: any, apiUrl: string, data: any, errorCount = null): Observable<T> {
    const endpointUrl = `${apiUrl}/${subUrl}${this.companyGroupParam}`;

    return this.http.post<T>(endpointUrl, data ? JSON.stringify(data) : null, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () => this.postEndpoint(subUrl, apiUrl, data, errorCount), errorCount);
      });
  }

  putEndpoint<T>(subUrl: any, apiUrl: string, data: any, errorCount = null): Observable<T> {
    const endpointUrl = `${apiUrl}/${subUrl}${this.companyGroupParam}`;

    return this.http.put<T>(endpointUrl, data ? JSON.stringify(data) : null, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () => this.putEndpoint(subUrl, apiUrl, data, errorCount), errorCount);
      });
  }
 
  deleteEndpoint<T>(subUrl: any, apiUrl: string, errorCount = null): Observable<T> {
    const endpointUrl = `${apiUrl}/${subUrl}${this.companyGroupParam}`;

    return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () => this.deleteEndpoint(subUrl, apiUrl, errorCount), errorCount);
      });
  }  
}
