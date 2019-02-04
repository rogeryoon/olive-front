import { AbstractControl, ValidatorFn } from '@angular/forms';

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

            let decimalPattern = '';

            if (maxDigits > 0) {
                decimalPattern = `(\\.\\d{1,${maxDigits}})?`;
            }
    
            const patt =  new RegExp(`^\\s*\\d*${decimalPattern}\\s*$`);
    
            if (!patt.test(stringValue)) {
                return { number : maxDigits };
            }
        }

        return null;
    };
}
