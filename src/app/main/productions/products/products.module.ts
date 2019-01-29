import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { AuthGuard } from '@quick/services/auth-guard.service';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveProductsComponent } from './product/products.component';
import { OliveSearchProductComponent } from './product/search-product/search-product.component';
import { OliveProductService } from './services/product.service';
import { OliveProductVariantsComponent } from './product-variant/product-variants.component';
import { OliveSearchProductVariantComponent } from './product-variant/search-product-variant/search-product-variant.component';
import { OliveProductVariantService } from './services/product-variant.service';
import { OliveProductManagerModule } from './product/product-manager/product-manager.module';
import { OliveProductVariantManagerModule } from './product-variant/product-variant-manager/product-variant-manager.module';

const routes = [
  {
    path: 'group',
    component: OliveProductsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'variant',
    component: OliveProductVariantsComponent,
    canActivate: [AuthGuard]
  },  
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule,

    OliveProductManagerModule,
    OliveProductVariantManagerModule
  ],
  declarations: [
    OliveProductsComponent,
    OliveSearchProductComponent,

    OliveProductVariantsComponent,
    OliveSearchProductVariantComponent
  ],
  providers: [
    OliveProductService,
    OliveProductVariantService
  ],
  entryComponents: [
    OliveSearchProductComponent,
    OliveSearchProductVariantComponent
  ]
})
export class OliveProductsModule { }
