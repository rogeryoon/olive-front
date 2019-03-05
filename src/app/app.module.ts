import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule, MatIconModule, MatDialogModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { ToastyModule} from 'ng2-toasty';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { Error404Component } from './main/pages/errors/404/error-404.component';
import { OliveAppConfigService } from './core/services/AppConfig.service';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { AuthService } from '@quick/services/auth.service';
import { AuthGuard } from '@quick/services/auth-guard.service';
import { ConfigurationService } from '@quick/services/configuration.service';
import { LocalStoreManager } from '@quick/services/local-store-manager.service';
import { AppTranslationService } from '@quick/services/app-translation.service';
import { EndpointFactory } from '@quick/services/endpoint-factory.service';
import { AlertService } from '@quick/services/alert.service';
import { AccountService } from '@quick/services/account.service';
import { AccountEndpoint } from '@quick/services/account-endpoint.service';
import { OliveNavigationSelectorService } from './core/services/navigation-selector.service';
import { Error404Module } from './main/pages/errors/404/error-404.module';
import { OliveSharedModule } from './core/shared.module';
import { LoginModule } from './main/pages/authentication/login/login.module';

const appRoutes: Routes = [
    {
        path: '',
        loadChildren: './main/pages/home/home.module#OliveHomeModule',
        pathMatch: 'full'
    },
    {
        path: 'inventories',
        loadChildren: './main/productions/inventories/inventories.module#OliveInventoriesModule'
    },
    {
        path: 'products',
        loadChildren: './main/productions/products/products.module#OliveProductsModule'
    },
    {
        path: 'companies',
        loadChildren: './main/supports/companies/companies.module#OliveCompaniesModule'
    },
    {
        path: 'bases',
        loadChildren: './main/supports/bases/bases.module#OliveBasesModule'
    },
    {
        path: 'purchases',
        loadChildren: './main/purchasings/purchases/purchases.module#OlivePurchasesModule'
    },
    {
        path: 'inwarehouses',
        loadChildren: './main/purchasings/in-warehouses/in-warehouses.module#OliveInWarehousesModule'
    },    
    {
        path: 'configs',
        loadChildren: './main/configs/configs.module#OliveConfigsModule'
    },
    {
        path: 'pages',
        loadChildren: './main/pages/pages.module#FusePagesModule'
    },
    {
        path: '404',
        component: Error404Component
    },
    {
        path: '**',
        redirectTo: '404'
    }
];

const appInitializerFn = (appConfig: OliveAppConfigService) => {
    return () => {
        return appConfig.loadAppConfig();
    };
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,

        RouterModule.forRoot(appRoutes),
        TranslateModule.forRoot(),
        DeviceDetectorModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatDialogModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,

        Error404Module,

        ToastyModule.forRoot(),

        OliveSharedModule,
        LoginModule
    ],
    providers: [
        AuthService,
        AuthGuard,
        ConfigurationService,
        LocalStoreManager,
        AppTranslationService,
        EndpointFactory,
        AlertService,
        AccountService,
        AccountEndpoint,
        OliveNavigationSelectorService,
        OliveAppConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFn,
            multi: true,
            deps: [OliveAppConfigService]
        }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule
{
    constructor(private injector: Injector) {
        AppInjector = this.injector;
    }
}
export let AppInjector: Injector;
