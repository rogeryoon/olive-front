import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { String } from 'typescript-string-operations';

import { Currency } from 'app/main/supports/models/currency.model';
import { OliveUtilities } from 'app/core/classes/utilities';
import { Address } from 'app/core/models/core/address.model';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

@Component({
  selector: 'olive-base',
  template: ''
})
export class OliveBaseComponent implements OnInit {
  standCurrency: Currency;
  currencies: Currency[];

  oForm: FormGroup;
  oFormArray: FormArray;
  isNewItem = false;

  constructor(protected translater: FuseTranslationLoaderService) { }

  ngOnInit() {
  }

  //#region Utilities
  commaNumber(amount: number) {
    return OliveUtilities.numberFormat(amount, 0, null);
  }

  numberFormat(amount: number, digits = 0, zero = null) {
    return OliveUtilities.numberFormat(amount, digits, zero);
  }

  isNull(input: any): boolean {
    return OliveUtilities.testIsUndefined(input);
  }

  id36(input: number): string {
    return OliveUtilities.convertToBase36(input);
  }

  date(input: any): string {
    return OliveUtilities.getShortDate(input);
  }

  moment(input: any): string {
    return OliveUtilities.getMomentDate(input);
  }  

  dateCode(date: any, id: number = 0): string {
    return OliveUtilities.dateCode(date, id);
  }  

  boolValue(value?: boolean): boolean {
    return value == null ? true : value;
  }

  address(address: Address): string {
    return OliveUtilities.showAddress(address);
  }
  //#endregion Utilities

  //#region Forms
  getControl(name): any {
    return this.oForm.get(name);
  }

  get oFArray(): FormArray {
    return <FormArray>this.getControl('formarray');
  }

  protected arrayErrorMessage(name: string, index: number): string {
    return this.controlErrorMessage(this.getArrayFormGroup(index).get(name));
  }
  
  protected errorMessage(name: string): string {
    return this.controlErrorMessage(this.getControl(name));
  }

  private controlErrorMessage(control: AbstractControl): string {
    let message = '';

    if (OliveUtilities.testIsUndefined(control.errors) || !control.touched) {
      return '';
    }

    if (control.errors.hasOwnProperty('required')) {
      message = this.translater.get('common.validate.required');
    }
    else
    if (control.errors.hasOwnProperty('pattern')) {
      message = this.translater.get('common.validate.pattern');
    }    
    else
    if (control.errors.hasOwnProperty('number')) {
      let decimal = '';
      decimal = String.Format(this.translater.get('common.validate.decimal'), control.errors.number);
      message = String.Format(this.translater.get('common.validate.number'), decimal);
    }
    else
    if (control.errors.hasOwnProperty('min')) {
      message = String.Format(this.translater.get('common.validate.minNumber'), control.errors.min);
    }
    else
    if (control.errors.hasOwnProperty('max') ) {
      message = String.Format(this.translater.get('common.validate.maxNumber'), control.errors.max);
    }

    return message;
  }

  getArrayFormGroup(index: number): FormGroup {
    return this.oFArray.controls[index] as FormGroup;
  }

  hasArrayEntryError(name: string, index: number): boolean {
    return this.controlHasEntryError(this.getArrayFormGroup(index).get(name));
  }

  hasArrayThisError(name: string, errorName: string, index: number): boolean {
    const control = this.getArrayFormGroup(index).get(name);
    
    if (OliveUtilities.testIsUndefined(control.errors)) {
      return false;
    }

    return control.errors.hasOwnProperty(errorName);
  }

  hasEntryError(name: string): boolean {
    return this.controlHasEntryError(this.getControl(name));
  }

  private controlHasEntryError(control: any): boolean {
    let hasError = false;

    if (OliveUtilities.testIsUndefined(control.errors)) {
      return hasError = false;
    }
    else 
    if (control.errors.hasOwnProperty('required')) {
      hasError = true;
    }
    else
    if (control.errors.hasOwnProperty('pattern')) {
      hasError = true;
    }
    else
    if (control.errors.hasOwnProperty('number')) {
      hasError = true;
    }
    else
    if (control.errors.hasOwnProperty('min')) {
      hasError = true;
    }
    else
    if (control.errors.hasOwnProperty('max')) {
      hasError = true;
    }

    return control.touched && hasError;
  }
  //#endregion Forms
}
