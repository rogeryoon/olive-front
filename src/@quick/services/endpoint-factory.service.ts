import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { throwError } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import { AuthService } from './auth.service';
import { ConfigurationService } from './configuration.service';

// added by roger 18-04-29
// Error : Property 'switchMap' does not exist on type 'Subject<any>'. 
import 'rxjs/add/operator/switchMap';

@Injectable()
export class EndpointFactory {
    static readonly apiVersion: string = '1';

    private readonly _loginUrl: string = '/connect/token';

    private get loginUrl() { return this.configurations.baseUrl + this._loginUrl; }

    private taskPauser: Subject<any>;
    private isRefreshingLogin: boolean;

    private _authService: AuthService;

    private get authService() {
        if (!this._authService) {
            this._authService = this.injector.get(AuthService);
        }

        return this._authService;
    }

    constructor(protected http: HttpClient, protected configurations: ConfigurationService, private injector: Injector) { }

    getLoginEndpoint<T>(userName: string, password: string): Observable<T> {

        const header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

        const params = new HttpParams()
            .append('username', userName)
            .append('password', password)
            .append('client_id', 'oliveapp_spa')
            .append('grant_type', 'password')
            .append('scope', 'openid email phone profile offline_access roles oliveapp_api');

        return this.http.post<T>(this.loginUrl, params, { headers: header });
    }

    getPreLoadDataEndpoint<T>(): Observable<T> {
        const endpointUrl = this.configurations.baseUrl + '/api/chunkdatas/preload';
         
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getPreLoadDataEndpoint());
            });
    }

    getRefreshLoginEndpoint<T>(): Observable<T> {
        const header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

        const params = new HttpParams()
            .append('refresh_token', this.authService.refreshToken)
            .append('client_id', 'oliveapp_spa')
            .append('grant_type', 'refresh_token');

        /* Modified by roger 18-04-29
        Original source
        return this.http.post<T>(this.loginUrl, params, { headers: header })
            .catch(error => {
                return this.handleError(error, () => this.getRefreshLoginEndpoint());
            });
        */

        return <any>this.http.post<T>(this.loginUrl, params, { headers: header })
            .catch(error => {
                return this.handleError(error, () => this.getRefreshLoginEndpoint());
            });
    }

    protected getRequestHeaders(): { headers: HttpHeaders | { [header: string]: string | string[]; } } {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.authService.accessToken,
            'Content-Type': 'application/json',
            'Accept': `application/vnd.iman.v${EndpointFactory.apiVersion}+json, application/json, text/plain, */*`,
            'App-Version': ConfigurationService.appVersion
        });

        return { headers: headers };
    }

    protected handleError(error, continuation: () => Observable<any>) {
        if (error.status === 401) {
            if (this.isRefreshingLogin) {
                return this.pauseTask(continuation);
            }

            this.isRefreshingLogin = true;

            return this.authService.refreshLogin()
                .mergeMap(data => {
                    this.isRefreshingLogin = false;
                    this.resumeTasks(true);

                    return continuation();
                })
                .catch(refreshLoginError => {
                    this.isRefreshingLogin = false;
                    this.resumeTasks(false);

                    if (refreshLoginError.status === 401 || (refreshLoginError.url && refreshLoginError.url.toLowerCase().includes(this.loginUrl.toLowerCase()))) {
                        this.authService.reLogin();
                        return throwError('session expired');
                    }
                    else {
                        return throwError(refreshLoginError || 'server error');
                    }
                });
        }

        if (error.url && error.url.toLowerCase().includes(this.loginUrl.toLowerCase())) {
            this.authService.reLogin();

            return throwError((error.error && error.error.error_description) ? `session expired (${error.error.error_description})` : 'session expired');
        }
        else {
            return throwError(error);
        }
    }

    private pauseTask(continuation: () => Observable<any>) {
        if (!this.taskPauser) {
            this.taskPauser = new Subject();
        }

        return this.taskPauser.switchMap(continueOp => {
            return continueOp ? continuation() : throwError('session expired');
        });
    }

    private resumeTasks(continueOp: boolean) {
        setTimeout(() => {
            if (this.taskPauser) {
                this.taskPauser.next(continueOp);
                this.taskPauser.complete();
                this.taskPauser = null;
            }
        });
    }
}
