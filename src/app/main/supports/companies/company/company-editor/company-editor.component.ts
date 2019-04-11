import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AccountService } from '@quick/services/account.service';
import { Permission } from '@quick/models/permission.model';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { Company } from '../../models/company.model';
import { OliveLookupHostComponent } from 'app/core/components/entries/lookup-host/lookup-host.component';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveCompanyGroupService } from '../../services/company-group.service';
import { CompanyGroup } from '../../models/company-group.model';
import { OliveCompanyGroupManagerComponent } from '../../company-group/company-group-manager/company-group-manager.component';

@Component({
  selector: 'olive-company-editor',
  templateUrl: './company-editor.component.html',
  styleUrls: ['./company-editor.component.scss']
})
export class OliveCompanyEditorComponent extends OliveEntityFormComponent {
  @ViewChild('companyGroupFk') 
  lookupCompanyGroup: OliveLookupHostComponent;

  constructor(
    formBuilder: FormBuilder, translater: FuseTranslationLoaderService,
    private accountService: AccountService,
    private companyGroupService: OliveCompanyGroupService
  ) 
  {
    super(
      formBuilder, translater
    );
  }

  get companyGroupTitle() {
    return NavTranslates.Company.groupList;
  }

  getEditedItem(): any {
    const formModel = this.oForm.value;

    return this.itemWithIdNAudit({
      code: formModel.code,
      name: formModel.name,
      phoneNumber: formModel.phoneNumber,
      memo: formModel.memo,
      activated: formModel.activated,
      companyGroupFk: formModel.companyGroupFk,
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      id: '',
      code: ['', Validators.required],
      name: ['', Validators.required],
      phoneNumber: '',
      memo: '',
      activated: false,
      companyGroupFk: null
    });
  }

  resetForm() {
    this.oForm.reset({
      id: this.id36(this.item.id),
      code: this.item.code || '',
      name: this.item.name || '',
      phoneNumber: this.item.phoneNumber || '',
      memo: this.item.memo || '',
      activated: this.boolValue(this.item.activated),
      companyGroupFk: this.item.companyGroupFk,
    });
  }

  createEmptyObject() {
    return new Company();
  }

  markCustomControlsTouched() {
    this.lookupCompanyGroup.markAsTouched();   
  }

  get canAssignCompanyGroups() {
    return this.accountService.userHasPermission(Permission.assignCompanyGroups);
  }

  initializeChildComponent() {
    this.lookupCompanyGroup.setting = {
      name: 'CompanyGroup',
      columnType: 'id',
      dialogTitle: this.translater.get(NavTranslates.Company.list),
      dataService: this.companyGroupService,
      maxSelectItems: 1,
      newComponent: OliveCompanyGroupManagerComponent,
      itemType: CompanyGroup,
      managePermission: Permission.assignCompanyGroups,
      translateTitleId: NavTranslates.Company.groupList
    };
  }
}
