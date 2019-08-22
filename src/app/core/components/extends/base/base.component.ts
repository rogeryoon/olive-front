import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { String } from 'typescript-string-operations';

import { Currency } from 'app/main/supports/models/currency.model';
import { OliveUtilities } from 'app/core/classes/utilities';
import { Address } from 'app/core/models/address.model';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { numberFormat } from 'app/core/utils/number-helper';

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

  constructor(protected translator: FuseTranslationLoaderService) { }

  ngOnInit() {
  }

  //#region Utilities

  /**
   * 123,345 같은 콤마형식 숫자로 변환
   * @param amount 
   * @returns  
   */
  commaNumber(amount: number) {
    return numberFormat(amount, 0, null);
  }

  /**
   * Number를 형식에 맞게 표시
   * @param amount 타겟 표시 숫자
   * @param [digits] 소숫점 자릿수
   * @param [zero] 0일 경우 숫자대체 문자열
   * @returns 포맷 반환 문자열
   */
  numberFormat(amount: number, digits = 0, zero = null): string {
    return numberFormat(amount, digits, zero);
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
  /**
   * Gets control
   * @param name 
   * @returns control 
   */
  getControl(name): AbstractControl {
    return this.oForm.get(name);
  }

  get oFArray(): FormArray {
    return <FormArray>this.getControl('formArray');
  }

  protected arrayErrorMessage(name: string, index: number): string {
    return this.errorMessageByControl(this.getArrayFormGroup(index).get(name));
  }

  get hasRangeError() {
    return this.oForm.errors && this.oForm.errors['range'];
  }

  protected rangeErrorMessage(startNumberName: string, endNumberName: string, currentNumberName: string = null): string {
    const errorValue = this.oForm.errors['range'];

    // currentNumberName까지 들어간 입력양식에 오류가 발생한경우라면
    if (errorValue === 'T') {
      return String.Format(this.translator.get('common.validate.rangePlusCurrentValue'), startNumberName, endNumberName, currentNumberName);
    }

    return String.Format(this.translator.get('common.validate.range'), startNumberName, endNumberName);
  }

  /**
   * 입력 컨트롤중 모두 입력이 안되었으면 표시하는 메시지
   * @param inputNames Input User Names
   * @returns error message 
   */
  protected requiredAnyErrorMessage(inputNames: string[]): string {
    const inputNamesString = inputNames.join();
    return String.Format(this.translator.get('common.validate.requiredAny'), inputNamesString);
  }
  
  /**
   * Get error message
   * @param name Control Name
   * @returns error message 
   */
  protected errorMessage(name: string): string {
    return this.errorMessageByControl(this.getControl(name));
  }

  /**
   * Errors message by control
   * @param control 
   * @returns error message
   */
  protected errorMessageByControl(control: AbstractControl): string {
    let message = '';

    if (OliveUtilities.testIsUndefined(control.errors) || !control.touched) {
      return '';
    }

    if (control.errors.hasOwnProperty('required')) {
      message = this.translator.get('common.validate.required');
    }
    else
    if (control.errors.hasOwnProperty('pattern')) {
      message = this.translator.get('common.validate.pattern');
    }    
    else
    if (control.errors.hasOwnProperty('number')) {
      let decimal = '';
      decimal = String.Format(this.translator.get('common.validate.decimal'), control.errors.number);
      message = String.Format(this.translator.get('common.validate.number'), decimal);
    }
    else
    if (control.errors.hasOwnProperty('min')) {
      message = String.Format(this.translator.get('common.validate.minNumber'), control.errors.min);
    }
    else
    if (control.errors.hasOwnProperty('max') ) {
      message = String.Format(this.translator.get('common.validate.maxNumber'), control.errors.max);
    }

    return message;
  }

  /**
   * Gets array form group
   * @param index 
   * @returns array form group 
   */
  getArrayFormGroup(index: number): FormGroup {
    return this.oFArray.controls[index] as FormGroup;
  }
  
  /**
   * Determines whether array entry error has
   * @param name 
   * @param index 
   * @returns true if array entry error 
   */
  hasArrayEntryError(name: string, index: number): boolean {
    return this.hasEntryErrorByControl(this.getArrayFormGroup(index).get(name));
  }

  /**
   * Determines whether array error has
   * @param name 
   * @param errorName 
   * @param index 
   * @returns true if array entry error 
   */
  hasArrayThisError(name: string, errorName: string, index: number): boolean {
    const control = this.getArrayFormGroup(index).get(name);
    
    if (OliveUtilities.testIsUndefined(control.errors)) {
      return false;
    }

    return control.errors.hasOwnProperty(errorName);
  }

  /**
   * Determines whether entry error has
   * @param name 
   * @returns true if entry error 
   */
  hasEntryError(name: string): boolean {
    return this.hasEntryErrorByControl(this.getControl(name));
  }

  /**
   * Determines whether entry error
   * @param control 
   * @returns true if entry error
   */
  protected hasEntryErrorByControl(control: any): boolean {
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
