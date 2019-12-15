import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Carrier } from '../../../models/carrier.model';
import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OliveLookupHostComponent } from 'app/core/components/entries/lookup-host/lookup-host.component';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveStandCarrierService } from '../../../services/stand-carrier.service';
import { StandCarrier } from '../../../models/stand-carrier.model';
import { NameValue } from 'app/core/models/name-value';
import { requiredValidator } from 'app/core/validators/general-validators';
import { createSearchOption } from 'app/core/utils/search-helpers';

@Component({
  selector: 'olive-carrier-editor',
  templateUrl: './carrier-editor.component.html',
  styleUrls: ['./carrier-editor.component.scss']
})
export class OliveCarrierEditorComponent extends OliveEntityFormComponent {
  @ViewChild('standCarrier') 
  lookupStandCarrier: OliveLookupHostComponent;

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private standCarrierService: OliveStandCarrierService
  ) {
    super(
      formBuilder, translator
    );
  }

  getEditedItem(): any {
    const formModel = this.oForm.value;

    return this.itemWithIdNAudit({
      code: formModel.code,
      name: formModel.name,
      webSite: formModel.webSite,
      memo: formModel.memo,
      activated: formModel.activated,
      standCarrierId: formModel.standCarrierFk.id
    } as Carrier);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      code: ['', requiredValidator()],
      name: ['', requiredValidator()],
      webSite: '',
      memo: '',
      activated: false,
      standCarrierFk: null
    });
  }

  resetForm() {
    this.oForm.reset({
      code: this.item.code || '',
      name: this.item.name || '',
      webSite: this.item.webSite || '',
      memo: this.item.memo || '',
      activated: this.boolValue(this.item.activated),
      standCarrierFk: this.item.standCarrierFk || ''
    });
  }

  createEmptyObject() {
    return new Carrier();
  }

  initializeChildComponent() {
    this.lookupStandCarrier.setting = {
      columnType: 'code',
      itemTitle: this.translator.get(NavTranslates.Basic.standCarrier),
      dataService: this.standCarrierService,
      maxSelectItems: 1,
      itemType: StandCarrier,
      translateTitleId: NavTranslates.Company.list,
      searchOption: createSearchOption([{ name: 'Activated', value: 'true' }] as NameValue[])
    };    
  }

  onStandCarrierSelected(item: Carrier) {
    this.setValueWhenControlIsEmpty('code', item.code);
    this.setValueWhenControlIsEmpty('name', item.name);
    this.setValueWhenControlIsEmpty('webSite', item.webSite);
  }

  setValueWhenControlIsEmpty(name: string, value: any) {
    if (this.isControlValueEmpty(name)) {
      this.setControlValue(name, value);
    }
  }
}
