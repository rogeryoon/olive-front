import { AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
import { isNumber } from '../utils/string-helper';

/**
 * Trims input
 * @param control 
 * @returns input 
 */
export function trimInput(control: AbstractControl): string {
    let stringValue = '';

    if (control.value) {
        stringValue = String(control.value);
        stringValue = stringValue.trim();
    }

    return stringValue;
}

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
        const stringValue = trimInput(control);

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
 * Required validator For Whitespace Input
 */
export function requiredValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const stringValue = trimInput(control);

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
        const entryValue = trimInput(control);

        if (originalTrimValue.length === 0) {
            return null;
        }
        else if (entryValue.length === 0) {
            return { subset: true };
        }

        if (originalValue.includes(entryValue)) {
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
            if (trimInput(control.get(name)).length >  0) {
                return null;
            }
        }

        return { requiredAny: true };
    };
}

/**
 * Control중 하나라도 입력이되었으면 나머지 모두 입력되었는지 검사, 모두 입력 안되었으면 Ok
 * @param controlNames 
 * @returns all or none validator 
 */
export function requiredAllOrNoneValidator(controlNames: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (!control.touched) {
            return null;
        }

        let containsValueCount = 0;
        for (const name of controlNames) {
            if (trimInput(control.get(name)).length >  0) {
                containsValueCount++;
            }
        }

        if (containsValueCount === controlNames.length || containsValueCount === 0) {
            return null;
        }

        return { requiredAllOrNone: true };
    };
}

/**
 * 시작과 끝이 올바른 범위가 아니면 오류 반환
 * @param start 
 * @param end 
  */
export function rangeValidator(startNumberName: string, endNumberName: string, currentNumberName: string = null): ValidatorFn{
    return (control: AbstractControl): { [key: string]: any } | null => {
        const startNumberString = trimInput(control.get(startNumberName));
        const endNumberString = trimInput(control.get(endNumberName));

        // 미입력인 경우 Validation를 하지 않는다. 
        // (다른 Validator가 모든 검사를 하고 이 Validation은 최종 검사이다.)
        if (startNumberString.length === 0 || endNumberString.length === 0) {
            return null;
        }

        const startNumber = +startNumberString;
        const endNumber = +endNumberString;

        let currentNumber = null;
        if (currentNumberName && control.get(currentNumberName)) {
            const temp = trimInput(control.get(currentNumberName));
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

/**
 * Equals validator
 * @param controlName 
 * @returns validator 
 */
export function equalValidator(controlName: string): ValidatorFn
{
    return (control: AbstractControl): { [key: string]: any } =>
    {
        const compareControl = control.parent ? control.parent.get(controlName) : null;
        const areEqual = compareControl && control.value === compareControl.value;
        return areEqual ? null : { notEqual: true };
    };
}
