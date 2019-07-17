import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { AuthGuard } from '@quick/services/auth-guard.service';

import { OliveSharedModule } from '../../../core/shared.module';

import { OliveCompanyGroupsComponent } from './company-group/company-groups.component';
import { OliveCompanyGroupEditorComponent } from './company-group/company-group-editor/company-group-editor.component';
import { OliveSearchCompanyGroupComponent } from './company-group/search-company-group/search-company-group.component';
import { OliveCompanyGroupManagerComponent } from './company-group/company-group-manager/company-group-manager.component';
import { OliveCompanyGroupSettingEditorComponent } from './company-group-setting/company-group-setting-editor/company-group-setting-editor.component';
import { OliveCompanyEditorComponent } from './company/company-editor/company-editor.component';
import { OliveCompanyManagerComponent } from './company/company-manager/company-manager.component';
import { OliveCompaniesComponent } from './company/companies.component';
import { OliveSearchCompanyComponent } from './company/search-company/search-company.component';
import { OliveSuppliersComponent } from './supplier/suppliers.component';
import { OliveSupplierManagerComponent } from './supplier/supplier-manager/supplier-manager.component';
import { OliveSearchSupplierComponent } from './supplier/search-supplier/search-supplier.component';
import { OliveWarehousesComponent } from './warehouse/warehouses.component';
import { OliveWarehouseManagerComponent } from './warehouse/warehouse-manager/warehouse-manager.component';
import { OliveSearchWarehouseComponent } from './warehouse/search-warehouse/search-warehouse.component';
import { OliveWarehouseEditorComponent } from './warehouse/warehouse-editor/warehouse-editor.component';
import { OlivePaymentMethodManagerComponent } from './payment-method/payment-method-manager/payment-method-manager.component';
import { OliveSearchPaymentMethodComponent } from './payment-method/search-payment-method/search-payment-method.component';
import { OlivePaymentMethodEditorComponent } from './payment-method/payment-method-editor/payment-method-editor.component';
import { OlivePaymentMethodsComponent } from './payment-method/payment-methods.component';
import { OliveBranchesComponent } from './branch/branches.component';
import { OliveBranchManagerComponent } from './branch/branch-manager/branch-manager.component';
import { OliveBranchEditorComponent } from './branch/branch-editor/branch-editor.component';
import { OliveSearchBranchComponent } from './branch/search-branch/search-branch.component';
import { OliveSupplierEditorComponent } from './supplier/supplier-editor/supplier-editor.component';
import { OliveMarketsComponent } from './market/markets.component';
import { OliveSearchMarketComponent } from './market/search-market/search-market.component';
import { OliveMarketManagerModule } from './market/market-manager/market-manager.module';
import { OliveMarketSellersComponent } from './market-seller/market-sellers.component';
import { OliveMarketSellerManagerModule } from './market-seller/market-seller-manager/market-seller-manager.module';
import { OliveSearchMarketSellerComponent } from './market-seller/search-market-seller/search-market-seller.component';

const routes = [
  {
    path: 'list',
    component: OliveCompaniesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'groups',
    component: OliveCompanyGroupsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'branch',
    component: OliveBranchesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'supplier',
    component: OliveSuppliersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'warehouse',
    component: OliveWarehousesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'payment-method',
    component: OlivePaymentMethodsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'groups/:companyGroupId',
    component: OliveCompanyGroupsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'market',
    component: OliveMarketsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'market-seller',
    component: OliveMarketSellersComponent,
    canActivate: [AuthGuard]
  },      
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    TranslateModule.forChild(),

    OliveSharedModule,
    OliveMarketManagerModule,
    OliveMarketSellerManagerModule
  ],
  declarations: [
    OliveCompanyGroupsComponent,
    OliveCompanyGroupManagerComponent,
    OliveCompanyGroupEditorComponent,
    OliveSearchCompanyGroupComponent,

    OliveCompanyGroupSettingEditorComponent,

    OliveCompaniesComponent,
    OliveCompanyManagerComponent,    
    OliveCompanyEditorComponent,
    OliveSearchCompanyComponent,

    OliveSuppliersComponent,
    OliveSupplierManagerComponent,    
    OliveSupplierEditorComponent,
    OliveSearchSupplierComponent,

    OliveWarehousesComponent,
    OliveWarehouseManagerComponent,    
    OliveWarehouseEditorComponent,
    OliveSearchWarehouseComponent,

    OlivePaymentMethodsComponent,
    OlivePaymentMethodManagerComponent,    
    OlivePaymentMethodEditorComponent,
    OliveSearchPaymentMethodComponent,

    OliveBranchesComponent,
    OliveBranchManagerComponent,    
    OliveBranchEditorComponent,
    OliveSearchBranchComponent,

    OliveMarketsComponent,
    OliveSearchMarketComponent,

    OliveMarketSellersComponent,
    OliveSearchMarketSellerComponent
  ],
  exports: [
  ],
  providers: [],
  entryComponents: [
    OliveCompanyGroupManagerComponent,
    OliveSearchCompanyGroupComponent,

    OliveCompanyManagerComponent,
    OliveSearchCompanyComponent,

    OliveSupplierManagerComponent,    
    OliveSearchSupplierComponent,

    OliveWarehouseManagerComponent,    
    OliveSearchWarehouseComponent,
    
    OlivePaymentMethodManagerComponent,    
    OliveSearchPaymentMethodComponent,
    
    OliveBranchManagerComponent,    
    OliveSearchBranchComponent,

    OliveSearchMarketComponent,

    OliveSearchMarketSellerComponent
  ]
})
export class OliveCompaniesModule { }
