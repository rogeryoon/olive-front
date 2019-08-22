import { AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
import { volume } from '../utils/shipping-helpers';
import { isNumber } from '../utils/string-helper';

/**
 * 다목적 숫자 입력 검사
 * @param maxDigits 최대 숫자
 * @param [required] 
 * @param [min] 
 * @param [max] 
 * @returns validator 
 */
export function numberValidator(maxDigits: number, required: boolean = true, min: number = 0, max: number = 2147483647): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        let stringValue = '';

        if (control.value) {
            stringValue = String(control.value);
            stringValue = stringValue.replace(/\s/g, '');
        }

        if (required) {
            if (stringValue.length === 0) {
                return { required: true };
            }
        }

        if (stringValue.length > 0) {
            const numberValue = +stringValue;

            if (numberValue < min) {
                return { min: min };
            }

            if (numberValue > max) {
                return { max: max };
            }

            if (!isNumber(stringValue, maxDigits)) {
                return { number: maxDigits };
            }
        }

        return null;
    };
}

/**
 * 부피 입력 검사
 * @returns validator 
 */
export function volumeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.value) {
            if (volume(control.value) != null) {
                return null;
            }

            return { pattern: true };
        }
        return null;
    };
}

/**
 * Required validator For Whitespace Input
 */
export function requiredValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        let stringValue = '';

        if (control.value) {
            stringValue = String(control.value);
            stringValue = stringValue.replace(/\s/g, '');
        }

        if (stringValue.length === 0) {
            return { required: true };
        }

        return null;
    };
}

/**
 * 입력이 원본 문자열의 부분 문자열인지 검사
 * @param originalValue 
 * @returns validator 
 */
export function subsetValidator(originalValue: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const originalTrimValue = originalValue.trim();
        const entryTrimValue = control.value.toString().trim();

        if (originalTrimValue.length === 0) {
            return null;
        }
        else if (entryTrimValue.length === 0) {
            return { subset: true };
        }

        if (originalValue.includes(entryTrimValue)) {
            return null;
        }

        return { subset: true };
    };
}

/**
 * 입력 컨트롤중 모두 입력이 안되었으면 오류 반환
 */
export function requiredAnyValidator(controlNames: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (!control.touched) {
            return null;
        }

        for (const name of controlNames) {
            if (control.get(name).value.toString().trim().length >  0) {
                return null;
            }
        }

        return { requiredAny: true };
    };
}

/**
 * 시작과 끝이 올바른 범위가 아니면 오류 반환
 * @param start 
 * @param end 
  */
export function rangeValidator(startNumberName: string, endNumberName: string, currentNumberName: string = null): ValidatorFn{
    return (control: AbstractControl): { [key: string]: any } | null => {
        const startNumberString = control.get(startNumberName).value.toString().trim();
        const endNumberString = control.get(endNumberName).value.toString().trim();

        // 미입력인 경우 Validation를 하지 않는다. 
        // (다른 Validator가 모든 검사를 하고 이 Validation은 최종 검사이다.)
        if (startNumberString.length === 0 || endNumberString.length === 0) {
            return null;
        }

        const startNumber = +startNumberString;
        const endNumber = +endNumberString;

        let currentNumber = null;
        if (currentNumberName && control.get(currentNumberName)) {
            const temp = control.get(currentNumberName).value.toString().trim();
            if (temp.length > 0) {
                currentNumber = +temp;
            }
        }

        if (currentNumber) {
            return (startNumber < endNumber && startNumber <= currentNumber && currentNumber <= endNumber) ? null : { range: 'T' };
        }
        else {
            return startNumber < endNumber ? null : { range: 'F' };
        }
    };
}
