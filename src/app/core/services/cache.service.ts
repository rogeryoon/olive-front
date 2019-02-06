import { Injectable } from '@angular/core';

import Mutex from 'await-mutex';

import { AuthService } from '@quick/services/auth.service';

import { CompanyGroupSetting } from 'app/core/models/company-group-setting.model';

import { OliveCompanyGroupSettingService } from './company-group-setting.service';
import { OliveQueryParameterService } from './query-parameter.service';
import { OliveMessageHelperService } from './message-helper.service';
import { OliveChunkDataService } from './chunk-data.service';
import { CompanyMaster } from '../models/company-master.model';
import { Currency } from 'app/main/supports/bases/models/currency.model';

interface CacheContent {
  expiry: number;
  value: any;
}

@Injectable()
export class OliveCacheService {
  private cache = new Map<string, CacheContent>();
  readonly DEFAULT_MAX_AGE: number = 600000; // 10 Minutes

  private companyGroupMutex = new Mutex();
  private chunkItemsMutexes = new Map<string, Mutex>();

  private _companyMaster: CompanyMaster;
  private _currencies: Currency[];
  private _standCurrency: Currency;

  constructor(
    private companyGroupSettingService: OliveCompanyGroupSettingService,
    private chunkDataService: OliveChunkDataService,
    private queryParams: OliveQueryParameterService,
    private messageHelper: OliveMessageHelperService,
    private authService: AuthService
  ) 
  {
  }

  set(key: string, value: any, maxAge: number = this.DEFAULT_MAX_AGE): any {
    this.cache.set(key, { value: value, expiry: Date.now() + maxAge });
    return value;
  }

  get(key: string): any {
    return this.cache.get(key).value;
  }

  exist(key): boolean {
    return this.hasValidCachedValue(key);
  }

  delete(key): void {
    this.cache.delete(key);
  }

  private hasValidCachedValue(key: string): boolean {
    if (this.cache.has(key)) {
      if (this.cache.get(key).expiry < Date.now()) {
        this.cache.delete(key);
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  async GetCompanyGroupSetting(): Promise<CompanyGroupSetting> {
    const companyGroupId  = this.queryParams.CompanyGroupId;
    const key = `CompanyGroupSetting-${companyGroupId}`;

    let setting: CompanyGroupSetting = null;

    const unlock = await this.companyGroupMutex.lock();
      if (!this.exist(key)) {
        try {
          const response = await this.companyGroupSettingService.getItem(companyGroupId).toPromise();
          setting = this.set(key, response.model);
        }
        catch (error) {
          this.messageHelper.showLoadFaild(error);
        }
      }
      else {
        setting = this.get(key);
      }
    unlock();

    return setting;
  }

  async getChunkItems(key: string): Promise<any> {
    let items: any = null;

    const cacheKey = key + this.queryParams.CompanyGroupId;

    if (!this.chunkItemsMutexes.has(cacheKey)) {
      this.chunkItemsMutexes.set(cacheKey, new Mutex());
    }

    const unlock = await this.chunkItemsMutexes.get(cacheKey).lock();
      if (!this.exist(cacheKey)) {
        try {
          const response = await this.chunkDataService.getItems(null, key).toPromise();
          items = this.set(cacheKey, response.model);
        }
        catch (error) {
          this.messageHelper.showLoadFaild(error);
        }
      }
      else {
        items = this.get(cacheKey);
      }
    unlock();

    return items;
  }

  get companyMaster() {
    if (!this._companyMaster) { 
      this._companyMaster = this.authService.companyMaster; 
    }
    return this._companyMaster;
  }

  get currencies() {
    if (!this._currencies) { 
      this._currencies = this.authService.currencies; 
    }    
    return this._currencies;
  }

  get standCurrency() {
    if (!this._standCurrency) { 
      this._standCurrency = this.authService.standCurrency; 
    }     
    return this._standCurrency;
  }
}
