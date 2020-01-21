import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { AuthGuard } from '@quick/services/auth-guard.service';

import { OliveSharedModule } from '../../../core/shared.module';
import { OliveOrderShipOutManagerModule } from './order-ship-out/order-ship-out-manager/order-ship-out-manager.module';
import { OliveOrderShipOutsComponent } from './order-ship-out/order-ship-outs.component';
import { OliveSearchOrderShipOutComponent } from './order-ship-out/search-order-ship-out/search-order-ship-out.component';
import { OliveProductVariantLookupDialogModule } from 'app/main/productions/products/product-variant/product-variant-lookup-dialog/product-variant-lookup-dialog.module';
import { OliveOrderShipOutPackageListerPageComponent } from './order-ship-out-package-lister/order-ship-out-package-lister-page/order-ship-out-package-lister-page.component';
import { OliveOrderShipOutPackageListerModule } from './order-ship-out-package-lister/order-ship-out-package-lister-manager/order-ship-out-package-lister-manager.module';
import { OliveWarehouseResolverService } from 'app/main/supports/services/warehouse-resolver.service';
import { OliveMarketSellerResolverService } from 'app/main/supports/services/market-seller-resolver.service';

const routes = [
  {
    path: 'list',
    component: OliveOrderShipOutsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ship-out-package-lister',
    component: OliveOrderShipOutPackageListerPageComponent,
    canActivate: [AuthGuard],
    resolve: { 
      warehouses: OliveWarehouseResolverService, 
      marketSellers: OliveMarketSellerResolverService 
    }  
  }, 
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule,

    OliveOrderShipOutManagerModule,
    OliveProductVariantLookupDialogModule,
    OliveOrderShipOutPackageListerModule
  ],
  declarations: [
    OliveOrderShipOutsComponent,
    OliveSearchOrderShipOutComponent,
    OliveOrderShipOutPackageListerPageComponent,
  ],
  providers: [],
  entryComponents: [
    OliveSearchOrderShipOutComponent,
  ]
})
export class OliveOrdersModule { }
