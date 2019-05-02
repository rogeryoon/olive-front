import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { OliveLoginComponent } from './login/login.component';
import { OliveLoginDialogComponent } from './login-dialog/login-dialog.component';
import { OliveLoginControlComponent } from './login-control/login-control.component';
import { OliveSharedModule } from 'app/core/shared.module';

const routes = [
    {
        path     : 'auth/login',
        component: OliveLoginComponent
    }
];

@NgModule({
    declarations: [
        OliveLoginComponent,
        OliveLoginDialogComponent,
        OliveLoginControlComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule.forChild(),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,

        FuseSharedModule,

        OliveSharedModule
    ],
    exports: [
        OliveLoginDialogComponent
    ],
    providers: [],
    entryComponents : [
        OliveLoginDialogComponent
    ]
})
export class LoginModule
{
}
