import { Component, forwardRef } from '@angular/core';
import { FormBuilder, FormArray, FormControl, ValidationErrors, 
  NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { String } from 'typescript-string-operations';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/entity-edit/entity-form.component';
import { OliveContants } from 'app/core/classes/contants';
import { OliveMessageHelperService } from 'app/core/services/message-helper.service';
import { OlivePaymentMethodService } from 'app/main/supports/companies/services/payment-method.service';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OlivePurchaseOrderPaymentDatasource } from './purchase-order-payment-datasource';
import { PurchaseOrder } from '../../models/purchase-order.model';
import { PaymentMethod } from 'app/main/supports/companies/models/payment-method.model';
import { locale as english } from '../../i18n/en';

@Component({
  selector: 'olive-purchase-order-payments-editor',
  templateUrl: './purchase-order-payments-editor.component.html',
  styleUrls: ['./purchase-order-payments-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OlivePurchaseOrderPaymentsEditorComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OlivePurchaseOrderPaymentsEditorComponent),
      multi: true,
    }
  ]
})
export class OlivePurchaseOrderPaymentsEditorComponent extends OliveEntityFormComponent implements ControlValueAccessor, Validator {
  displayedColumns = ['paymentMethodId', 'amount', 'remarkId', 'actions'];
  paymentsDataSource: OlivePurchaseOrderPaymentDatasource = new OlivePurchaseOrderPaymentDatasource(this.cacheService);
  paymentMethods: PaymentMethod[];

  value: any = null;  

  constructor(
    formBuilder: FormBuilder, translater: FuseTranslationLoaderService,
    private messageHelper: OliveMessageHelperService, private snackBar: MatSnackBar,
    private cacheService: OliveCacheService, private paymentMethodService: OlivePaymentMethodService
  ) {
    super(
      formBuilder, translater
    );

    this.translater.loadTranslations(english);
  }

  initializeChildComponent() {
    this.standCurrency = this.cacheService.standCurrency;
    const key = OliveContants.CacheKeys.PaymentMethod;
    if (!this.cacheService.exist(key)) {
      this.paymentMethodService.getItems(null)
        .subscribe(response => {
          this.paymentMethods = this.cacheService.set(key, response.model);
        },
          error => {
            this.messageHelper.showLoadFaild(error);
          });
    }
    else {
      this.paymentMethods = this.cacheService.get(key);
    }
  }

  get items(): any {
    return this.paymentsDataSource.items;
  }

  get totalAmount(): number {
    let amount = 0;

    this.paymentsDataSource.items.forEach(item => {
      if (!isNaN(item.amount)) {
        amount += +item.amount;
      }
    });

    return amount;
  }

  buildForm() {
    this.oFormArray = this.formBuilder.array([]);
    this.oForm = this.formBuilder.group({ formarray: this.oFormArray });
    this.paymentsDataSource.formGroup = this.oForm;
  }

  createEmptyObject() {
    return new PurchaseOrder();
  }

  private newItem() {
    this.paymentsDataSource.addNewItem(null);
    this.oForm.markAsDirty();
  }
  
  private deleteItem(item: any) {
    if (item.Obj.id || item.Obj.amount || item.Obj.paymentMethodId || item.Obj.remarkId) {
      this.snackBar.open(
        String.Format(this.translater.get('common.message.confirmDelete'), 'the data'),
        this.translater.get('common.button.confirmDelete'),
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
    this.paymentsDataSource.deleteItem(item);
    if (this.paymentsDataSource.items.length === 0) {
      const fa = <FormArray>this.oForm.get('formarray');
      fa.removeAt(0);
    }    
  }

  private _onChange = (_: any) => { };
  private _onTouched = () => {};

  writeValue(obj: any): void {
    this.value = obj;
    this.item = obj;

    if (obj) {
      this.paymentsDataSource.loadItems(obj);
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
