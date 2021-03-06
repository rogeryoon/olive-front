import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

import { LocalStoreManager } from './local-store-manager.service';
import { DBkeys } from './db-Keys';
import { Utilities } from './utilities';
import { OliveAppConfigService } from 'app/core/services/AppConfig.service';

interface UserConfiguration {
    language: string;
    homeUrl: string;
    themeId: number;
    showDashboardStatistics: boolean;
    showDashboardNotifications: boolean;
    showDashboardTodo: boolean;
    showDashboardBanner: boolean;
    warehouseId: number;
}

@Injectable()
export class ConfigurationService
{
    public static readonly appVersion: string = '1.0.0';

    // Set baseUrl to the address of the backend server. Or set to Utilities.baseUrl() if both are hosted on the same address
    public baseUrl: string = this.appConfigService.getConfig().baseUrl;
    public loginUrl = '/pages/auth/login';

    public static readonly defaultLanguage: string = 'en';
    public static readonly defaultHomeUrl: string = '/';
    public static readonly defaultThemeId: number = 1;
    public static readonly defaultShowDashboardStatistics: boolean = true;
    public static readonly defaultShowDashboardNotifications: boolean = true;
    public static readonly defaultShowDashboardTodo: boolean = false;
    public static readonly defaultShowDashboardBanner: boolean = true;

    private _language: string = null;
    private _homeUrl: string = null;
    private _themeId: number = null;
    private _showDashboardStatistics: boolean = null;
    private _showDashboardNotifications: boolean = null;
    private _showDashboardTodo: boolean = null;
    private _showDashboardBanner: boolean = null;
    // roger start
    private _warehouseId: number = null;
    // roger end

    private onConfigurationImported: Subject<boolean> = new Subject<boolean>();

    configurationImported$ = this.onConfigurationImported.asObservable();

    constructor(
        private localStorage: LocalStoreManager,
        // private translationService: AppTranslationService,
        private appConfigService: OliveAppConfigService
        )
    {
        this.loadLocalChanges();

        this.baseUrl = appConfigService.getConfig().baseUrl;
    }

    private loadLocalChanges()
    {
        if (this.localStorage.exists(DBkeys.LANGUAGE)) 
        {
            this._language = this.localStorage.getDataObject<string>(DBkeys.LANGUAGE);
            // this.translationService.changeLanguage(this._language);
        }
        else 
        {
            this.resetLanguage();
        }

        if (this.localStorage.exists(DBkeys.HOME_URL))
        {
            this._homeUrl = this.localStorage.getDataObject<string>(DBkeys.HOME_URL);
        }

        if (this.localStorage.exists(DBkeys.THEME_ID))
        {
            this._themeId = this.localStorage.getDataObject<number>(DBkeys.THEME_ID);
        }

        if (this.localStorage.exists(DBkeys.SHOW_DASHBOARD_STATISTICS))
        {
            this._showDashboardStatistics = this.localStorage.getDataObject<boolean>(DBkeys.SHOW_DASHBOARD_STATISTICS);
        }

        if (this.localStorage.exists(DBkeys.SHOW_DASHBOARD_NOTIFICATIONS))
        {
            this._showDashboardNotifications = this.localStorage.getDataObject<boolean>(DBkeys.SHOW_DASHBOARD_NOTIFICATIONS);
        }

        if (this.localStorage.exists(DBkeys.SHOW_DASHBOARD_TODO))
        {
            this._showDashboardTodo = this.localStorage.getDataObject<boolean>(DBkeys.SHOW_DASHBOARD_TODO);
        }

        if (this.localStorage.exists(DBkeys.SHOW_DASHBOARD_BANNER))
        {
            this._showDashboardBanner = this.localStorage.getDataObject<boolean>(DBkeys.SHOW_DASHBOARD_BANNER);
        }

        if (this.localStorage.exists(DBkeys.WAREHOUSE_ID))
        {
            this._warehouseId = this.localStorage.getDataObject<number>(DBkeys.WAREHOUSE_ID);
        }        
    }

    private saveToLocalStore(data: any, key: string)
    {
        setTimeout(() => this.localStorage.savePermanentData(data, key));
    }

    public import(jsonValue: string)
    {
        this.clearLocalChanges();

        if (jsonValue)
        {
            const importValue: UserConfiguration = Utilities.JsonTryParse(jsonValue);

            if (importValue.language != null)
            {
                this.language = importValue.language;
            }

            if (importValue.homeUrl != null)
            {
                this.homeUrl = importValue.homeUrl;
            }

            if (importValue.themeId != null)
            {
                this.themeId = importValue.themeId;
            }

            if (importValue.showDashboardStatistics != null)
            {
                this.showDashboardStatistics = importValue.showDashboardStatistics;
            }

            if (importValue.showDashboardNotifications != null)
            {
                this.showDashboardNotifications = importValue.showDashboardNotifications;
            }

            if (importValue.showDashboardTodo != null)
            {
                this.showDashboardTodo = importValue.showDashboardTodo;
            }

            if (importValue.showDashboardBanner != null)
            {
                this.showDashboardBanner = importValue.showDashboardBanner;
            }

            if (importValue.warehouseId != null)
            {
                this.warehouseId = importValue.warehouseId;
            }
        }

        this.onConfigurationImported.next();
    }

    public export(changesOnly = true): string
    {
        const exportValue: UserConfiguration =
            {
                language: changesOnly ? this._language : this.language,
                homeUrl: changesOnly ? this._homeUrl : this.homeUrl,
                themeId: changesOnly ? this._themeId : this.themeId,
                showDashboardStatistics: changesOnly ? this._showDashboardStatistics : this.showDashboardStatistics,
                showDashboardNotifications: changesOnly ? this._showDashboardNotifications : this.showDashboardNotifications,
                showDashboardTodo: changesOnly ? this._showDashboardTodo : this.showDashboardTodo,
                showDashboardBanner: changesOnly ? this._showDashboardBanner : this.showDashboardBanner,
                warehouseId: changesOnly ? this._warehouseId : this.warehouseId
            };

        return JSON.stringify(exportValue);
    }

    public clearLocalChanges()
    {
        this._language = null;
        this._homeUrl = null;
        this._themeId = null;
        this._showDashboardStatistics = null;
        this._showDashboardNotifications = null;
        this._showDashboardTodo = null;
        this._showDashboardBanner = null;
        this._warehouseId = null;

        this.localStorage.deleteData(DBkeys.LANGUAGE);
        this.localStorage.deleteData(DBkeys.HOME_URL);
        this.localStorage.deleteData(DBkeys.THEME_ID);
        this.localStorage.deleteData(DBkeys.SHOW_DASHBOARD_STATISTICS);
        this.localStorage.deleteData(DBkeys.SHOW_DASHBOARD_NOTIFICATIONS);
        this.localStorage.deleteData(DBkeys.SHOW_DASHBOARD_TODO);
        this.localStorage.deleteData(DBkeys.SHOW_DASHBOARD_BANNER);
        this.localStorage.deleteData(DBkeys.WAREHOUSE_ID);

        this.resetLanguage();
    }

    private resetLanguage()
    {
        // const language = this.translationService.useBrowserLanguage();

        // if (language)
        // {
        //     this._language = language;
        // }
        // else
        // {
        //     this._language = this.translationService.changeLanguage();
        // }
    }

    set language(value: string)
    {
        this._language = value;
        this.saveToLocalStore(value, DBkeys.LANGUAGE);
        // this.translationService.changeLanguage(value);
    }
    get language()
    {
        return this._language || ConfigurationService.defaultLanguage;
    }

    set homeUrl(value: string)
    {
        this._homeUrl = value;
        this.saveToLocalStore(value, DBkeys.HOME_URL);
    }
    get homeUrl()
    {
        return this._homeUrl || ConfigurationService.defaultHomeUrl;
    }

    set themeId(value: number)
    {
        this._themeId = value;
        this.saveToLocalStore(value, DBkeys.THEME_ID);
    }
    get themeId()
    {
        return this._themeId || ConfigurationService.defaultThemeId;
    }

    set showDashboardStatistics(value: boolean)
    {
        this._showDashboardStatistics = value;
        this.saveToLocalStore(value, DBkeys.SHOW_DASHBOARD_STATISTICS);
    }
    get showDashboardStatistics()
    {
        return this._showDashboardStatistics != null ? this._showDashboardStatistics : ConfigurationService.defaultShowDashboardStatistics;
    }

    set showDashboardNotifications(value: boolean)
    {
        this._showDashboardNotifications = value;
        this.saveToLocalStore(value, DBkeys.SHOW_DASHBOARD_NOTIFICATIONS);
    }
    get showDashboardNotifications()
    {
        return this._showDashboardNotifications != null ? this._showDashboardNotifications : ConfigurationService.defaultShowDashboardNotifications;
    }

    set showDashboardTodo(value: boolean)
    {
        this._showDashboardTodo = value;
        this.saveToLocalStore(value, DBkeys.SHOW_DASHBOARD_TODO);
    }
    get showDashboardTodo()
    {
        return this._showDashboardTodo != null ? this._showDashboardTodo : ConfigurationService.defaultShowDashboardTodo;
    }

    set showDashboardBanner(value: boolean)
    {
        this._showDashboardBanner = value;
        this.saveToLocalStore(value, DBkeys.SHOW_DASHBOARD_BANNER);
    }
    get showDashboardBanner()
    {
        return this._showDashboardBanner != null ? this._showDashboardBanner : ConfigurationService.defaultShowDashboardBanner;
    }

    set warehouseId(value: number)
    {
        this._warehouseId = value;
        this.saveToLocalStore(value, DBkeys.WAREHOUSE_ID);
    }
    get warehouseId()
    {
        return this._warehouseId;
    }
}
