import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { AuthGuard } from '@quick/services/auth-guard.service';

import { OliveSharedModule } from '../../../core/shared.module';
import { OlivePurchaseOrdersComponent } from './purchase-order/purchase-orders.component';
import { OlivePurchaseOrderManagerComponent } from './purchase-order/purchase-order-manager/purchase-order-manager.component';
import { OlivePurchaseOrderEditorComponent } from './purchase-order/purchase-order-editor/purchase-order-editor.component';
import { OliveSearchPurchaseOrderComponent } from './purchase-order/search-purchase-order/search-purchase-order.component';
import { OlivePurchaseOrderService } from './services/purchase-order.service';
import { OlivePurchaseOrderEditorPageComponent } from './purchase-order/purchase-order-editor-page/purchase-order-editor-page.component';
import { OlivePurchaseOrderEditorPageResolver } from './services/purchase-order-editor-page-resolver';
import { OliveVendorService } from '../../supports/companies/services/vendor.service';
import { OliveWarehouseService } from '../../supports/companies/services/warehouse.service';
import { OlivePaymentMethodService } from '../../supports/companies/services/payment-method.service';
import { OlivePurchaseOrderPaymentsEditorComponent } from './purchase-order/purchase-order-payments-editor/purchase-order-payments-editor.component';
import { OlivePurchaseOrderItemsEditorComponent } from './purchase-order/purchase-order-items-editor/purchase-order-items-editor.component';
import { OliveProductVariantService } from 'app/main/productions/products/services/product-variant.service';
import { OliveProductVariantLookupDialogModule } from 'app/main/productions/products/product-variant/product-variant-lookup-dialog/product-variant-lookup-dialog.module';
import { OliveProductVariantManagerModule } from 'app/main/productions/products/product-variant/product-variant-manager/product-variant-manager.module';
import { OliveProductManagerModule } from 'app/main/productions/products/product/product-manager/product-manager.module';
import { OlivePurchasingMiscService } from './services/purchasing-misc.service';
import { OlivePreviewPurchaseOrderComponent } from './purchase-order/preview-purchase-order/preview-purchase-order.component';
import { OliveCompanyService } from 'app/main/supports/companies/services/company.service';
import { OliveInWarehouseStatusModule } from '../in-warehouses/in-warehouse/in-warehouse-status/in-warehouse-status.module';
import { OlivePurchaseOrderLookupDialogModule } from './purchase-order/purchase-order-lookup-dialog/purchase-order-lookup-dialog.module';
import { OliveInWarehouseItemService } from '../in-warehouses/services/in-warehouse-items.service';

const routes = [
  {
    path: 'list',
    component: OlivePurchaseOrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id',
    component: OlivePurchaseOrderEditorPageComponent,
    canActivate: [AuthGuard],
    resolve: { helps: OlivePurchaseOrderEditorPageResolver }
  }  
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule,

    OliveProductVariantLookupDialogModule,
    OliveProductVariantManagerModule,
    OliveProductManagerModule,
    OlivePurchaseOrderLookupDialogModule,
    OliveInWarehouseStatusModule
  ],
  declarations: [
    OlivePurchaseOrdersComponent,
    OlivePurchaseOrderManagerComponent,    
    OlivePurchaseOrderEditorComponent,
    OliveSearchPurchaseOrderComponent,
    OlivePurchaseOrderEditorPageComponent,
    OlivePurchaseOrderPaymentsEditorComponent,
    OlivePurchaseOrderItemsEditorComponent,
    OlivePreviewPurchaseOrderComponent
  ],
  providers: [
    OlivePurchaseOrderService,
    OlivePurchaseOrderEditorPageResolver,
    OliveVendorService,
    OliveWarehouseService,
    OlivePaymentMethodService,
    OliveProductVariantService,
    OlivePurchasingMiscService,
    OliveCompanyService,
    OliveInWarehouseItemService
  ],
  entryComponents: [
    OlivePurchaseOrderManagerComponent,
    OliveSearchPurchaseOrderComponent,
    OlivePreviewPurchaseOrderComponent
  ]
})
export class OlivePurchasesModule { }
