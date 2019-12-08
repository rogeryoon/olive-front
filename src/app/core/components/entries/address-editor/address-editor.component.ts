import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { Address } from 'app/core/models/address.model';

import { Country } from 'app/main/supports/models/country.model';
import { OliveCountryService } from 'app/main/supports/services/country.service';
import { OliveCacheService } from 'app/core/services/cache.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { requiredValidator } from 'app/core/validators/general-validators';
import { activatedNameOrderedSearchOption } from 'app/core/utils/search-helpers';

@Component({
  selector: 'olive-address-editor',
  templateUrl: './address-editor.component.html',
  styleUrls: ['./address-editor.component.scss']
})
export class OliveAddressEditorComponent extends OliveEntityFormComponent {

  subscription: Subscription;
  countries: Country[];

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private cacheService: OliveCacheService,
    private countryService: OliveCountryService
  ) {
    super(
      formBuilder, translator
    );
  }

  getEditedItem(): Address {
    const formModel = this.oForm.value;

    return this.itemWithIdNAudit({
      address1: formModel.address1,
      address2: formModel.address2,
      city: formModel.city,
      stateProvince: formModel.stateProvince,
      postalCode: formModel.postalCode,
      countryId: this.countries.find(item => item.id === formModel.country).id
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      address1: ['', requiredValidator()],
      address2: '',
      city: '',
      stateProvince: '',
      postalCode: ['', requiredValidator()],
      country: ['', requiredValidator()]
    });
  }

  resetForm() {
    this.oForm.reset({
      address1: this.item.address1 || '',
      address2: this.item.address2 || '',
      city: this.item.city || '',
      stateProvince: this.item.stateProvince || '',
      postalCode: this.item.postalCode || '',
      country: this.item.countryId || ''
    });
  }

  createEmptyObject() {
    return new Address();
  }

  initializeChildComponent() {
    this.getCountries();
  }

  private getCountries() {
    this.cacheService.getItems(this.countryService, OliveCacheService.cacheKeys.getItemsKey.country+'activated', activatedNameOrderedSearchOption())
    .then((items: Country[]) => {
      this.countries = items;
    });
  }
}



