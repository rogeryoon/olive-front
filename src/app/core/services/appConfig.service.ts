// https://juristr.com/blog/2018/01/ng-app-runtime-config/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface AppConfig {
  baseUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class OliveAppConfigService {
  private _appConfig: AppConfig;

  constructor(private http: HttpClient) { }

  loadAppConfig() {
    return this.http.get('/assets/data/appConfig.json')
      .toPromise()
      .then(data => {
        this._appConfig = <AppConfig>data;
      });
  }

  getConfig() {
    return this._appConfig;
  }
}
