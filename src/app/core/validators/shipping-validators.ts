import { ValidatorFn, AbstractControl } from '@angular/forms';
import { volume } from '../utils/shipping-helpers';
import { trimInput } from './general-validators';

/**
 * 부피 입력 검사
 * @returns validator 
 */
export function volumeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const stringValue = trimInput(control);
        
        if (stringValue.length > 0) {
            if (volume(stringValue) != null) {
                return null;
            }

            return { pattern: true };
        }
        return null;
    };
}

/**
 * Tracking number validator
 * @returns number validator 
 */
export function trackingNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const stringValue = trimInput(control);

        if (stringValue.length > 0) {
            // 현재는 숫자만 허용된다.
            // 향후 배송사에 맞는 송장번호 유효성검사 필요
            if (stringValue.match(/^\d+$/)) {
                return null;
            }

            return { pattern: true };
        }
        
        return null;
    };
}
