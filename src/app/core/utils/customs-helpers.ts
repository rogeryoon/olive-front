import { String } from 'typescript-string-operations';
import { AbstractControl } from '@angular/forms';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

/**
 * 통관 타입 유효화 검사 오류 메시지 추가
 * @param control 
 * @param message 
 * @returns 오류메시지
 */
export function customsTypeErrorMessageByControl(control: AbstractControl, translator: FuseTranslationLoaderService): string {
    let message: string;
    if (!control.errors) {
        return null;
    }

    if (control.errors.hasOwnProperty('customsMatch')) {
      message = String.Format(translator.get('common.validate.customsMatch'), control.errors.customsMatch);
    }
    else if (control.errors.hasOwnProperty('customsDuplicated')) {
      message = String.Format(translator.get('common.validate.customsDuplicated'), control.errors.customsDuplicated);
    }
    else if (control.errors.hasOwnProperty('customsRequired')) {
      message = String.Format(translator.get('common.validate.customsRequired'), control.errors.customsRequired);
    }
    else if (control.errors.hasOwnProperty('customsOneType')) {
      message = String.Format(translator.get('common.validate.customsOneType'), control.errors.customsOneType);
    }
    return message;
}
