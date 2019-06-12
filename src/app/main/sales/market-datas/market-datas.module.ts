import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { AuthGuard } from '@quick/services/auth-guard.service';

import { OliveSharedModule } from '../../../core/shared.module';
import { OliveMarketExcelsComponent } from './market-excel/market-excels.component';
import { OliveSearchMarketExcelComponent } from './market-excel/search-market-excel/search-market-excel.component';
import { OliveMarketItemMappingManagerModule } from './market-item-mapping/market-item-mapping-manager/market-item-mapping-manager.module';
import { OliveSearchMarketItemMappingComponent } from './market-item-mapping/search-market-item-mapping/search-market-item-mapping.component';
import { OliveMarketItemMappingsComponent } from './market-item-mapping/market-item-mappings.component';
import { OliveProductVariantLookupDialogModule } from 'app/main/productions/products/product-variant/product-variant-lookup-dialog/product-variant-lookup-dialog.module';
import { OliveMarketExcelImportDialogComponent } from './market-excel/market-excel-import-dialog/market-excel-import-dialog.component';
import { OliveMarketExcelRowsComponent } from './market-excel-row/market-excel-rows.component';
import { OliveSearchMarketExcelRowComponent } from './market-excel-row/search-market-excel-row/search-market-excel-row.component';
import { OliveMarketExcelRowManagerComponent } from './market-excel-row/market-excel-row-manager/market-excel-row-manager.component';

const routes = [
  {
    path: 'excels/list',
    component: OliveMarketExcelsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'excels/matches',
    component: OliveMarketItemMappingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'excels/matches/:id',
    component: OliveMarketItemMappingsComponent,
    canActivate: [AuthGuard]
  },    
  {
    path: 'excels/:id',
    component: OliveMarketExcelRowsComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule,
    OliveMarketItemMappingManagerModule,
    OliveProductVariantLookupDialogModule,
  ],
  declarations: [
    OliveMarketExcelsComponent,
    OliveSearchMarketExcelComponent,

    OliveMarketExcelRowsComponent,
    OliveSearchMarketExcelRowComponent,
    OliveMarketExcelRowManagerComponent,

    OliveMarketItemMappingsComponent,
    OliveSearchMarketItemMappingComponent,

    OliveMarketExcelImportDialogComponent
  ],
  providers: [],
  entryComponents: [
    OliveSearchMarketExcelComponent,
    
    OliveSearchMarketExcelRowComponent,
    OliveMarketExcelRowManagerComponent,

    OliveSearchMarketItemMappingComponent,

    OliveMarketExcelImportDialogComponent
  ]
})
export class OliveMarketDatasModule { }
