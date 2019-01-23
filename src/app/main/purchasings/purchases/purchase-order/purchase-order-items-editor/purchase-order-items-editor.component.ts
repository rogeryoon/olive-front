import { Component, forwardRef } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl, ValidationErrors, 
  NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { String } from 'typescript-string-operations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/entity-edit/entity-form.component';
import { OliveContants } from 'app/core/classes/contants';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OlivePaymentMethodService } from 'app/main/supports/companies/services/payment-method.service';
import { OliveCacheService } from 'app/core/services/cache.service';
import { PurchaseOrder } from '../../models/purchase-order.model';
import { PaymentMethod } from 'app/main/supports/companies/models/payment-method.model';
import { OlivePurchaseOrderItemDatasource } from './purchase-order-item-datasource';

@Component({
  selector: 'olive-purchase-order-items-editor',
  templateUrl: './purchase-order-items-editor.component.html',
  styleUrls: ['./purchase-order-items-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OlivePurchaseOrderItemsEditorComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OlivePurchaseOrderItemsEditorComponent),
      multi: true,
    }
  ]
})
export class OlivePurchaseOrderItemsEditorComponent extends OliveEntityFormComponent implements ControlValueAccessor, Validator {
  displayedColumns = ['productVariantId', 'name', 'quantity', 'price', 'amount', 'remark', 'actions'];
  itemsDataSource: OlivePurchaseOrderItemDatasource = new OlivePurchaseOrderItemDatasource();
  paymentMethods: PaymentMethod[];

  oFormArray: FormArray;

  value: any = null;  

  constructor(
    formBuilder: FormBuilder,
    private cacheService: OliveCacheService,
    private messageHelper: OliveMessageHelperService,
    private paymentMethodService: OlivePaymentMethodService,
    private snackBar: MatSnackBar,
    private translater: FuseTranslationLoaderService,
  ) {
    super(
      formBuilder
    );
  }

  get items(): any {
    return this.itemsDataSource.items;
  }

  buildForm() {
    this.oFormArray = this.formBuilder.array([]);
    this.oForm = this.formBuilder.group({ formarray: this.oFormArray });
    this.itemsDataSource.formGroup = this.oForm;
  }

  createEmptyObject() {
    return new PurchaseOrder();
  }

  hasRequiredError(name: string, index: number) {
    const formGroup = (<FormArray>this.oForm.get('formarray')).controls[index] as FormGroup;
    const control = formGroup.get(name);
    return control.touched && control.hasError('required');
  }

  private newItem() {
    this.itemsDataSource.addNewItem(null);
  }
  
  private deleteItem(item: any) {
    if (item.Obj.id || item.Obj.name || item.Obj.quantity || item.Obj.price || item.Obj.remark) {
      this.snackBar.open(
        String.Format(this.translater.get('common.message.confirmDelete'), 'the data'),
        this.translater.get('common.button.confirmDelete'),
        { duration: 5000 }
      )
        .onAction().subscribe(() => {
          this.itemsDataSource.deleteItem(item);
        });
    }
    else {
      this.itemsDataSource.deleteItem(item);
    }
  }

  get totalQuantity(): number {
    let quantity = 0;

    this.itemsDataSource.items.forEach(item => {
      if (item.quantity) {
        quantity += item.quantity;
      }
    });

    return quantity;
  }

  private _onChange = (_: any) => { };
  private _onTouched = () => {};

  writeValue(obj: any): void {
    this.value = obj;
    this.item = obj;

    if (obj) {
      this.itemsDataSource.loadItems(obj);
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
  onChange(event: any) {
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
