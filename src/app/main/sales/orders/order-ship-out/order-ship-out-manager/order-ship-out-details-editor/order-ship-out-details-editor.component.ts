import { Component, forwardRef } from '@angular/core';
import { FormBuilder, FormArray, FormControl, ValidationErrors, 
  NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, FormGroup } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { Permission } from '@quick/models/permission.model';
import { AlertService } from '@quick/services/alert.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OliveUtilities } from 'app/core/classes/utilities';
import { OliveProductVariantLookupDialogComponent } from 'app/main/productions/products/product-variant/product-variant-lookup-dialog/product-variant-lookup-dialog.component';
import { NavTranslates } from 'app/core/navigations/nav-translates';
import { OliveProductVariantService } from 'app/main/productions/services/product-variant.service';
import { OliveProductVariantManagerComponent } from 'app/main/productions/products/product-variant/product-variant-manager/product-variant-manager.component';
import { ProductVariant } from 'app/main/productions/models/product-variant.model';
import { LookupListerSetting } from 'app/core/interfaces/lister-setting';
import { IdName } from 'app/core/models/id-name';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OliveOrderShipOutDetailDatasource } from './order-ship-out-detail.datasource';
import { OrderShipOutDetail } from 'app/main/sales/models/order-ship-out-detail.model';

@Component({
  selector: 'olive-order-ship-out-details-editor',
  templateUrl: './order-ship-out-details-editor.component.html',
  styleUrls: ['./order-ship-out-details-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OliveOrderShipOutDetailsEditorComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OliveOrderShipOutDetailsEditorComponent),
      multi: true,
    }
  ]
})
export class OliveOrderShipOutDetailsEditorComponent extends OliveEntityFormComponent implements ControlValueAccessor, Validator {
  displayedColumns = ['productVariantId36', 'productName', 'quantity', 'actions'];
  dataSource: 
  OliveOrderShipOutDetailDatasource = new OliveOrderShipOutDetailDatasource(this.cacheService, this.productVariantService);

  value: any = null;

  constructor(
    formBuilder: FormBuilder, translater: FuseTranslationLoaderService,
    private alertService: AlertService, private snackBar: MatSnackBar,
    private cacheService: OliveCacheService, private dialog: MatDialog,
    private productVariantService: OliveProductVariantService, private messageHelperService: OliveMessageHelperService
  ) {
    super(
      formBuilder, translater
    );
  }

  initializeChildComponent() {
  }

  get items(): any {
    return this.dataSource.items;
  }

  get isLoading() {
    return this.dataSource.isLoading;
  }

  getProducts(index: number): IdName[] {
    return this.dataSource.products[index];
  }

  buildForm() {
    this.oFormArray = this.formBuilder.array([]);
    this.oForm = this.formBuilder.group({ formarray: this.oFormArray });
    this.dataSource.formGroup = this.oForm;
  }

  onProductSelected(event: any, index: number) {
    const formGroup = this.getArrayFormGroup(index);

    formGroup.patchValue({productVariantId36: ''});

    const foundItem = this.getProducts(index).find(item => item.name === event.option.value);

    const dupStrings: string[] = [];
    this.dataSource.items.forEach((dsItem: OrderShipOutDetail) => {
      if (dsItem.productVariantId === foundItem.id) {
        dupStrings.push(`${this.id36(foundItem.id)}: ${foundItem.name}`);
        return;
      }
    });

    if (foundItem && dupStrings.length === 0) {
      formGroup.patchValue({productVariantId36: OliveUtilities.convertToBase36(foundItem.id)});
    }

    if (dupStrings.length > 0) {
      formGroup.patchValue({productName: ''});      
      this.messageHelperService.showDuplicatedItems(dupStrings);
    }
  }

  onProductNameValueEmpty(index: number) {
    const formGroup = this.getArrayFormGroup(index);
    formGroup.patchValue({productVariantId36: null});
  }

  get noItemSelectedError(): boolean {
    return this.dataSource.items.length === 0;
  }

  get showNoItemCreatedError(): boolean {
    return this.noItemSelectedError && this.oForm.touched;
  }

  protected hasOtherError(): boolean {
    if (this.noItemSelectedError) {
      this.alertService.showMessageBox(
        this.translater.get('common.title.errorConfirm'),
        this.translater.get('common.message.noItemCreated')
      );

      return true;
    }
  }

  createEmptyObject() {
    return new OrderShipOutDetail();
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
          dialogTitle: this.translater.get(NavTranslates.Product.productVariant),
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
        const dupProductVariantIdCheckset = new Set();
  
        this.dataSource.items.forEach((dsItem: OrderShipOutDetail) => {
          pvItems
            .filter((pvItem: ProductVariant) => dsItem.productVariantId === pvItem.id)
            .forEach((pvItem: ProductVariant) => {
              if (!dupProductVariantIdCheckset.has(pvItem.id)) {
                dupProductVariantIdCheckset.add(pvItem.id);
                duplicatedIdStrings.push(
                  `${this.id36(pvItem.id)}: ${pvItem.productFk.name} ${pvItem.name}`.trimRight());
              }
            });
        });
  
        let needToRender = false;
  
        pvItems
          .filter((pvItem: ProductVariant) => !dupProductVariantIdCheckset.has(pvItem.id))
          .forEach((pvItem: ProductVariant) => {
            this.dataSource.addNewItem({
              quantity: 1,
              productVariantId: pvItem.id,
              name: `${pvItem.productFk.name} ${pvItem.name}`.trimRight()
            } as OrderShipOutDetail);
            needToRender = true;
          });
  
        if (needToRender) {
          this.dataSource.renderItems();
          this.oForm.markAsDirty();
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

  private newItem(product: OrderShipOutDetail = null) {
    if (!product) {
      product = new OrderShipOutDetail();
      product.quantity = 1;
    }

    this.dataSource.addNewItem(product);
    this.dataSource.renderItems();
    this.oForm.markAsDirty();
  }

  private deleteItem(item: any) {
    if (item.Obj.productVariantId36) {
      this.snackBar.open(
        OliveUtilities.showParamMessage(this.translater.get('common.message.confirmDelete')),
        this.translater.get('common.button.delete'),
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
      const fa = <FormArray>this.oForm.get('formarray');
      fa.removeAt(0);
    }    
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
    if (event.target.name.includes('ProductName') && event.target.value === '') {
      this.onProductNameValueEmpty(index);
    }
    this._onChange(event.target.value);
  }
  onKeyup(event: any) {
    this._onChange(event.target.value);
  }
  onBlur(event: any) {
    this._onTouched();
  }
  
  validate(c: FormControl): ValidationErrors {
    return this.oForm.errors;
  }
}
