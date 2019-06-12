import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { AuthGuard } from '@quick/services/auth-guard.service';

import { OliveSharedModule } from '../../../core/shared.module';
import { OlivePurchaseOrdersComponent } from './purchase-order/purchase-orders/purchase-orders.component';
import { OliveSearchPurchaseOrderComponent } from './purchase-order/search-purchase-order/search-purchase-order.component';
import { OlivePurchaseOrderEditorPageComponent } from './purchase-order/purchase-order-editor-page/purchase-order-editor-page.component';
import { OlivePurchaseOrderEditorPageResolver } from '../services/purchase-order-editor-page-resolver';
import { OliveProductVariantLookupDialogModule } from 'app/main/productions/products/product-variant/product-variant-lookup-dialog/product-variant-lookup-dialog.module';
import { OliveProductVariantManagerModule } from 'app/main/productions/products/product-variant/product-variant-manager/product-variant-manager.module';
import { OliveProductManagerModule } from 'app/main/productions/products/product/product-manager/product-manager.module';
import { OlivePreviewPurchaseOrderComponent } from './purchase-order/preview-purchase-order/preview-purchase-order.component';
import { OliveInWarehouseStatusModule } from '../in-warehouses/in-warehouse/in-warehouse-status/in-warehouse-status.module';
import { OlivePurchaseOrderLookupDialogModule } from './purchase-order/purchase-order-lookup-dialog/purchase-order-lookup-dialog.module';
import { OliveInWarehousePendingComponent } from './purchase-order/in-warehouse-pendings/in-warehouse-pendings.component';
import { OliveInWarehouseManagerModule } from '../in-warehouses/in-warehouse/in-warehouse-manager/in-warehouse-manager.module';
import { OliveInWarehouseEditorPageResolver } from '../services/in-warehouse-editor-page-resolver';
import { OliveSearchVoidPurchaseOrderComponent } from './void-purchase-order/search-void-purchase-order/search-void-purchase-order.component';
import { OliveVoidPurchaseOrderEditorPageComponent } from './void-purchase-order/void-purchase-order-editor-page/void-purchase-order-editor-page.component';
import { OliveVoidPurchaseOrdersComponent } from './void-purchase-order/void-purchase-orders.component';
import { OliveVoidPurchaseOrderManagerModule } from './void-purchase-order/void-purchase-order-manager/void-purchase-order-manager.module';
import { OlivePurchaseOrderManagerModule } from './purchase-order/purchase-order-manager/purchase-order-manager.module';

const routes = [
  {
    path: 'list',
    component: OlivePurchaseOrdersComponent,
    canActivate: [AuthGuard],
    data: {'someData': 'test'}
  },
  {
    path: 'pending',
    component: OliveInWarehousePendingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cancel/list',
    component: OliveVoidPurchaseOrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cancel/:id',
    component: OliveVoidPurchaseOrderEditorPageComponent,
    canActivate: [AuthGuard],
    resolve: { item: OliveInWarehouseEditorPageResolver }
  },
  {
    path: ':id',
    component: OlivePurchaseOrderEditorPageComponent,
    canActivate: [AuthGuard],
    resolve: { item: OlivePurchaseOrderEditorPageResolver }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule,

    OliveProductVariantLookupDialogModule,
    OlivePurchaseOrderLookupDialogModule,

    OliveInWarehouseStatusModule,
    
    OliveProductVariantManagerModule,
    OliveProductManagerModule,    
    OliveInWarehouseManagerModule,
    OliveVoidPurchaseOrderManagerModule,
    OlivePurchaseOrderManagerModule
  ],
  declarations: [
    OlivePurchaseOrdersComponent,
    OliveSearchPurchaseOrderComponent,
    OlivePurchaseOrderEditorPageComponent,

    OliveVoidPurchaseOrdersComponent,
    OliveSearchVoidPurchaseOrderComponent,
    OliveVoidPurchaseOrderEditorPageComponent,

    OlivePreviewPurchaseOrderComponent,
    OliveInWarehousePendingComponent,
  ],
  providers: [],
  entryComponents: [
    OliveSearchPurchaseOrderComponent,
    OlivePreviewPurchaseOrderComponent,
    OliveSearchVoidPurchaseOrderComponent
  ]
})
export class OlivePurchasesModule { }
