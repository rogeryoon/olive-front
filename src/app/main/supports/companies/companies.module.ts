import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { AuthGuard } from '@quick/services/auth-guard.service';

import { OliveSharedModule } from '../../../core/shared.module';

import { OliveCompanyGroupsComponent } from './company-group/company-groups.component';
import { OliveCompanyGroupEditorComponent } from './company-group/company-group-editor/company-group-editor.component';
import { OliveCompanyGroupService } from './services/company-group.service';
import { OliveSearchCompanyGroupComponent } from './company-group/search-company-group/search-company-group.component';

import { OliveCompanyGroupManagerComponent } from './company-group/company-group-manager/company-group-manager.component';
import { OliveCompanyGroupSettingEditorComponent } from './company-group-setting/company-group-setting-editor/company-group-setting-editor.component';
import { OliveCompanyEditorComponent } from './company/company-editor/company-editor.component';
import { OliveCompanyManagerComponent } from './company/company-manager/company-manager.component';
import { OliveCompaniesComponent } from './company/companies.component';
import { OliveCompanyService } from './services/company.service';
import { OliveSearchCompanyComponent } from './company/search-company/search-company.component';
import { OliveVendorsComponent } from './vendor/vendors.component';
import { OliveVendorManagerComponent } from './vendor/vendor-manager/vendor-manager.component';
import { OliveVendorEditorComponent } from './vendor/vendor-editor/vendor-editor.component';
import { OliveSearchVendorComponent } from './vendor/search-vendor/search-vendor.component';
import { OliveVendorService } from './services/vendor.service';
import { OliveWarehousesComponent } from './warehouse/warehouses.component';
import { OliveWarehouseManagerComponent } from './warehouse/warehouse-manager/warehouse-manager.component';
import { OliveSearchWarehouseComponent } from './warehouse/search-warehouse/search-warehouse.component';
import { OliveWarehouseService } from './services/warehouse.service';
import { OliveWarehouseEditorComponent } from './warehouse/warehouse-editor/warehouse-editor.component';
import { OlivePaymentMethodManagerComponent } from './payment-method/payment-method-manager/payment-method-manager.component';
import { OliveSearchPaymentMethodComponent } from './payment-method/search-payment-method/search-payment-method.component';
import { OlivePaymentMethodService } from './services/payment-method.service';
import { OlivePaymentMethodEditorComponent } from './payment-method/payment-method-editor/payment-method-editor.component';
import { OlivePaymentMethodsComponent } from './payment-method/payment-methods.component';
import { OliveBranchesComponent } from './branch/branches.component';
import { OliveBranchManagerComponent } from './branch/branch-manager/branch-manager.component';
import { OliveBranchEditorComponent } from './branch/branch-editor/branch-editor.component';
import { OliveSearchBranchComponent } from './branch/search-branch/search-branch.component';
import { OliveBranchService } from './services/branch.service';
import { OliveCountryService } from '../bases/services/country.service';

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
    path: 'vendor',
    component: OliveVendorsComponent,
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
    OliveCompanyGroupsComponent,
    OliveCompanyGroupManagerComponent,
    OliveCompanyGroupEditorComponent,
    OliveSearchCompanyGroupComponent,

    OliveCompanyGroupSettingEditorComponent,

    OliveCompaniesComponent,
    OliveCompanyManagerComponent,    
    OliveCompanyEditorComponent,
    OliveSearchCompanyComponent,

    OliveVendorsComponent,
    OliveVendorManagerComponent,    
    OliveVendorEditorComponent,
    OliveSearchVendorComponent,

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
    OliveSearchBranchComponent    
  ],
  providers: [
    OliveCompanyGroupService,
    OliveCompanyService,
    OliveVendorService,
    OliveWarehouseService,
    OlivePaymentMethodService,
    OliveBranchService,
    OliveCountryService
  ],
  entryComponents: [
    OliveCompanyGroupManagerComponent,
    OliveSearchCompanyGroupComponent,

    OliveCompanyManagerComponent,
    OliveSearchCompanyComponent,

    OliveVendorManagerComponent,    
    OliveSearchVendorComponent,

    OliveWarehouseManagerComponent,    
    OliveSearchWarehouseComponent,
    
    OlivePaymentMethodManagerComponent,    
    OliveSearchPaymentMethodComponent,
    
    OliveBranchManagerComponent,    
    OliveSearchBranchComponent  
  ]
})
export class OliveCompaniesModule { }
