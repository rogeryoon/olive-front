import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AccountService } from '@quick/services/account.service';
import { Permission } from '@quick/models/permission.model';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/entity-edit/entity-form.component';
import { OliveUtilities } from 'app/core/classes/utilities';
import { Company } from '../../models/company.model';
import { OliveLookupHostComponent } from 'app/core/components/lookup-host/lookup-host.component';
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
    formBuilder: FormBuilder, 
    private accountService: AccountService,
    private translater: FuseTranslationLoaderService,
    private companyGroupService: OliveCompanyGroupService
  ) 
  {
    super(
      formBuilder
    );
  }

  get companyGroupTitle() {
    return NavTranslates.Company.Group;
  }

  get code() {
    return this.oForm.get('code');
  }

  get memo() {
    return this.oForm.get('memo');
  }

  get activated() {
    return this.oForm.get('activated');
  }

  getEditedItem(): any {
    const formModel = this.oForm.value;

    return this.itemWithIdNAudit({
      code: formModel.code,
      name: formModel.name,
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
      memo: '',
      activated: false,
      companyGroupFk: null
    });
  }

  resetForm() {
    this.oForm.reset({
      id: OliveUtilities.convertToBase36(this.item.id),
      code: this.item.code || '',
      name: this.item.name || '',
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
      columns: 'id',
      dialogTitle: this.translater.get(NavTranslates.Company.List),
      dataService: this.companyGroupService,
      maxSelectItems: 1,
      newComponent: OliveCompanyGroupManagerComponent,
      itemType: CompanyGroup,
      managePermission: Permission.assignCompanyGroups,
      translateTitleId: NavTranslates.Company.Group
    };
  }
}
