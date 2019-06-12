﻿import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AccountService } from '@quick/services/account.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OliveConstants } from 'app/core/classes/constants';
import { OliveCacheService } from 'app/core/services/cache.service';
import { ProductVariant } from '../../../models/product-variant.model';
import { OliveLookupHostComponent } from 'app/core/components/entries/lookup-host/lookup-host.component';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveProductService } from '../../../services/product.service';
import { OliveProductManagerComponent } from '../../product/product-manager/product-manager.component';
import { Product } from '../../../models/product.model';
import { Permission } from '@quick/models/permission.model';
import { numberValidator, volumeValidator } from 'app/core/classes/validators';
import { OliveUtilities } from 'app/core/classes/utilities';

@Component({
  selector: 'olive-product-variant-editor',
  templateUrl: './product-variant-editor.component.html',
  styleUrls: ['./product-variant-editor.component.scss']
})
export class OliveProductVariantEditorComponent extends OliveEntityFormComponent {
  @ViewChild('product') 
  lookupProduct: OliveLookupHostComponent;

  weightTypes: any[] = OliveConstants.weightTypes;
  lenghtTypes: any[] = OliveConstants.lengthTypes;

  constructor(
    formBuilder: FormBuilder, translater: FuseTranslationLoaderService,
    private accountService: AccountService, private productService: OliveProductService,
    private cacheService: OliveCacheService
  ) 
  {
    super(
      formBuilder, translater
    );
  }

  getEditedItem(): any {
    const formModel = this.oForm.value;

    return this.itemWithIdNAudit({
      code: formModel.code,
      name: formModel.name,
      activated: formModel.activated,
      memo: formModel.memo,      
      standPrice: formModel.standPrice,
      weight: formModel.weight,
      weightTypeCode: formModel.weightTypeCode,
      volume: formModel.volume,
      lengthTypeCode: formModel.lengthTypeCode,
      productId: formModel.productFk.id      
    } as ProductVariant);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      code: '',
      name: '',
      activated: false,
      memo: '',      
      standPrice: ['', [numberValidator(this.standCurrency.decimalPoint, false)]],
      weight: ['', [numberValidator(2, false)]],
      weightTypeCode: ['', Validators.required],
      volume: ['', [volumeValidator()]],
      volumeWeight: '',
      lengthTypeCode: ['', Validators.required],
      productFk: null
    });
  }

  resetForm() {
    this.oForm.reset({
      code: this.item.code || '',
      name: this.item.name || '',
      activated: this.boolValue(this.item.activated),
      memo: this.item.memo || '',      
      standPrice: this.item.standPrice || '',
      weight: this.item.weight || '',
      weightTypeCode: this.item.weightTypeCode || '',
      volume: this.item.volume || '',
      volumeWeight: this.item.volume || '',
      lengthTypeCode: this.item.lengthTypeCode || '',
      productFk: this.item.productFk || ''
    });

    if (!this.item.weightTypeCode || !this.item.lengthTypeCode) {
      this.cacheService.GetCompanyGroupSetting()
        .then(setting => {
          this.oForm.patchValue({
            weightTypeCode: setting.productWeightTypeCode,
            lengthTypeCode: setting.productLengthTypeCode
          });
        });  
    }
  }

  createEmptyObject() {
    return new ProductVariant();
  }

  get canAssignItem() {
    return this.accountService.userHasPermission(Permission.manageProductsPermission);
  }

  initializeChildComponent() {
    this.standCurrency = this.cacheService.standCurrency;

    this.lookupProduct.setting = {
      columnType: 'id',
      dialogTitle: this.translater.get(NavTranslates.Product.productGroup),
      dataService: this.productService,
      maxSelectItems: 1,
      newComponent: OliveProductManagerComponent,
      itemType: Product,
      managePermission: Permission.manageProductsPermission,
      translateTitleId: NavTranslates.Product.productGroup
    };
  }

  markCustomControlsTouched() {
    this.lookupProduct.markAsTouched();   
  }

  renderVolumeWeight(volumeCtrl: any, weightTypeCtrl: any, lengthTypeCtrl: any) {
    return OliveUtilities.renderVolumeWeight(volumeCtrl, weightTypeCtrl, lengthTypeCtrl);
  }
}
