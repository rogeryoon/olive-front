import { Component, forwardRef, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormArray, FormControl, ValidationErrors, 
  NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Permission } from '@quick/models/permission.model';
import { AlertService } from '@quick/services/alert.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveMarketItemMappingProductVariantDataSource } from './market-item-mapping-product-variant-data-source';
import { MarketItemMappingProductVariant } from '../../../models/market-item-mapping-product-variant.model';
import { OliveProductVariantLookupDialogComponent } from 'app/main/productions/products/product-variant/product-variant-lookup-dialog/product-variant-lookup-dialog.component';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveProductVariantService } from 'app/main/productions/services/product-variant.service';
import { OliveProductVariantManagerComponent } from 'app/main/productions/products/product-variant/product-variant-manager/product-variant-manager.component';
import { ProductVariant } from 'app/main/productions/models/product-variant.model';
import { LookupListerSetting } from 'app/core/interfaces/setting/lookup-lister-setting';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { showParamMessage, isEmptyOrWhiteSpace } from 'app/core/utils/string-helper';
import { ProductVariantPrice } from 'app/main/productions/models/product-variant-price.model';

@Component({
  selector: 'olive-market-item-mapping-product-variants-editor',
  templateUrl: './market-item-mapping-product-variants-editor.component.html',
  styleUrls: ['./market-item-mapping-product-variants-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OliveMarketItemMappingProductVariantsEditorComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OliveMarketItemMappingProductVariantsEditorComponent),
      multi: true,
    }
  ]
})
export class OliveMarketItemMappingProductVariantsEditorComponent extends OliveEntityFormComponent implements ControlValueAccessor, Validator, AfterContentChecked {
  displayedColumns = ['productVariantId26', 'productName', 'quantity', 'actions'];
  dataSource: 
  OliveMarketItemMappingProductVariantDataSource = 
  new OliveMarketItemMappingProductVariantDataSource(this.cacheService, this.productVariantService);

  value: any = null;

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private alertService: AlertService, private snackBar: MatSnackBar,
    private cacheService: OliveCacheService, private dialog: MatDialog,
    private productVariantService: OliveProductVariantService, private messageHelperService: OliveMessageHelperService,
    private cdRef: ChangeDetectorRef
  ) {
    super(
      formBuilder, translator
    );
  }

  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }

  initializeChildComponent() {
  }

  get items(): any {
    return this.dataSource.items;
  }

  get isLoading() {
    return this.dataSource.isLoading;
  }

  getProducts(index: number): ProductVariantPrice[] {
    return this.dataSource.products[index];
  }

  buildForm() {
    this.oFormArray = this.formBuilder.array([]);
    this.oForm = this.formBuilder.group({ formArray: this.oFormArray });
    this.dataSource.formGroup = this.oForm;
  }

  onProductSelected(event: any, index: number) {
    const formGroup = this.getArrayFormGroup(index);

    formGroup.patchValue({productVariantId26: '', hiddenProductVariantId: '' });

    const selectedItem = this.getProducts(index).find(item => item.productName === event.option.value);

    const dupItem = this.dataSource.items
      .find((x: MarketItemMappingProductVariant) => x.productVariantId === selectedItem.id);

    let dupString;      
    if (dupItem) {
      dupString = `${this.id26(selectedItem.shortId)}: ${selectedItem.productName}`;
    }

    if (selectedItem && !dupString) {
      formGroup.patchValue({
        productVariantId26: this.id26(selectedItem.shortId),
        hiddenProductVariantId: selectedItem.id,
        productName: selectedItem.productName
      });
    }

    if (dupString) {
      formGroup.patchValue({productName: ''});      
      this.messageHelperService.showDuplicatedItems([dupString]);
    }
  }

  onProductNameValueEmpty(index: number) {
    const formGroup = this.getArrayFormGroup(index);
    formGroup.patchValue({productVariantId26: null, hiddenProductVariantId: null});
  }

  get noItemCreatedError(): boolean {
    return this.dataSource.items.length === 0;
  }

  protected hasOtherError(): boolean {
    if (this.noItemCreatedError) {
      this.alertService.showMessageBox(
        this.translator.get('common.title.errorConfirm'),
        this.translator.get('common.message.noItemCreated')
      );

      return true;
    }
  }

  createEmptyObject() {
    return new MarketItemMappingProductVariant();
  }

  addProductsLink() {
    const dialogRef = this.dialog.open(
      OliveProductVariantLookupDialogComponent,
      {
        disableClose: true,
        panelClass: 'mat-dialog-md',
        data: {
          name: 'ProductVariant',
          columnType: 'id',
          itemTitle: this.translator.get(NavTranslates.Product.productVariant),
          dataService: this.productVariantService,
          maxSelectItems: 10,
          newComponent: OliveProductVariantManagerComponent,
          itemType: ProductVariant,
          managePermission: Permission.manageProductsPermission,
          translateTitleId: NavTranslates.Product.productVariant,
          maxNameLength: 10
        } as LookupListerSetting
      });

      dialogRef.afterClosed().subscribe(pvItems => {
        if (!pvItems || pvItems.length === 0) { return; }
  
        const duplicatedIdStrings: string[] = [];
        const dupProductVariantIdCheckSet = new Set();
  
        this.dataSource.items.forEach((dsItem: MarketItemMappingProductVariant) => {
          pvItems
            .filter((pvItem: ProductVariant) => dsItem.productVariantId === pvItem.id)
            .forEach((pvItem: ProductVariant) => {
              if (!dupProductVariantIdCheckSet.has(pvItem.id)) {
                dupProductVariantIdCheckSet.add(pvItem.id);
                duplicatedIdStrings.push(
                  `${this.id26(pvItem.shortId)}: ${pvItem.productFk.name} ${pvItem.name}`.trim());
              }
            });
        });
  
        let needToRender = false;
  
        pvItems
          .filter((pvItem: ProductVariant) => !dupProductVariantIdCheckSet.has(pvItem.id))
          .forEach((pvItem: ProductVariant) => {
            this.dataSource.addNewItem({
              quantity: 1,
              productVariantId: pvItem.id,
              productVariantShortId: pvItem.shortId,
              productName: `${pvItem.productFk.name} ${pvItem.name}`.trim()
            } as MarketItemMappingProductVariant);
            needToRender = true;
          });
  
        if (needToRender) {
          this.dataSource.renderItems();
          this._onChange(0);
        }
      
        this.messageHelperService.showDuplicatedItems(duplicatedIdStrings);
      });  
  }

  get totalQuantity(): number {
    let quantity = 0;

    this.dataSource.items.forEach(item => {
      if (!isNaN(item.quantity)) {
        quantity += +item.quantity;
      }
    });

    return quantity;
  }

  private newItem(product: MarketItemMappingProductVariant = null) {
    if (!product) {
      product = new MarketItemMappingProductVariant();
      product.quantity = 1;
    }

    this.dataSource.addNewItem(product);
    this.dataSource.renderItems();
    this.oForm.markAsDirty();
  }

  private deleteItem(item: any) {
    if (item.Obj.productVariantId26) {
      this.snackBar.open(
        showParamMessage(this.translator.get('common.message.confirmDelete')),
        this.translator.get('common.button.delete'),
        { duration: 5000 }
      )
        .onAction().subscribe(() => {
          this.deleteUnit(item);
        });
    }
    else {
      this.deleteUnit(item);
    }
  }

  private deleteUnit(item: any) {
    this.dataSource.deleteItem(item);
    if (this.dataSource.items.length === 0) {
      const fa = <FormArray>this.oForm.get('formArray');
      fa.removeAt(0);
    }
    this._onChange(0);
  }

  private _onChange = (_: any) => { };
  private _onTouched = () => {};

  writeValue(obj: any): void {
    this.value = obj;

    if (obj) {
      this.dataSource.loadItems(obj);
    }

    if (!obj || obj.length === 0) {
      this.newItem();      
    }
  }
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  onSelectionChange(event: any) {
    this._onChange(event.value);
  }
  onChange(event: any, index: number) {
    this._onChange(event.target.value);
  }
  onKeyup(event: any, index: number) {
    if (event.target.name.includes('ProductName') && isEmptyOrWhiteSpace(event.target.value)) {
      this.onProductNameValueEmpty(index);
    }    
    this._onChange(event.target.value);
  }
  onBlur(event: any) {
    this._onTouched();
  }
  
  validate(c: FormControl): ValidationErrors {
    return this.oForm.errors;
  }
}
