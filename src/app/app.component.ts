import { Component, Inject, OnDestroy, OnInit, Renderer2, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { String } from 'typescript-string-operations';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as navigationEnglish } from './core/i18n/en';
import { AuthService } from '@quick/services/auth.service';
import { AlertService, MessageSeverity, AlertMessage } from '@quick/services/alert.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { OliveNavigationSelectorService } from './core/services/navigation-selector.service';
import { OliveLoginDialogComponent } from './main/pages/authentication/login/login-dialog/login-dialog.component';
import { OliveAppDialogComponent } from './core/components/dialogs/app-dialog/app-dialog.component';

@Component({
    selector   : 'app',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy
{
    fuseConfig: any;
    navigation: any;
    // Private
    private _unsubscribeAll: Subject<any>;

    // roger start
    navigationChangingWatcher: Subscription;

    isAppLoaded: boolean;
    isUserLoggedIn: boolean;
    stickyToasties: number[] = [];
    // roger end


    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {Platform} _platform
     * @param {TranslateService} _translateService
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _platform: Platform,

        private toastyService: ToastyService,
        private toastyConfig: ToastyConfig,
        private authService: AuthService,
        private alertService: AlertService,
        public dialog: MatDialog,
        public router: Router,
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        private navigationSelector: OliveNavigationSelectorService
    )
    {
        //#region Roger
        // Get default navigation
        this.navigation = navigationSelector.getNavigation();

        this.toastyConfig.theme = 'material';
        this.toastyConfig.position = 'top-right';
        this.toastyConfig.limit = 100;
        this.toastyConfig.showClose = true;
        //#endregion Roger

        // Register the navigation to the service
        this._fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');

        // Add languages
        this._translateService.addLangs(['en'/*, 'tr'*/]);

        // Set the default language
        this._translateService.setDefaultLang('en');

        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(navigationEnglish/*, navigationTurkish*/);

        // Use a language
        this._translateService.use('en');

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix Start
         * ----------------------------------------------------------------------------------------------------
         */

        /**
         * If you are using a language other than the default one, i.e. Turkish in this case,
         * you may encounter an issue where some of the components are not actually being
         * translated when your app first initialized.
         *
         * This is related to ngxTranslate module and below there is a temporary fix while we
         * are moving the multi language implementation over to the Angular's core language
         * service.
         **/

        // Set the default language to 'en' and then back to 'tr'.
        // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
        // been selected and there is no way to force it, so we overcome the issue by switching
        // the default language back and forth.
        /**
         setTimeout(() => {
            this._translateService.setDefaultLang('en');
            this._translateService.setDefaultLang('tr');
         });
         */

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix End
         * ----------------------------------------------------------------------------------------------------
         */

        // Add is-mobile class to the body if the platform is mobile
        if ( this._platform.ANDROID || this._platform.IOS )
        {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {

                this.fuseConfig = config;

                // Boxed
                if ( this.fuseConfig.layout.width === 'boxed' )
                {
                    this.document.body.classList.add('boxed');
                }
                else
                {
                    this.document.body.classList.remove('boxed');
                }

                // Color theme - Use normal for loop for IE11 compatibility
                for ( let i = 0; i < this.document.body.classList.length; i++ )
                {
                    const className = this.document.body.classList[i];

                    if ( className.startsWith('theme-') )
                    {
                        this.document.body.classList.remove(className);
                    }
                }

                this.document.body.classList.add(this.fuseConfig.colorTheme);
            });

        //#region Roger
        this.navigationChangingWatcher =
            this.navigationSelector.onNavigationChanged.subscribe(
                (navigation) => {
                    this.navigation = navigation;
                }
            );

        this.isUserLoggedIn = this.authService.isLoggedIn;

        // 1 sec to ensure all the effort to get the css animation working is appreciated :|
        setTimeout(() => this.isAppLoaded = true, 1000);

        setTimeout(() => {
            if (this.isUserLoggedIn) {
                this.alertService.resetStickyMessage();
                this.alertService.showMessage(
                    this._fuseTranslationLoaderService.get('common.title.login'), 
                    String.Format(this._fuseTranslationLoaderService.get('common.message.welcomeTemplate'), this.userName), 
                    MessageSeverity.default);
            }
        }, 2000);

        this.alertService.getDialogEvent().subscribe(alert => this.dialog.open(OliveAppDialogComponent,
            {
                data: alert,
                panelClass: 'mat-dialog-sm'
            }));
        this.alertService.getMessageEvent().subscribe(message => this.showToast(message, false));
        this.alertService.getStickyMessageEvent().subscribe(message => this.showToast(message, true));

        // this.authService.reLoginDelegate = () => this.showLoginDialog();
        // 2019.1.9 PopUp Login 문제로 Disable 한다.        
        //#endregion Roger
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        //#region Roger
        if (this.navigationChangingWatcher) {
            this.navigationChangingWatcher.unsubscribe();
        }
        //#endregion Roger
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    //#region Roger
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : '';
    }

    addClass(className: string) {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    }

    removeClass(className: string) {
        this._renderer.removeClass(this._elementRef.nativeElement, className);
    }

    showLoginDialog(): void {
        const title = this._fuseTranslationLoaderService.get('common.title.sessionExpired');
        this.alertService.showStickyMessage(title, this._fuseTranslationLoaderService.get('common.message.reLogin'), MessageSeverity.info);

        const dialogRef = this.dialog.open(OliveLoginDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            this.alertService.resetStickyMessage();

            if (!result || this.authService.isSessionExpired) {
                this.authService.logout();
                this.router.navigateByUrl('/pages/auth/login');
                this.alertService.showStickyMessage(title, this._fuseTranslationLoaderService.get('common.message.renewSession'), MessageSeverity.warn);
            }
        });
    }

    showToast(message: AlertMessage, isSticky: boolean) {
        if (message == null) {
            for (const id of this.stickyToasties.slice(0)) {
                this.toastyService.clear(id);
            }

            return;
        }

        const toastOptions: ToastOptions = {
            title: message.summary,
            msg: message.detail,
            timeout: isSticky ? 0 : 4000
        };

        if (isSticky) {
            toastOptions.onAdd = (toast: ToastData) => this.stickyToasties.push(toast.id);

            toastOptions.onRemove = (toast: ToastData) => {
                const index = this.stickyToasties.indexOf(toast.id, 0);

                if (index > -1) {
                    this.stickyToasties.splice(index, 1);
                }

                toast.onAdd = null;
                toast.onRemove = null;
            };
        }

        switch (message.severity) {
            case MessageSeverity.default: this.toastyService.default(toastOptions); break;
            case MessageSeverity.info: this.toastyService.info(toastOptions); break;
            case MessageSeverity.success: this.toastyService.success(toastOptions); break;
            case MessageSeverity.error: this.toastyService.error(toastOptions); break;
            case MessageSeverity.warn: this.toastyService.warning(toastOptions); break;
            case MessageSeverity.wait: this.toastyService.wait(toastOptions); break;
        }
    }    
    //#endregion Roger
}
