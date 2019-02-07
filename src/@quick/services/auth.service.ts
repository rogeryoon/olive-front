// ebenmonney
/* tslint:disable */

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { LocalStoreManager } from './local-store-manager.service';
import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { DBkeys } from './db-Keys';
import { JwtHelper } from './jwt-helper';
import { Utilities } from './utilities';
import { LoginResponse, AccessToken } from '../models/login-response.model';
import { User } from '../models/user.model';
import { UserLogin } from '../models/user-login.model';
import { PermissionValues } from '../models/permission.model';
import { CompanyMaster } from 'app/core/models/company-master.model';
import { Currency } from 'app/main/supports/bases/models/currency.model';
import { forkJoin } from 'rxjs';

@Injectable()
export class AuthService {
    public get loginUrl() { return this.configurations.loginUrl; }
    public get homeUrl() { return this.configurations.homeUrl; }

    public loginRedirectUrl: string;
    public logoutRedirectUrl: string;

    public reLoginDelegate: () => void;

    private previousIsLoggedInCheck = false;
    private _loginStatus = new Subject<boolean>();

    constructor(private router: Router, private configurations: ConfigurationService, private endpointFactory: EndpointFactory, private localStorage: LocalStoreManager) {
        this.initializeLoginStatus();
    }

    private initializeLoginStatus() {
        this.localStorage.getInitEvent().subscribe(() => {
            this.reevaluateLoginStatus();
        });
    }

    gotoPage(page: string, preserveParams = true) {

        let navigationExtras: NavigationExtras = {
            queryParamsHandling: preserveParams ? "merge" : "", preserveFragment: preserveParams
        };

        this.router.navigate([page], navigationExtras);
    }

    redirectLoginUser() {
        let redirect = this.loginRedirectUrl && this.loginRedirectUrl != '/' && this.loginRedirectUrl != ConfigurationService.defaultHomeUrl ? this.loginRedirectUrl : this.homeUrl;
        this.loginRedirectUrl = null;

        let urlParamsAndFragment = Utilities.splitInTwo(redirect, '#');
        let urlAndParams = Utilities.splitInTwo(urlParamsAndFragment.firstPart, '?');

        let navigationExtras: NavigationExtras = {
            fragment: urlParamsAndFragment.secondPart,
            queryParams: Utilities.getQueryParamsFromString(urlAndParams.secondPart),
            queryParamsHandling: "merge"
        };

        console.log('redirectLoginUser', urlAndParams.firstPart, redirect);

        this.router.navigate([urlAndParams.firstPart], navigationExtras);
    }

    redirectLogoutUser() {
        let redirect = this.logoutRedirectUrl ? this.logoutRedirectUrl : this.loginUrl;
        this.logoutRedirectUrl = null;

        console.log('redirectLogoutUser', redirect);
        this.router.navigate([redirect]);
    }

    redirectForLogin() {
        this.loginRedirectUrl = this.router.url;
        console.log('redirectForLogin', this.loginRedirectUrl);
        this.router.navigate([this.loginUrl]);
    }

    reLogin() {
        this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);

        if (this.reLoginDelegate) {
            this.reLoginDelegate();
        }
        else {
            this.redirectForLogin();
        }
    }

    refreshLogin() {
        return this.endpointFactory.getRefreshLoginEndpoint<LoginResponse>()
            .map(response => this.processLoginResponse(response, this.rememberMe));
    }

    login(user: UserLogin) {
        if (this.isLoggedIn)
            this.logout();

        return this.endpointFactory.getLoginEndpoint<LoginResponse>(user.userName, user.password)
            .map(response => this.processLoginResponse(response, user.rememberMe));
    }

    private processLoginResponse(response: LoginResponse, rememberMe: boolean) {

        let accessToken = response.access_token;

        if (accessToken == null) {
            throw new Error("Received accessToken was empty");
        }

        let refreshToken = response.refresh_token || this.refreshToken;
        let expiresIn = response.expires_in;

        let tokenExpiryDate = new Date();
        tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + expiresIn);

        let accessTokenExpiry = tokenExpiryDate;

        let jwtHelper = new JwtHelper();
        let decodedAccessToken = <AccessToken>jwtHelper.decodeToken(response.access_token);

        let permissions: PermissionValues[] = Array.isArray(decodedAccessToken.permission) ? decodedAccessToken.permission : [decodedAccessToken.permission];

        if (!this.isLoggedIn) {
            this.configurations.import(decodedAccessToken.configuration);
        }

        let user = new User(
            decodedAccessToken.sub,
            decodedAccessToken.name,
            decodedAccessToken.fullname,
            decodedAccessToken.email,
            decodedAccessToken.jobtitle,
            decodedAccessToken.phone_number,
            Array.isArray(decodedAccessToken.role) ? decodedAccessToken.role : [decodedAccessToken.role],
            decodedAccessToken.companymastercode,
            decodedAccessToken.companygroupid);
        user.isEnabled = true;

        this.saveUserDetails(user, permissions, accessToken, refreshToken, accessTokenExpiry, rememberMe);

        this.reevaluateLoginStatus(user);

        return user;
    }

    private saveUserDetails(user: User, permissions: PermissionValues[], accessToken: string, refreshToken: string, expiresIn: Date, rememberMe: boolean) {
        if (rememberMe) {
            this.localStorage.savePermanentData(accessToken, DBkeys.ACCESS_TOKEN);
            this.localStorage.savePermanentData(refreshToken, DBkeys.REFRESH_TOKEN);
            this.localStorage.savePermanentData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
            this.localStorage.savePermanentData(permissions, DBkeys.USER_PERMISSIONS);
            this.localStorage.savePermanentData(user, DBkeys.CURRENT_USER);
        }
        else {
            this.localStorage.saveSyncedSessionData(accessToken, DBkeys.ACCESS_TOKEN);
            this.localStorage.saveSyncedSessionData(refreshToken, DBkeys.REFRESH_TOKEN);
            this.localStorage.saveSyncedSessionData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
            this.localStorage.saveSyncedSessionData(permissions, DBkeys.USER_PERMISSIONS);
            this.localStorage.saveSyncedSessionData(user, DBkeys.CURRENT_USER);
        }

        this.localStorage.savePermanentData(rememberMe, DBkeys.REMEMBER_ME);
    }

    // roger start
    public saveConfigs(companyMaster: CompanyMaster, currencies: Currency[]) {
        if (this.rememberMe) {
            this.localStorage.savePermanentData(companyMaster, DBkeys.COMPANY_MASTER);
            this.localStorage.savePermanentData(currencies, DBkeys.CURRENCIES);
        }
        else {
            this.localStorage.saveSyncedSessionData(companyMaster, DBkeys.COMPANY_MASTER);
            this.localStorage.saveSyncedSessionData(currencies, DBkeys.CURRENCIES);
        }

        console.log('save configs');
    }
    // roger end

    logout(): void {
        this.localStorage.deleteData(DBkeys.ACCESS_TOKEN);
        this.localStorage.deleteData(DBkeys.REFRESH_TOKEN);
        this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);
        this.localStorage.deleteData(DBkeys.USER_PERMISSIONS);
        this.localStorage.deleteData(DBkeys.CURRENT_USER);

        // roger start
        this.localStorage.deleteData(DBkeys.COMPANY_MASTER);
        this.localStorage.deleteData(DBkeys.CURRENCIES);
        // roger end

        this.configurations.clearLocalChanges();

        this.reevaluateLoginStatus();
    }

    private reevaluateLoginStatus(currentUser?: User) {
        let user = currentUser || this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
        let isLoggedIn = user != null;

        if (this.previousIsLoggedInCheck != isLoggedIn) {
            setTimeout(() => {
                this._loginStatus.next(isLoggedIn);
            });
        }

        this.previousIsLoggedInCheck = isLoggedIn;
    }

    getLoginStatusEvent(): Observable<boolean> {
        return this._loginStatus.asObservable();
    }

    get currentUser(): User {

        let user = this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
        this.reevaluateLoginStatus(user);

        return user;
    }

    get userPermissions(): PermissionValues[] {
        return this.localStorage.getDataObject<PermissionValues[]>(DBkeys.USER_PERMISSIONS) || [];
    }

    get accessToken(): string {
        this.reevaluateLoginStatus();
        return this.localStorage.getData(DBkeys.ACCESS_TOKEN);
    }

    get accessTokenExpiryDate(): Date {

        this.reevaluateLoginStatus();
        return this.localStorage.getDataObject<Date>(DBkeys.TOKEN_EXPIRES_IN, true);
    }

    get isSessionExpired(): boolean {
        if (this.accessTokenExpiryDate == null) {
            return true;
        }

        return this.accessTokenExpiryDate.valueOf() <= new Date().valueOf();
    }

    get refreshToken(): string {

        this.reevaluateLoginStatus();
        return this.localStorage.getData(DBkeys.REFRESH_TOKEN);
    }

    get isLoggedIn(): boolean {
        return this.currentUser != null;
    }

    get rememberMe(): boolean {
        return this.localStorage.getDataObject<boolean>(DBkeys.REMEMBER_ME) == true;
    }

    // roger start
    get companyMaster(): CompanyMaster {
        return this.localStorage.getDataObject<CompanyMaster>(DBkeys.COMPANY_MASTER);
    }

    get currencies(): Currency[] {
        return this.localStorage.getDataObject<Currency[]>(DBkeys.CURRENCIES) || [];
    }

    get standCurrency(): Currency {
        if (!this.currencies) { return null; }
        return this.currencies.find(c => c.primary);
    }
    // roger end
}