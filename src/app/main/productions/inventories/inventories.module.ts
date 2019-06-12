import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { AuthGuard } from '@quick/services/auth-guard.service';

import { OliveSharedModule } from '../../../core/shared.module';
import { OliveInventoryBalancesComponent } from './inventory-balances/inventory-balances.component';
import { OliveInventoryWarehousesComponent } from './inventory-warehouses/inventory-warehouses.component';
import { OliveInventoryHistoriesComponent } from './inventory-histories/inventory-histories.component';
import { OliveInventoryBalanceSaveComponent } from './inventory-balance-save/inventory-balance-save.component';
import { OliveInventoryResolverService } from '../services/inventory-resolver.service';

const routes = [
  {
    path     : 'history',
    component: OliveInventoryBalanceSaveComponent,
    canActivate: [AuthGuard]
  },  
  {
      path     : 'balance',
      component: OliveInventoryBalancesComponent,
      canActivate: [AuthGuard]
  },
  {
    path     : 'warehouse',
    component: OliveInventoryWarehousesComponent,
    canActivate: [AuthGuard],
    resolve: { warehouses: OliveInventoryResolverService }    
  },
  {
    path     : 'history-old',
    component: OliveInventoryHistoriesComponent,
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
    OliveInventoryBalanceSaveComponent,
    OliveInventoryBalancesComponent,
    OliveInventoryWarehousesComponent,
    OliveInventoryHistoriesComponent
  ],
  providers: [],
  entryComponents: []
})
export class OliveInventoriesModule { }
