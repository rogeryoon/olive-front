import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { AuthGuard } from '@quick/services/auth-guard.service';

import { OliveSharedModule } from 'app/core/shared.module';
import { OliveProductsComponent } from './product/products.component';
import { OliveProductManagerComponent } from './product/product-manager/product-manager.component';
import { OliveProductEditorComponent } from './product/product-editor/product-editor.component';
import { OliveSearchProductComponent } from './product/search-product/search-product.component';
import { OliveProductService } from './services/product.service';
import { OliveProductClassEditorComponent } from './product/product-class-editor/product-class-editor.component';
import { OliveProductVariantsComponent } from './product-variant/product-variants.component';
import { OliveProductVariantManagerComponent } from './product-variant/product-variant-manager/product-variant-manager.component';
import { OliveProductVariantEditorComponent } from './product-variant/product-variant-editor/product-variant-editor.component';
import { OliveSearchProductVariantComponent } from './product-variant/search-product-variant/search-product-variant.component';
import { OliveProductVariantService } from './services/product-variant.service';

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

    OliveSharedModule
  ],
  declarations: [
    OliveProductsComponent,
    OliveProductManagerComponent,    
    OliveProductEditorComponent,
    OliveSearchProductComponent,
    OliveProductClassEditorComponent,

    OliveProductVariantsComponent,
    OliveProductVariantManagerComponent,    
    OliveProductVariantEditorComponent,
    OliveSearchProductVariantComponent 
  ],
  providers: [
    OliveProductService,
    OliveProductVariantService
  ],
  entryComponents: [
    OliveProductManagerComponent,    
    OliveSearchProductComponent,
    OliveProductVariantManagerComponent,    
    OliveSearchProductVariantComponent  
  ]
})
export class OliveProductsModule { }
