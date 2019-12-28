import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { Warehouse } from '../../../models/warehouse.model';
import { OliveCompanyService } from '../../../services/company.service';
import { OliveLookupHostComponent } from 'app/core/components/entries/lookup-host/lookup-host.component';
import { OliveCompanyGroupManagerComponent } from '../../company-group/company-group-manager/company-group-manager.component';
import { Company } from '../../../models/company.model';
import { Permission } from '@quick/models/permission.model';
import { OliveBranchManagerComponent } from '../../branch/branch-manager/branch-manager.component';
import { Branch } from '../../../models/branch.model';
import { OliveBranchService } from '../../../services/branch.service';
import { AccountService } from '@quick/services/account.service';
import { requiredValidator } from 'app/core/validators/general-validators';

@Component({
  selector: 'olive-warehouse-editor',
  templateUrl: './warehouse-editor.component.html',
  styleUrls: ['./warehouse-editor.component.scss']
})
export class OliveWarehouseEditorComponent extends OliveEntityFormComponent {
  @ViewChild('company') 
  lookupCompany: OliveLookupHostComponent;

  @ViewChild('branch') 
  lookupBranch: OliveLookupHostComponent;

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private companyService: OliveCompanyService,
    private branchService: OliveBranchService,
    private accountService: AccountService
  ) {
    super(
      formBuilder, translator
    );
  }

  getEditedItem(): any {
    const formModel = this.oFormValue;

    return this.itemWithIdNAudit({
      code: formModel.code,
      name: formModel.name,
      companyId: formModel.companyFk.id,
      companyMasterBranchId: formModel.companyMasterBranchFk.id,
      activated: formModel.activated
    } as Warehouse);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      code: ['', requiredValidator()],
      name: ['', requiredValidator()],
      companyFk: null,
      companyMasterBranchFk: null,
      activated: false
    });
  }

  resetForm() {
    this.oForm.reset({
      code: this.item.code || '',
      name: this.item.name || '',
      companyFk: this.item.companyFk || '',
      companyMasterBranchFk: this.item.companyMasterBranchFk || '',
      activated: this.boolValue(this.item.activated),
    });
  }

  createEmptyObject() {
    return new Warehouse();
  }

  initializeChildComponent() {
    this.lookupCompany.setting = {
      columnType: 'code',
      itemTitle: this.translator.get(NavTranslates.Company.list),
      dataService: this.companyService,
      maxSelectItems: 1,
      newComponent: OliveCompanyGroupManagerComponent,
      itemType: Company,
      managePermission: Permission.assignCompanyGroups,
      translateTitleId: NavTranslates.Company.list
    };

    this.lookupBranch.setting = {
      columnType: 'code',
      itemTitle: this.translator.get(NavTranslates.Company.branch),
      dataService: this.branchService,
      maxSelectItems: 1,
      newComponent: OliveBranchManagerComponent,
      itemType: Branch,
      managePermission: Permission.assignCompanyGroups,
      translateTitleId: NavTranslates.Company.branch
    };    
  }

  markCustomControlsTouched() {
    this.lookupCompany.markAsTouched();   
    this.lookupBranch.markAsTouched(); 
  }

  get canAssignCompanyGroups() {
    return this.accountService.userHasPermission(Permission.assignCompanyGroups);
  }
}
