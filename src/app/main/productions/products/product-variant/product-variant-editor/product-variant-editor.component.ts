import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AccountService } from '@quick/services/account.service';

import { OliveEntityFormComponent } from 'app/core/components/entity-edit/entity-form.component';
import { OliveUtilities } from 'app/core/classes/utilities';
import { OliveContants } from 'app/core/classes/contants';
import { OliveCacheService } from 'app/core/services/cache.service';
import { ProductVariant } from '../../models/product-variant.model';
import { OliveLookupHostComponent } from 'app/core/components/lookup-host/lookup-host.component';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveProductService } from '../../services/product.service';
import { OliveProductManagerComponent } from '../../product/product-manager/product-manager.component';
import { Product } from '../../models/product.model';
import { Permission } from '@quick/models/permission.model';
import { numberValidator } from 'app/core/classes/validators';

@Component({
  selector: 'olive-product-variant-editor',
  templateUrl: './product-variant-editor.component.html',
  styleUrls: ['./product-variant-editor.component.scss']
})
export class OliveProductVariantEditorComponent extends OliveEntityFormComponent {
  @ViewChild('product') 
  lookupProduct: OliveLookupHostComponent;

  weightTypes: any[] = OliveContants.weightTypes;

  constructor(
    formBuilder: FormBuilder,
    translater: FuseTranslationLoaderService,
    private accountService: AccountService,
    private productService: OliveProductService,
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
      standPrice: formModel.standPrice,
      weight: formModel.weight,
      weightTypeCode: formModel.weightTypeCode,
      productId: formModel.productFk.id
    });
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      id: '',
      code: '',
      name: '',
      standPrice: ['', [numberValidator(this.standCurrency.decimalPoint, false)]],
      weight: ['', [numberValidator(2, false)]],
      weightTypeCode: ['', Validators.required],
      productFk: null
    });
  }

  resetForm() {
    this.oForm.reset({
      id: OliveUtilities.convertToBase36(this.item.id),
      code: this.item.code || '',
      name: this.item.name || '',
      standPrice: this.item.standPrice || '',
      weight: this.item.weight || '',
      weightTypeCode: this.item.weightTypeCode || '',
      productFk: this.item.productFk || ''
    });

    if (!this.item.weightTypeCode) {
      this.cacheService.GetCompanyGroupSetting()
        .then(setting => this.oForm.patchValue({weightTypeCode: setting.productWeightTypeCode}));  
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
      name: 'Product',
      columnType: 'id',
      dialogTitle: this.translater.get(NavTranslates.Product.ProductGroup),
      dataService: this.productService,
      maxSelectItems: 1,
      newComponent: OliveProductManagerComponent,
      itemType: Product,
      managePermission: Permission.manageProductsPermission,
      translateTitleId: NavTranslates.Product.ProductGroup
    };
  }

  markCustomControlsTouched() {
    this.lookupProduct.markAsTouched();   
  }
}
