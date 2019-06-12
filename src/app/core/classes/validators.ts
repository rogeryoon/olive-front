import { AbstractControl, ValidatorFn } from '@angular/forms';
import { OliveUtilities } from './utilities';

export function numberValidator(maxDigits: number, required: boolean = true, min: number = 0, max: number = 2147483647 ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        let stringValue = '';

        if (control.value) {
            stringValue = String(control.value);
            stringValue = stringValue.replace(/\s/g, '');
        }

        if (required) {
            if (stringValue.length === 0) {
                return { required : true };
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

            if (!OliveUtilities.isNumber(stringValue, maxDigits)) {
                return { number : maxDigits };
            }
        }

        return null;
    };
}

export function volumeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (control.value) {
            if (OliveUtilities.volume(control.value) != null) {
                return null;
            }
            
            return { pattern : true };
        }
        return null;
    };
}

export function subsetValidator(originalValue: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const originalTrimValue = originalValue.trim();
        const entryTrimValue = control.value.toString().trim();

        if (originalTrimValue.length === 0) {
            return null;
        }
        else if (entryTrimValue.length === 0) {
            return { subset : true };
        }

        if (originalValue.includes(entryTrimValue)) {
            return null;
        }

        return { subset : true };
    };
}
