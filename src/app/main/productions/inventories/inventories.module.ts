import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { AuthGuard } from '@quick/services/auth-guard.service';

import { OliveSharedModule } from '../../../core/shared.module';
import { OliveInventoryService } from './services/inventory.service';
import { OliveInventoryEndpointService } from './services/inventory-endpoint.service';
import { OliveInventoryBalanceComponent } from './inventory-balance/inventory-balance.component';
import { OliveInventoryWarehouseComponent } from './inventory-warehouse/inventory-warehouse.component';
import { OliveInventoryHistoryComponent } from './inventory-history/inventory-history.component';

const routes = [
  {
      path     : 'balance',
      component: OliveInventoryBalanceComponent,
      canActivate: [AuthGuard]
  },
  {
    path     : 'warehouse',
    component: OliveInventoryWarehouseComponent,
    canActivate: [AuthGuard]
  },
  {
    path     : 'history',
    component: OliveInventoryHistoryComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule
  ],
  declarations: [
    OliveInventoryBalanceComponent,
    OliveInventoryWarehouseComponent,
    OliveInventoryHistoryComponent
  ],
  providers: [
    OliveInventoryService,
    OliveInventoryEndpointService,
    // OliveProductService,
    // OliveProductEndpointService
  ],
  entryComponents: [
    // OliveEditProductDialogComponent
  ]
})
export class OliveInventoriesModule { }
