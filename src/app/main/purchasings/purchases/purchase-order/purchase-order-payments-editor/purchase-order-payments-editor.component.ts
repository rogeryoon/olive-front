import { Component, forwardRef, Input } from '@angular/core';
import { FormBuilder, FormArray, FormControl, ValidationErrors, 
  NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { OliveEntityFormComponent } from 'app/core/components/extends/entity-form/entity-form.component';
import { OlivePaymentMethodService } from 'app/main/supports/services/payment-method.service';
import { OliveCacheService } from 'app/core/services/cache.service';
import { OlivePurchaseOrderPaymentDataSource } from './purchase-order-payment-data-source';
import { PaymentMethod } from 'app/main/supports/models/payment-method.model';
import { PurchaseOrderPayment } from '../../../models/purchase-order-payment.model';
import { activatedNameOrderedSearchOption } from 'app/core/utils/search-helpers';
import { showParamMessage } from 'app/core/utils/string-helper';

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
  dataSource: OlivePurchaseOrderPaymentDataSource = new OlivePurchaseOrderPaymentDataSource(this.cacheService);
  paymentMethods: PaymentMethod[];

  value: any = null;  

  @Input() isVoidMode = false;

  constructor(
    formBuilder: FormBuilder, translator: FuseTranslationLoaderService,
    private snackBar: MatSnackBar, private cacheService: OliveCacheService, 
    private paymentMethodService: OlivePaymentMethodService
  ) {
    super(
      formBuilder, translator
    );
  }

  initializeChildComponent() {
    this.standCurrency = this.cacheService.standCurrency;
    this.getPaymentMethods();
  }

  private getPaymentMethods() {
    this.cacheService.getItems(this.paymentMethodService, OliveCacheService.cacheKeys.getItemsKey.paymentMethod + 'activated', activatedNameOrderedSearchOption())
    .then((items: PaymentMethod[]) => {
      this.paymentMethods = items;
    });
  }

  get items(): any {
    return this.dataSource.items;
  }

  get totalAmount(): number {
    let amount = 0;

    this.dataSource.items.forEach(item => {
      if (!isNaN(item.amount) && item.amount > 0) {
        amount += +item.amount;
      }
    });

    return amount;
  }

  buildForm() {
    this.oFormArray = this.formBuilder.array([]);
    this.oForm = this.formBuilder.group({ formArray: this.oFormArray });
    this.dataSource.formGroup = this.oForm;
  }

  createEmptyObject() {
    return new PurchaseOrderPayment();
  }

  onTotalItemEntryAmountChanged(amount) {
    if (this.dataSource.items.length === 0) {
      const payment = new PurchaseOrderPayment();
      payment.amount = amount;
      this.newItem(payment);
    }
    else 
    if (this.dataSource.items.length === 1) {
      this.oFArray.controls.forEach((formGroup: FormGroup) => {
        formGroup.patchValue({amount: amount.toFixed(this.standCurrency.decimalPoint)});
      });
    }
  }

  private newItem(payment: PurchaseOrderPayment = null) {
    this.dataSource.addNewItem(payment);
    this.dataSource.renderItems();
    this.oForm.markAsDirty();

    if (!payment) {
      // Empty행 추가시 전에 선택된 결제수단을 설정해준다
      this.cacheService.getUserPreference(this.cacheService.keyLastSelectedPaymentMethodId)
      .then((id: number) => {
          if (id) {
            const formGroup = this.oFArray.controls[this.oFArray.controls.length - 1] as FormGroup;
            formGroup.patchValue({paymentMethodId: id});
          }
      });
    }
  }
  
  private deleteItem(item: any) {
    if (item.Obj.id || item.Obj.amount || item.Obj.paymentMethodId || item.Obj.remarkId) {
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
  }

  private _onChange = (_: any) => { };
  private _onTouched = () => {};

  writeValue(obj: any): void {
    this.value = obj;

    if (obj) {
      this.dataSource.loadItems(obj);
    }

    if (!obj || obj.length === 0) {
      if (this.dataSource.items.length === 0) {
        this.newItem();
      }
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
    if (event.value) {
      this.cacheService.setUserPreference(this.cacheService.keyLastSelectedPaymentMethodId, event.value);
    }
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
