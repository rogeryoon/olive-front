import { Injectable } from '@angular/core';

import Mutex from 'await-mutex';

import * as _ from 'lodash';

import { AuthService } from '@quick/services/auth.service';

import { CompanyGroupSetting } from 'app/core/models/company-group-setting.model';

import { OliveCompanyGroupSettingService } from './company-group-setting.service';
import { OliveQueryParameterService } from './query-parameter.service';
import { OliveMessageHelperService } from './message-helper.service';
import { OliveChunkDataService } from './chunk-data.service';
import { CompanyMaster } from '../models/company-master.model';
import { Currency } from 'app/main/supports/models/currency.model';
import { OliveDataService } from '../interfaces/data-service';
import { UserName } from '../models/user-name';
import { OliveUserPreferenceService } from './user-preference.service';
import { UserPreference } from '../models/user-preference.model';
import { CompanyGroupPreference } from '../models/company-group-preference.model';
import { OliveCompanyGroupPreferenceService } from './company-group-preference.service';
import { OliveConfig } from '../models/olive-config.model';
import { OliveConfigService } from './olive-config.service';
import { numberFormat } from '../utils/number-helper';

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
  private userPreferencesMutex = new Mutex();
  private companyGroupPreferencesMutex = new Mutex();
  private oliveConfigsMutex = new Mutex();

  private _companyMaster: CompanyMaster;
  private _currencies: Currency[];
  private _standCurrency: Currency;

  static cacheKeys = class {
    static paymentMethod = 'paymentMethod';
    static userName = 'usr';

    static userPreferenceCacheKey = 'userPreference';
    static userPreference = class {
      static warehouseCheckboxes = 'warehouseCheckboxes';
      static lookupHost = 'lookupHost-';
      static lastSelectedPaymentMethodId = 'lastSelectedPaymentMethodId';
    };

    static companyGroupPreferenceCacheKey = 'companyGroupPreference';
    static companyGroupPreference = class {
      static shippingLabelShippers = 'shippingLabelShippers';
      static purchaseOrderCompany = 'purchaseOrderCompany';
    };

    static oliveConfigCacheKey = 'oliveConfig';

    static getItemsKey = class {
      static country = 'country';
      static carrier = 'carrier';
      static marketSeller = 'marketSeller';
    };
  };

  constructor(
    private companyGroupSettingService: OliveCompanyGroupSettingService, private chunkDataService: OliveChunkDataService,
    private queryParams: OliveQueryParameterService, private messageHelper: OliveMessageHelperService,
    private authService: AuthService, private userPreferenceService: OliveUserPreferenceService,
    private companyGroupPreferenceService: OliveCompanyGroupPreferenceService,
    private oliveConfigService: OliveConfigService
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
        this.messageHelper.showLoadFailedSticky(error);
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
        this.messageHelper.showLoadFailedSticky(error);
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
        this.messageHelper.showLoadFailedSticky(error);
      }
    }
    else {
      item = this.get(cacheKey);
    }
    unlock();

    return item;
  }

  /**
   * Sets user preference
   * @param dataKey 
   * @param data 
   * @returns void
   */
  async setUserPreference(dataKey: string, data: any): Promise<void> {
    let preferences: UserPreference[] = [];

    const cacheKey = OliveCacheService.cacheKeys.userPreferenceCacheKey;

    const unlock = await this.userPreferencesMutex.lock();
    let preference: UserPreference;
    let saveDb = true;

    const newPreference = { dataKey: dataKey, data: JSON.stringify(data) } as UserPreference;

    if (!this.exist(cacheKey)) {
      preference = newPreference;
    }
    else {
      preferences = this.get(cacheKey);
      preference = preferences.find(x => x.dataKey === dataKey);

      if (!preference) {
        preference = newPreference;
      }
      else if (!_.isEqual(JSON.parse(preference.data), data)) {
        preference.data = JSON.stringify(data);
      }
      else {
        saveDb = false;
      }
    }

    if (saveDb) {
      try {
        if (preference.id) {
          await this.userPreferenceService.updateItem(preference, preference.id).toPromise();
        }
        else {
          const response = await this.userPreferenceService.newItem(preference).toPromise();
          preferences.push(response.model);
        }
      }
      catch (error) {
        this.messageHelper.showLoadFailedSticky(error);
      }
    }
    unlock();

    this.set(cacheKey, preferences, this.ONE_DAY_AGE);
  }

  /**
   * Gets user preference : Cache에 없으면 User Preference 한꺼번에 (퍼포먼스 향상) Loading한다. 
   * @param dataKey 
   * @returns user preference 
   */
  async getUserPreference(dataKey: string): Promise<any> {
    let preferences: UserPreference[] = [];

    const cacheKey = OliveCacheService.cacheKeys.userPreferenceCacheKey;

    const unlock = await this.userPreferencesMutex.lock();
    if (!this.exist(cacheKey)) {
      try {
        const response = await this.userPreferenceService.getItems().toPromise();
        preferences = this.set(cacheKey, response.model, this.ONE_DAY_AGE);
      }
      catch (error) {
        this.messageHelper.showLoadFailedSticky(error);
      }
    }
    else {
      preferences = this.get(cacheKey);
    }
    unlock();

    const preference = preferences.find(x => x.dataKey === dataKey);

    return preference ? JSON.parse(preference.data) : null;
  }

  /**
   * Sets company group preference
   * @param dataKey 
   * @param data 
   * @returns void
   */
  async setCompanyGroupPreference(dataKey: string, data: any): Promise<void> {
    let preferences: CompanyGroupPreference[] = [];

    const cacheKey = OliveCacheService.cacheKeys.companyGroupPreferenceCacheKey + this.queryParams.CompanyGroupId;

    const unlock = await this.companyGroupPreferencesMutex.lock();
    let preference: CompanyGroupPreference;
    let saveDb = true;

    const newPreference = { dataKey: dataKey, data: JSON.stringify(data), companyGroupId: this.queryParams.CompanyGroupId } as CompanyGroupPreference;

    if (!this.exist(cacheKey)) {
      preference = newPreference;
    }
    else {
      preferences = this.get(cacheKey);
      preference = preferences.find(x => x.dataKey === dataKey);

      if (!preference) {
        preference = newPreference;
      }
      else if (!_.isEqual(JSON.parse(preference.data), data)) {
        preference.data = JSON.stringify(data);
      }
      else {
        saveDb = false;
      }
    }

    if (saveDb) {
      try {
        if (preference.id) {
          await this.companyGroupPreferenceService.updateItem(preference, preference.id).toPromise();
        }
        else {
          const response = await this.companyGroupPreferenceService.newItem(preference).toPromise();
          preferences.push(response.model);
        }
      }
      catch (error) {
        this.messageHelper.showLoadFailedSticky(error);
      }
    }
    unlock();

    this.set(cacheKey, preferences, this.ONE_DAY_AGE);
  }

  /**
   * Gets Company Group Preference : Cache에 없으면 User Preference 한꺼번에 (퍼포먼스 향상) Loading한다. 
   * @param dataKey 
   * @returns Company Group Preference
   */
  async getCompanyGroupPreference(dataKey: string): Promise<any> {
    let preferences: CompanyGroupPreference[] = [];

    const cacheKey = OliveCacheService.cacheKeys.companyGroupPreferenceCacheKey + this.queryParams.CompanyGroupId;

    const unlock = await this.companyGroupPreferencesMutex.lock();
    if (!this.exist(cacheKey)) {
      try {
        const response = await this.companyGroupPreferenceService.getItems().toPromise();
        preferences = this.set(cacheKey, response.model, this.ONE_DAY_AGE);
      }
      catch (error) {
        this.messageHelper.showLoadFailedSticky(error);
      }
    }
    else {
      preferences = this.get(cacheKey);
    }
    unlock();

    const preference = preferences.find(x => x.dataKey === dataKey);

    return preference ? JSON.parse(preference.data) : null;
  }

  /**
   * Sets olive config
   * @param code 
   * @param name 
   * @param data 
   * @returns void
   */
  async setOliveConfig(code: string, name: string, data: any): Promise<void> {
    let configs: OliveConfig[] = [];

    const cacheKey = OliveCacheService.cacheKeys.oliveConfigCacheKey;

    const unlock = await this.oliveConfigsMutex.lock();
    let config: OliveConfig;
    let saveDb = true;

    const newConfig = { code: code, name: name, data: JSON.stringify(data) } as OliveConfig;

    if (!this.exist(cacheKey)) {
      config = newConfig;
    }
    else {
      configs = this.get(cacheKey);
      config = configs.find(x => x.code === code);

      if (!config) {
        config = newConfig;
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
          await this.oliveConfigService.updateItem(config, config.id).toPromise();
        }
        else {
          const response = await this.oliveConfigService.newItem(config).toPromise();
          configs.push(response.model);
        }
      }
      catch (error) {
        this.messageHelper.showLoadFailedSticky(error);
      }
    }
    unlock();

    this.set(cacheKey, configs, this.ONE_DAY_AGE);
  }

  /**
   * 세관 통관 관련 환경설정들을 반환
   * @returns customs configs 
   */
  async getCustomsConfigs(): Promise<any> {
    let configs: OliveConfig[] = [];

    const cacheKey = OliveCacheService.cacheKeys.oliveConfigCacheKey;

    const unlock = await this.oliveConfigsMutex.lock();
    if (!this.exist(cacheKey)) {
      try {
        const response = await this.oliveConfigService.getItems().toPromise();
        configs = this.set(cacheKey, response.model, this.ONE_DAY_AGE);
      }
      catch (error) {
        this.messageHelper.showLoadFailedSticky(error);
      }
    }
    else {
      configs = this.get(cacheKey);
    }
    unlock();

    const customsConfigs = new Map<string, any>();

    for (const cf of configs.filter(x => x.code.toUpperCase().includes('CustomsRule'.toUpperCase()))) {
      customsConfigs.set(cf.code.toUpperCase(), JSON.parse(cf.data));
    }

    return customsConfigs;
  }

  /**
   * Gets Olive Config : Cache에 없으면 Olive Config를 한꺼번에 (퍼포먼스 향상) Loading한다. 
   * @param code 
   * @returns user preference 
   */
  async getOliveConfig(code: string): Promise<any> {
    let configs: OliveConfig[] = [];

    const cacheKey = OliveCacheService.cacheKeys.oliveConfigCacheKey;

    const unlock = await this.oliveConfigsMutex.lock();
    if (!this.exist(cacheKey)) {
      try {
        const response = await this.oliveConfigService.getItems().toPromise();
        configs = this.set(cacheKey, response.model, this.ONE_DAY_AGE);
      }
      catch (error) {
        this.messageHelper.showLoadFailedSticky(error);
      }
    }
    else {
      configs = this.get(cacheKey);
    }
    unlock();

    const config = configs.find(x => x.code === code);

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
        this.messageHelper.showLoadFailedSticky(error);
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
        this.messageHelper.showLoadFailedSticky(error);
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

  showMoney(amount: number, showSymbol = false): string {
    const amountString = numberFormat(amount, this.standCurrency.decimalPoint);
    return showSymbol ? `${this.standCurrency.symbol} ${amountString}` : amountString;
  }

  get keyWarehouseCheckboxes(): string {
    return OliveCacheService.cacheKeys.userPreference.warehouseCheckboxes + this.queryParams.CompanyGroupId;
  }

  get keyLastSelectedPaymentMethodId(): string {
    return OliveCacheService.cacheKeys.userPreference.lastSelectedPaymentMethodId + this.queryParams.CompanyGroupId;
  }

  keyShippingLabelShippers(warehouseId: number, marketSellerId: number): string {
    return OliveCacheService.cacheKeys.companyGroupPreference.shippingLabelShippers + '-' + warehouseId + '-' + marketSellerId;
  }
}
