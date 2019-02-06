import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ConfigurationService } from '@quick/services/configuration.service';
import { OliveEndpointBaseService } from 'app/core/services/endpoint-base.service';
import { OliveQueryParameterService } from 'app/core/services/query-parameter.service';

@Injectable()
export class OliveInventoryEndpointService extends OliveEndpointBaseService {

  private readonly _inventoriesUrl: string = '/api/inventories';

  get inventoriesUrl() { return this.configurations.baseUrl + this._inventoriesUrl; }

  constructor(
    http: HttpClient, configurations: ConfigurationService, 
    injector: Injector, queryParams: OliveQueryParameterService) {
    super(http, configurations, injector, queryParams);
  }

  getInventoryBalanceEndpoint<T>(dataTablesParameters: any): Observable<T> {
    const endpointUrl = `${this.inventoriesUrl}/balance`;

    return this.http.post<T>(endpointUrl, JSON.stringify(dataTablesParameters), this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () => this.getInventoryWarehouseEndpoint(endpointUrl));
      });
  }  

  getInventoryWarehouseEndpoint<T>(dataTablesParameters: any): Observable<T> {
    const endpointUrl = `${this.inventoriesUrl}/warehouse`;

    return this.http.post<T>(endpointUrl, JSON.stringify(dataTablesParameters), this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () => this.getInventoryWarehouseEndpoint(dataTablesParameters));
      });
  }


//   getInventoryEndpoint<T>(inventoryId: number): Observable<T> {
//     const endpointUrl = `${this.inventoriesUrl}/${inventoryId}`;

//     return this.http.get<T>(endpointUrl, this.getRequestHeaders())
//       .catch(error => {
//         return this.handleError(error, () => this.getInventoryEndpoint(inventoryId));
//       });
//   }
  
//   getInventoriesEndpoint<T>(dataTablesParameters: any): Observable<T> {
//     return this.http.post<T>(this.inventoriesUrl, JSON.stringify(dataTablesParameters), this.getRequestHeaders())
//       .catch(error => {
//         return this.handleError(error, () => this.getInventoriesEndpoint(dataTablesParameters));
//       });
//   }

//   getNewInventoryEndpoint<T>(inventoryObject: any): Observable<T> {
//     return this.http.post<T>(this.newInventoryUrl, JSON.stringify(inventoryObject), this.getRequestHeaders())
//       .catch(error => {
//         return this.handleError(error, () => this.getNewInventoryEndpoint(inventoryObject));
//       });
//   }

//   getUpdateInventoryEndpoint<T>(inventoryObject: any, inventoryId: number): Observable<T> {
//     const endpointUrl = `${this.inventoriesUrl}/${inventoryId}`;

//     return this.http.put<T>(endpointUrl, JSON.stringify(inventoryObject), this.getRequestHeaders())
//       .catch(error => {
//         return this.handleError(error, () => this.getUpdateInventoryEndpoint(inventoryObject, inventoryId));
//       });
//   }

//   getDeleteInventoryEndpoint<T>(inventoryId: number): Observable<T> {
//     const endpointUrl = `${this.inventoriesUrl}/${inventoryId}`;

//     return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
//       .catch(error => {
//         return this.handleError(error, () => this.getDeleteInventoryEndpoint(inventoryId));
//       });
//   }
}
