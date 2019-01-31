import { Injectable } from '@angular/core';

import * as fs from 'fs';
import Mutex from 'await-mutex';

import { CompanyGroupSetting } from 'app/core/models/company-group-setting.model';
import { CompanyMaster } from '../models/company-master.model';

import { OliveCompanyGroupSettingService } from './company-group-setting.service';
import { OliveQueryParameterService } from './query-parameter.service';
import { OliveMessageHelperService } from './message-helper.service';
import { OliveChunkDataService } from './chunk-data.service';
import { OliveCompanyMasterService } from './company-master.service';
import { Currency } from 'app/main/supports/bases/models/currency.model';
import { OliveCurrencyService } from 'app/main/supports/bases/services/currency.service';

interface CacheContent {
  expiry: number;
  value: any;
}


@Injectable()
export class OliveCacheService {
  private cache = new Map<string, CacheContent>();
  readonly DEFAULT_MAX_AGE: number = 600000; // 10 Minutes

  private currecyMutex = new Mutex();
  private companyMasterMutex = new Mutex();
  private companyGroupMutex = new Mutex();
  private chunkItemsMutexes = new Map<string, Mutex>();

  constructor(
    private companyMasterService: OliveCompanyMasterService,
    private companyGroupSettingService: OliveCompanyGroupSettingService,
    private chunkDataService: OliveChunkDataService,
    private currencyService: OliveCurrencyService,
    private queryParams: OliveQueryParameterService,
    private messageHelper: OliveMessageHelperService,
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

  async GetCompanyMaster(): Promise<CompanyMaster> {
    const key = `CompanyMaster`;

    let item: CompanyMaster = null;

    const unlock = await this.companyMasterMutex.lock();
      if (!this.exist(key)) {
        try {
          const response = await this.companyMasterService.getItem(0).toPromise();
          item = this.set(key, response.model);
        }
        catch (error) {
          this.messageHelper.showLoadFaild(error);
        }
      }
      else {
        item = this.get(key);
      }
    unlock();

    return item;
  }

  async GetCurrencies(): Promise<Currency[]> {
    let items: any = null;

    const key = 'Currency';

    const unlock = await this.currecyMutex.lock();
      if (!this.exist(key)) {
        try {
          const response = await this.currencyService.getItems(null).toPromise();
          items = this.set(key, response.model);
        }
        catch (error) {
          this.messageHelper.showLoadFaild(error);
        }
      }
      else {
        items = this.get(key);
      }
    unlock();

    return items;
  }

  async GetChunkItems(key: string): Promise<any> {
    let items: any = null;

    const cacheKey = key + this.queryParams.CompanyGroupId;

    if (!this.chunkItemsMutexes.has(cacheKey)) {
      this.chunkItemsMutexes.set(cacheKey, new Mutex());
    }

    const unlock = this.chunkItemsMutexes.get(cacheKey).lock();
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
}
