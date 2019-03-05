import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { AuthGuard } from '@quick/services/auth-guard.service';

import { OliveInWarehousesComponent } from './in-warehouse/in-warehouses.component';
import { OliveSharedModule } from 'app/core/shared.module';
import { OliveInWarehouseManagerModule } from './in-warehouse/in-warehouse-manager/in-warehouse-manager.module';
import { OliveSearchInWarehouseComponent } from './in-warehouse/search-in-warehouse/search-in-warehouse.component';
import { OliveInWarehouseService } from './in-warehouse/services/in-warehouse.service';

const routes = [
  {
    path: '',
    component: OliveInWarehousesComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule,

    OliveInWarehouseManagerModule
  ],
  declarations: [
    OliveInWarehousesComponent,
    OliveSearchInWarehouseComponent
  ],
  providers: [
    OliveInWarehouseService
  ],
  entryComponents: [
    OliveSearchInWarehouseComponent
  ]
})
export class OliveInWarehousesModule { }
