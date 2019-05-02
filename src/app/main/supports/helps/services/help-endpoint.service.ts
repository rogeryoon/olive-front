import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ConfigurationService } from '@quick/services/configuration.service';
import { OliveQueryParameterService } from 'app/core/services/query-parameter.service';
import { OliveEndpointBaseService } from 'app/core/services/endpoint-base.service';

@Injectable({
  providedIn: 'root'
})
export class OliveHelpEndpointService extends OliveEndpointBaseService {

  private readonly _helpsUrl: string = '/api/helps';
  private readonly _helpUrl: string = '/api/helps/';
  private readonly _topHelpsByCategoryUrl: string = '/api/helps/categorytop';

  get helpsUrl() { return this.configurations.baseUrl + this._helpsUrl; }
  get helpUrl() { return this.configurations.baseUrl + this._helpUrl; }
  get topHelpsByCategoryUrl() { return this.configurations.baseUrl + this._topHelpsByCategoryUrl; }

  constructor(
    http: HttpClient, configurations: ConfigurationService, 
    injector: Injector, queryParams: OliveQueryParameterService) {
    super(http, configurations, injector, queryParams);
  }

  getHelpsEndPoint<T>(helpCategoryCode?: string): Observable<T> {
    return this.http.get<T>(this.helpsUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () => this.getHelpsEndPoint(helpCategoryCode));
      });
  }

  getHelpEndPoint<T>(helpId?: number): Observable<T> {
    return this.http.get<T>(this.helpUrl + helpId, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () => this.getHelpEndPoint(helpId));
      });
  }

  getTopHelpsByCategoryEndPoint<T>(): Observable<T> {
    return this.http.get<T>(this.topHelpsByCategoryUrl, this.getRequestHeaders())
      .catch(error => {
        return this.handleError(error, () => this.getTopHelpsByCategoryEndPoint());
      });
  }
}
