import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { ForgotPasswordComponent } from './forgot-password.component';

const routes = [
    {
        path     : 'auth/forgot-password',
        component: ForgotPasswordComponent
    }
];

@NgModule({
    declarations: [
        ForgotPasswordComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,

        FuseSharedModule,
    ]
})
export class ForgotPasswordModule
{
}
