import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { CarrierTrackingNumberRange } from 'app/main/shippings/models/carrier-tracking-number-range.model';
import { OliveLookupHostComponent } from 'app/core/components/entries/lookup-host/lookup-host.component';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveBranchService } from 'app/main/supports/services/branch.service';
import { OliveCompanyGroupService } from 'app/main/supports/services/company-group.service';
import { OliveBranchManagerComponent } from 'app/main/supports/companies/branch/branch-manager/branch-manager.component';
import { OliveCompanyGroupManagerComponent } from 'app/main/supports/companies/company-group/company-group-manager/company-group-manager.component';
import { CompanyGroup } from 'app/main/supports/models/company-group.model';
import { Permission } from '@quick/models/permission.model';
import { Branch } from 'app/main/supports/models/branch.model';
import { Carrier } from 'app/main/supports/models/carrier.model';
import { OliveCarrierService } from 'app/main/supports/services/carrier.service';
import { OliveCarrierManagerComponent } from '../../carrier/carrier-manager/carrier-manager.component';
import { numberValidator, rangeValidator } from 'app/core/validators/general-validators';

@Component({
  selector: 'olive-carrier-tracking-number-range-editor',
  templateUrl: './carrier-tracking-number-range-editor.component.html',
  styleUrls: ['./carrier-tracking-number-range-editor.component.scss']
})
export class OliveCarrierTrackingNumberRangeEditorComponent extends OliveEntityFormComponent {
  @ViewChild('carrier')
  lookupCarrier: OliveLookupHostComponent;

  @ViewChild('branch')
  lookupBranch: OliveLookupHostComponent;

  @ViewChild('companyGroup')
  lookupCompanyGroup: OliveLookupHostComponent;

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private carrierService: OliveCarrierService,
    private branchService: OliveBranchService, private companyGroupService: OliveCompanyGroupService
  ) {
    super(
      formBuilder, translator
    );
  }

  initializeChildComponent() {
    this.lookupCarrier.setting = {
      columnType: 'code',
      itemTitle: this.translator.get(NavTranslates.Basic.carrier),
      dataService: this.carrierService,
      maxSelectItems: 1,
      newComponent: OliveCarrierManagerComponent,
      itemType: Carrier,
      managePermission: Permission.assignCompanyGroups,
      translateTitleId: NavTranslates.Basic.carrier
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

    this.lookupCompanyGroup.setting = {
      columnType: 'id',
      itemTitle: this.translator.get(NavTranslates.Company.groupList),
      dataService: this.companyGroupService,
      maxSelectItems: 1,
      newComponent: OliveCompanyGroupManagerComponent,
      itemType: CompanyGroup,
      managePermission: Permission.assignCompanyGroups,
      translateTitleId: NavTranslates.Company.groupList
    };
  }

  getEditedItem(): CarrierTrackingNumberRange {
    const formModel = this.oFormValue;

    return this.itemWithIdNAudit({
      name: formModel.name,
      memo: formModel.memo,
      fromTrackingNumber: formModel.fromTrackingNumber,
      toTrackingNumber: formModel.toTrackingNumber,
      lastTrackingNumber: formModel.lastTrackingNumber,
      activated: formModel.activated,
      branchId: formModel.branchFk.id,
      carrierId: formModel.carrierFk.id,
      companyGroupId: formModel.companyGroupFk.id
    } as CarrierTrackingNumberRange);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      name: '',
      memo: '',
      fromTrackingNumber: ['', [numberValidator(0, true, 1)]],
      toTrackingNumber: ['', [numberValidator(0, true, 1)]],
      lastTrackingNumber: ['', [numberValidator(0, false, 1)]],
      activated: false,
      branchFk: null,
      carrierFk: null,
      companyGroupFk: null
    }, { validators: [rangeValidator('fromTrackingNumber', 'toTrackingNumber', 'lastTrackingNumber')] });
  }

  resetForm() {
    let branch = null;
    if (this.item.branchId) {
      branch = { id: this.item.branchId, name: this.item.branchName } as Branch;
    }

    let carrier = null;
    if (this.item.carrierId) {
      carrier = { id: this.item.carrierId, name: this.item.carrierName } as Carrier;
    }

    let companyGroup = null;
    if (this.item.companyGroupId) {
      companyGroup = { id: this.item.companyGroupId, name: this.item.companyGroupName } as CompanyGroup;
    }

    this.oForm.reset({
      name: this.item.name || '',
      memo: this.item.memo || '',
      fromTrackingNumber: this.item.fromTrackingNumber || '',
      toTrackingNumber: this.item.toTrackingNumber || '',
      lastTrackingNumber: this.item.lastTrackingNumber || '',
      activated: this.boolValue(this.item.activated),
      branchFk: branch || '',
      carrierFk: carrier || '',
      companyGroupFk: companyGroup || ''
    });
  }

  createEmptyObject() {
    return new CarrierTrackingNumberRange();
  }

  markCustomControlsTouched() {
    this.lookupCarrier.markAsTouched();   
    this.lookupBranch.markAsTouched(); 
    this.lookupCompanyGroup.markAsTouched(); 
  }
}
