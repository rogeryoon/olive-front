import { NgModule } from '@angular/core';

import { LoginModule } from './authentication/login/login.module';
import { ForgotPasswordModule } from './authentication/forgot-password/forgot-password.module';
import { Error404Module } from './errors/404/error-404.module';
import { MaintenanceModule } from './maintenance/maintenence.module';
import { OliveHomeModule } from './home/home.module';

@NgModule({
    imports: [
        // Auth
        LoginModule,
        ForgotPasswordModule,

        // Errors
        Error404Module,

        // Maintenance
        MaintenanceModule,

        OliveHomeModule
    ]
})
export class FusePagesModule
{

}
