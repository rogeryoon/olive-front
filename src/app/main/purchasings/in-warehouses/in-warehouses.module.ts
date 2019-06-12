import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { AuthGuard } from '@quick/services/auth-guard.service';

import { OliveInWarehousesComponent } from './in-warehouse/in-warehouses.component';
import { OliveSharedModule } from 'app/core/shared.module';
import { OliveInWarehouseManagerModule } from './in-warehouse/in-warehouse-manager/in-warehouse-manager.module';
import { OliveSearchInWarehouseComponent } from './in-warehouse/search-in-warehouse/search-in-warehouse.component';
import { OliveInWarehouseService } from '../services/in-warehouse.service';
import { OliveInWarehouseEditorPageComponent } from './in-warehouse/in-warehouse-editor-page/in-warehouse-editor-page.component';
import { OliveInWarehouseEditorPageResolver } from '../services/in-warehouse-editor-page-resolver';
import { OliveInWarehouseItemService } from '../services/in-warehouse-items.service';

const routes = [
  {
    path: 'list',
    component: OliveInWarehousesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id',
    component: OliveInWarehouseEditorPageComponent,
    canActivate: [AuthGuard],
    resolve: { helps: OliveInWarehouseEditorPageResolver }
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
    OliveSearchInWarehouseComponent,
    OliveInWarehouseEditorPageComponent
  ],
  providers: [
    OliveInWarehouseEditorPageResolver
  ],
  entryComponents: [
    OliveSearchInWarehouseComponent
  ]
})
export class OliveInWarehousesModule { }
