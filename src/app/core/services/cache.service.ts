import { Injectable } from '@angular/core';

import Mutex from 'await-mutex';

import { AuthService } from '@quick/services/auth.service';

import { CompanyGroupSetting } from 'app/core/models/company-group-setting.model';

import { OliveCompanyGroupSettingService } from './company-group-setting.service';
import { OliveQueryParameterService } from './query-parameter.service';
import { OliveMessageHelperService } from './message-helper.service';
import { OliveChunkDataService } from './chunk-data.service';
import { CompanyMaster } from '../models/company-master.model';
import { Currency } from 'app/main/supports/models/currency.model';
import { OliveDataService } from '../interfaces/data-service';
import { OliveUtilities } from '../classes/utilities';
import { UserName } from '../models/user-name';
import { OliveUserConfigService } from './user-config.service';
import { UserConfig } from '../models/user-config.model';
import * as _ from 'lodash';

interface CacheContent {
  expiry: number;
  value: any;
}

@Injectable({
  providedIn: 'root'
})
export class OliveCacheService {
  private cache = new Map<string, CacheContent>();
  readonly DEFAULT_MAX_AGE: number = 600000; // 10 Minutes
  readonly ONE_DAY_AGE: number = 600 * 1000 * 6 * 24; // 24 Hour
  private companyGroupMutex = new Mutex();
  private chunkItemsMutexes = new Map<string, Mutex>();
  private dataMutexes = new Map<string, Mutex>();
  private userConfigsMutex = new Mutex();

  private _companyMaster: CompanyMaster;
  private _currencies: Currency[];
  private _standCurrency: Currency;

  static cacheKeys = class {
    static paymentMethod = 'paymentmethod';
    static userName = 'usr';

    static userConfigCacheKey = 'userConfig';

    static userConfig = class {
      static warehouseCheckboxes = 'warehouseCheckboxes';
      static lookupHost = 'lookupHost-';
      static lastSelectedPaymentMethodId = 'lastSelectedPaymentMethodId';
    };
  };

  constructor(
    private companyGroupSettingService: OliveCompanyGroupSettingService, private chunkDataService: OliveChunkDataService,
    private queryParams: OliveQueryParameterService, private messageHelper: OliveMessageHelperService,
    private authService: AuthService, private userConfigService: OliveUserConfigService
  ) {
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
    const companyGroupId = this.queryParams.CompanyGroupId;
    const key = `CompanyGroupSetting-${companyGroupId}`;

    let setting: CompanyGroupSetting = null;

    const unlock = await this.companyGroupMutex.lock();
    if (!this.exist(key)) {
      try {
        const response = await this.companyGroupSettingService.getItem(companyGroupId).toPromise();
        setting = this.set(key, response.model);
      }
      catch (error) {
        this.messageHelper.showLoadFaildSticky(error);
      }
    }
    else {
      setting = this.get(key);
    }
    unlock();

    return setting;
  }

  async getItem(dataService: OliveDataService, key: string, id: number): Promise<any> {
    let item: any = null;

    const cacheKey = key + id;

    if (!this.dataMutexes.has(cacheKey)) {
      this.dataMutexes.set(cacheKey, new Mutex());
    }

    const unlock = await this.dataMutexes.get(cacheKey).lock();
    if (!this.exist(cacheKey)) {
      try {
        const response = await dataService.getItem(id).toPromise();
        item = this.set(cacheKey, response.model);
      }
      catch (error) {
        this.messageHelper.showLoadFaildSticky(error);
      }
    }
    else {
      item = this.get(cacheKey);
    }
    unlock();

    return item;
  }

  async getItems(dataService: OliveDataService, key: string, postData: any = null): Promise<any> {
    let item: any = null;

    const cacheKey = key + this.queryParams.CompanyGroupId;

    if (!this.dataMutexes.has(cacheKey)) {
      this.dataMutexes.set(cacheKey, new Mutex());
    }

    const unlock = await this.dataMutexes.get(cacheKey).lock();
    if (!this.exist(cacheKey)) {
      try {
        const response = await dataService.getItems(postData).toPromise();
        item = this.set(cacheKey, response.model);
      }
      catch (error) {
        this.messageHelper.showLoadFaildSticky(error);
      }
    }
    else {
      item = this.get(cacheKey);
    }
    unlock();

    return item;
  }

  async setUserConfig(dataKey: string, data: any): Promise<void> {
    let configs: UserConfig[] = [];

    const cacheKey = OliveCacheService.cacheKeys.userConfigCacheKey;

    const unlock = await this.userConfigsMutex.lock();
    let config: UserConfig;
    let saveDb = true;

    if (!this.exist(cacheKey)) {
      config = { dataKey: dataKey, data: JSON.stringify(data) } as UserConfig;
    }
    else {
      configs = this.get(cacheKey);
      config = configs.find(x => x.dataKey === dataKey);

      if (!config) {
        config = { dataKey: dataKey, data: JSON.stringify(data) } as UserConfig;
      }
      else if (!_.isEqual(JSON.parse(config.data), data)) {
        config.data = JSON.stringify(data);
      }
      else {
        saveDb = false;
      }
    }

    if (saveDb) {
      try {
        if (config.id) {
          await this.userConfigService.updateItem(config, config.id).toPromise();
        }
        else {
          const response = await this.userConfigService.newItem(config).toPromise();
          configs.push(response.model);
        }
      }
      catch (error) {
        this.messageHelper.showLoadFaildSticky(error);
      }
    }
    unlock();

    this.set(cacheKey, configs, this.ONE_DAY_AGE);
  }

  async getUserConfig(dataKey: string): Promise<any> {
    let configs: UserConfig[] = [];

    const cacheKey = OliveCacheService.cacheKeys.userConfigCacheKey;

    const unlock = await this.userConfigsMutex.lock();
    if (!this.exist(cacheKey)) {
      try {
        const response = await this.userConfigService.getItems(null).toPromise();
        configs = this.set(cacheKey, response.model, this.ONE_DAY_AGE);
      }
      catch (error) {
        this.messageHelper.showLoadFaildSticky(error);
      }
    }
    else {
      configs = this.get(cacheKey);
    }
    unlock();

    const config = configs.find(x => x.dataKey === dataKey);

    return config ? JSON.parse(config.data) : null;
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
        const response = await this.chunkDataService.getChuckItems(key).toPromise();
        items = this.set(cacheKey, response.model);
      }
      catch (error) {
        this.messageHelper.showLoadFaildSticky(error);
      }
    }
    else {
      items = this.get(cacheKey);
    }
    unlock();

    return items;
  }

  async getUserNames(keys: string[]): Promise<any> {
    const uniqueKeys = new Set();
    keys.forEach(key => {
      uniqueKeys.add(key);
    });

    const queryKeys = new Set();
    uniqueKeys.forEach(key => {
      if (!this.exist(OliveCacheService.cacheKeys.userName + '!' + key)) {
        queryKeys.add(key);
      }
    });

    if (queryKeys.size > 0) {
      try {
        const response = await this.chunkDataService.getUserNames(Array.from(queryKeys) as string[]).toPromise();

        const userNames = response.model;

        userNames.forEach(user => {
          this.set(OliveCacheService.cacheKeys.userName + '!' + user.userAuditKey, user);
        });
      }
      catch (error) {
        this.messageHelper.showLoadFaildSticky(error);
      }
    }

    const returnUserNames: UserName[] = [];
    uniqueKeys.forEach(key => {
      const cacheKey: string = OliveCacheService.cacheKeys.userName + '!' + key;
      if (this.exist(cacheKey)) {
        returnUserNames.push(this.get(cacheKey));
      }
    });

    return returnUserNames;
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

  showMoney(amount: number): string {
    return OliveUtilities.numberFormat(amount, this.standCurrency.decimalPoint);
  }

  get keyWarehouseCheckboxes(): string {
    return OliveCacheService.cacheKeys.userConfig.warehouseCheckboxes + this.queryParams.CompanyGroupId;
  }

  get keyLastSelectedPaymentMethodId(): string {
    return OliveCacheService.cacheKeys.userConfig.lastSelectedPaymentMethodId + this.queryParams.CompanyGroupId;
  }
}
