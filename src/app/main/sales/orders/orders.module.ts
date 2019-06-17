import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { AuthGuard } from '@quick/services/auth-guard.service';

import { OliveSharedModule } from '../../../core/shared.module';
import { OliveOrderShipOutManagerModule } from './order-ship-out/order-ship-out-manager/order-ship-out-manager.module';
import { OliveOrderShipOutsComponent } from './order-ship-out/order-ship-outs.component';
import { OliveSearchOrderShipOutComponent } from './order-ship-out/search-order-ship-out/search-order-ship-out.component';

const routes = [
  {
    path: 'list',
    component: OliveOrderShipOutsComponent,
    canActivate: [AuthGuard]
  }, 
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule,
    OliveOrderShipOutManagerModule
  ],
  declarations: [
    OliveOrderShipOutsComponent,
    OliveSearchOrderShipOutComponent
  ],
  providers: [],
  entryComponents: [
    OliveSearchOrderShipOutComponent   
  ]
})
export class OliveOrdersModule { }
