import { Component, ViewChild } from '@angular/core';
import { FormBuilder, AbstractControl } from '@angular/forms';

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
import { numberValidator, requiredValidator } from 'app/core/validators/general-validators';
import { renderVolumeWeight } from 'app/core/utils/shipping-helpers';
import { volumeValidator } from 'app/core/validators/shipping-validators';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { customsTypeErrorMessageByControl } from 'app/core/utils/customs-helpers';
import { customsTypeCodeValidator } from 'app/core/validators/customs-validators';
import { OliveProductLookupDialogComponent } from '../../product/product-lookup-dialog/product-lookup-dialog.component';

@Component({
  selector: 'olive-product-variant-editor',
  templateUrl: './product-variant-editor.component.html',
  styleUrls: ['./product-variant-editor.component.scss']
})
export class OliveProductVariantEditorComponent extends OliveEntityFormComponent {
  @ViewChild('product')
  lookupProduct: OliveLookupHostComponent;

  weightTypes: any[] = OliveConstants.weightTypes;
  lengthTypes: any[] = OliveConstants.lengthTypes;
  variantCount = 0;

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private accountService: AccountService, private productService: OliveProductService,
    private cacheService: OliveCacheService, private messageHelper: OliveMessageHelperService
  ) {
    super(
      formBuilder, translator
    );
  }

  get haveMultiVariants(): boolean {
    return this.variantCount > 1;
  }

  get groupWidth(): number {
    return this.haveMultiVariants ? 70 : 30;
  }

  get itemWidth(): number {
    return this.haveMultiVariants ? 30 : 100;
  }

  getEditedItem(): any {
    const formModel = this.oFormValue;

    return this.itemWithIdNAudit({
      code: formModel.code,
      name: formModel.name,
      activated: formModel.activated,
      memo: formModel.memo,
      standPrice: formModel.standPrice,
      customsTypeCode: formModel.customsTypeCode,
      hsCode: formModel.hsCode,
      weight: formModel.weight,
      weightTypeCode: formModel.weightTypeCode,
      volume: formModel.volume,
      lengthTypeCode: formModel.lengthTypeCode,
      customsName: formModel.customsName,
      customsPrice: formModel.customsPrice,
      productId: formModel.productFk.id
    } as ProductVariant);
  }

  buildForm() {
    this.oForm = this.formBuilder.group({
      code: '',
      name: ['', requiredValidator()],
      activated: false,
      memo: '',
      standPrice: ['', [numberValidator(this.standCurrency.decimalPoint, false)]],
      weight: ['', [numberValidator(2, false)]],
      weightTypeCode: ['', requiredValidator()],
      volume: ['', [volumeValidator()]],
      volumeWeight: '',
      lengthTypeCode: ['', requiredValidator()],
      customsName: '',
      customsPrice: ['', [numberValidator(this.standCurrency.decimalPoint, false)]],
      customsTypeCode: '',
      hsCode: '',
      productFk: null
    });
  }

  resetForm() {
    this.getVariantCount();

    const item = this.item as ProductVariant;
    
    this.oForm.reset({
      code: item.code || '',
      name: item.name || '',
      activated: this.boolValue(item.activated),
      memo: item.memo || '',
      standPrice: item.standPrice || '',
      weight: item.weight || '',
      weightTypeCode: item.weightTypeCode || '',
      volume: item.volume || '',
      volumeWeight: item.volume || '',
      lengthTypeCode: item.lengthTypeCode || '',
      customsName:  item.customsName || '',
      customsPrice: item.customsPrice || '',
      customsTypeCode: item.productFk ? item.productFk.customsTypeCode || '' : '',
      hsCode: item.productFk ? item.productFk.hsCode || '' : '',      
      productFk: item.productFk || ''
    });

    if (this.lookupProduct && item.productFk && item.productFk.name.length === 0) {
      setTimeout(() => {
        this.lookupProduct.setName(item.name);
      });      
    }
    
    // 무게 또는 길이 규격이 없는게 있다면 회사 기본 값을 설정
    if (!item.weightTypeCode || !item.lengthTypeCode) {
      this.cacheService.GetCompanyGroupSetting()
        .then(setting => {
          if (!item.weightTypeCode) {
            this.oForm.patchValue({
              weightTypeCode: setting.productWeightTypeCode
            });
          }
          if (!item.lengthTypeCode) {
            this.oForm.patchValue({
              lengthTypeCode: setting.productLengthTypeCode
            });
          }
        });
    }

    this.cacheService.getCustomsConfigs()
    .then((configs: Map<string, any>) => {
      const control = this.getControl('customsTypeCode');
      control.clearValidators();
      control.setValidators([customsTypeCodeValidator(configs, false)]);
    });
  }

  getVariantCount() {
    if (!this.item.productFk) {
      return;
    }

    this.productService.getVariantCount(this.item.productFk.id).subscribe(response => {
      this.variantCount = response.model;
    },
      error => {
        this.messageHelper.showLoadFailedSticky(error);
      });
  }

  createEmptyObject() {
    return new ProductVariant();
  }

  get canAssignItem() {
    return this.accountService.userHasPermission(Permission.manageProductsPermission);
  }

  initializeChildComponent() {
    this.standCurrency = this.cacheService.standCurrency;

    if (this.lookupProduct) {
      this.lookupProduct.setting = {
        columnType: 'id',
        itemTitle: this.translator.get(NavTranslates.Product.productGroup),
        dataService: this.productService,
        maxSelectItems: 1,
        newComponent: OliveProductManagerComponent,
        lookUpDialogComponent: OliveProductLookupDialogComponent,
        itemType: Product,
        managePermission: Permission.manageProductsPermission,
        translateTitleId: NavTranslates.Product.productGroup
      };
    }
  }

  markCustomControlsTouched() {
    if (this.lookupProduct) {
      this.lookupProduct.markAsTouched();
    }
  }

  /**
   * 부피 무게 문자를 빌드
   * @param volumeCtrl 
   * @param weightTypeCtrl 
   * @param lengthTypeCtrl 
   * @returns  부피 무게 표현 문자열
   */
  renderVolumeWeight(volumeCtrl: any, weightTypeCtrl: any, lengthTypeCtrl: any) {
    return renderVolumeWeight(volumeCtrl, weightTypeCtrl, lengthTypeCtrl);
  }

  hasEntryErrorByControl(control: any): boolean {
    let hasError = super.hasEntryErrorByControl(control);

    if (hasError) { return hasError; }

    hasError = customsTypeErrorMessageByControl(control, this.translator) !== null;

    return control.touched && hasError;
  }

  errorMessageByControl(control: AbstractControl): string {
    let message = super.errorMessageByControl(control);

    if (message) { return message; }

    message = customsTypeErrorMessageByControl(control, this.translator);

    return message;
  }
}
