import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/entity-edit/entity-form.component';
import { InWarehouse } from '../models/in-warehouse.model';
import { OliveLookupHostComponent } from 'app/core/components/lookup-host/lookup-host.component';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveWarehouseService } from 'app/main/supports/companies/services/warehouse.service';
import { OliveWarehouseManagerComponent } from 'app/main/supports/companies/warehouse/warehouse-manager/warehouse-manager.component';
import { Warehouse } from 'app/main/supports/companies/models/warehouse.model';
import { Permission } from '@quick/models/permission.model';
import { LookupListerSetting } from 'app/core/interfaces/lister-setting';

@Component({
  selector: 'olive-in-warehouse-editor',
  templateUrl: './in-warehouse-editor.component.html',
  styleUrls: ['./in-warehouse-editor.component.scss']
})
export class OliveInWarehouseEditorComponent extends OliveEntityFormComponent {
  @ViewChild('warehouse')
  lookupWarehouse: OliveLookupHostComponent;

  @Output() warehouseChanged = new EventEmitter();

  constructor(
    formBuilder: FormBuilder, translater: FuseTranslationLoaderService,
    private warehouseService: OliveWarehouseService
  ) {
    super(
      formBuilder, translater
    );
  }

  getEditedItem(): any {
    const formModel = this.oForm.value;

    return this.itemWithIdNAudit({
      memo: formModel.memo,
      warehouseId: formModel.warehouseFk.id
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      id: '',
      memo: '',
      warehouseFk: null,
    });
  }

  resetForm() {
    this.oForm.reset({
      id: this.id36(this.item.id),
      memo: this.item.memo || '',
      warehouseFk: this.item.warehouseFk
    });
  }

  createEmptyObject() {
    return new InWarehouse();
  }

  initializeChildComponent() {
    this.lookupWarehouse.setting = {
      name: 'Warehouse',
      columnType: 'code',
      dialogTitle: this.translater.get(NavTranslates.Company.Warehouse),
      dataService: this.warehouseService,
      maxSelectItems: 1,
      newComponent: OliveWarehouseManagerComponent,
      itemType: Warehouse,
      managePermission: Permission.assignCompanyGroups,
      translateTitleId: NavTranslates.Company.Warehouse
    } as LookupListerSetting;
  }

  markCustomControlsTouched() {
    this.lookupWarehouse.markAsTouched();
  }

  onWarehouseChanged(input: any) {
    this.warehouseChanged.emit(input);
  }
}
