import { AbstractControl, ValidatorFn } from '@angular/forms';

import { String } from 'typescript-string-operations';

import { OliveConstants } from './constants';
import { CustomsRule } from 'app/main/shippings/models/customs/customs-rule.model';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

/**
 * 입력 콤마 문자열의 요소들이 모두 option 배열과 매치되는지 검사
 * 예: 입력: 일반,건기식,비타 <-> option 배열 : [일반, 건기식]
 * 상기예는 비타가 option 배열에 없기때문에 오류로 판단됨
 * @param options 
 * @returns validator 
 */
export function customsTypeCodeValidator(customsRules: Map<string, any>, required: boolean): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        return isCustomsTypeCodeError(control.value.toString().trim(), customsRules, required);
    };
}

/**
 * 입력 콤마 문자열의 요소들이 모두 option 배열과 매치되는지 검사
 * 예: 입력: 일반,건기식,비타 <-> option 배열 : [일반, 건기식]
 * 상기예는 비타가 option 배열에 없기때문에 오류로 판단됨
 * @param inputValue 검사 문자열
 * @param customsRules 세관 규칙
 * @param required 필수요소 여부
 * @returns customs type code error 오류가 없으면 Null을 반환
 */
export function isCustomsTypeCodeError(inputValue: string, customsRules: Map<string, any>, required: boolean): { [key: string]: any } | null {
    if (!inputValue) { inputValue = ''; }

    const customsTypeCodes = customsRules.get(OliveConstants.customsRule.typeCodes.toUpperCase()) as string[];

    if (!customsTypeCodes || customsTypeCodes.length === 0) {
        return null;
    }

    if (required) {
        if (inputValue.length === 0) {
            return { required: true };
        }
    }

    const words: Set<string> = new Set<string>();
    for (let word of inputValue.split(',')) {
        word = word.trim();

        // Empty인 경우 (일반,,,목록 또는 ,,일반, 입력) 스킵 
        // 백앤드 저장시 다시 정리
        if (word.length === 0) { continue; }

        // 입력단어가 options와 매치되지 않는다면
        if (!customsTypeCodes.find(x => x.toUpperCase() === word.toUpperCase())) {
            return { customsMatch: customsTypeCodes.join() };
        }

        if (words.has(word)) {
            return { customsDuplicated: word };
        }
        words.add(word.toUpperCase());
    }

    // 입력 예: ,,,,인경우 차단
    if (words.size === 0) {
        if (required) {
            return { required: true };
        }
        return null;
    }

    for (const code of Array.from(customsRules.keys())) {
        // 국가별 세관 규칙이 아닐 경우 스킵,
        if (!code.toUpperCase().includes(OliveConstants.customsRule.ruleCountryCode.toUpperCase())) { continue; }

        const rule = customsRules.get(code.toUpperCase()) as CustomsRule;

        // 필수 그룹코드가 없으면 스킵 
        // 예: (그룹코드:통관타입)-(종속 타입:일반/목록)
        if (!rule.requiredGroupCodes || rule.requiredGroupCodes.length === 0) { continue; }

        for (const groupCode of rule.requiredGroupCodes) {
            const groupRules = rule.types.filter(x => x.groupCode && x.groupCode.toUpperCase() === groupCode.toUpperCase());
            // 일반,목록 이렇게 동일한 그룹코드 타입을 모두 입력한것을 검사
            const intersection = groupRules.filter(y => Array.from(words.keys()).includes(y.code.toUpperCase()));

            if (intersection.length === 0) {
                // 필수 입력에서 일반 / 목록 중 모두 입력 안했다면
                if (required) {
                    return { customsRequired: groupRules.map(x => x.code).join() };
                }
            }

            // 일반,목록과 같이 동일 그룹코드 타입을 모두 입력하였다면,
            if (intersection.length > 1) {
                return { customsOneType: intersection.map(x => x.code).join() };
            }
        }
    }

    return null;
}

/**
 * 통관 타입 유효화 검사 추가
 * @param control 
 * @returns true if invalid
 */
export function addCustomsTypeErrorByControl(control: any): boolean {
    let hasError: boolean;
    if (!control.errors) {
        return false;
    }

    if (control.errors.hasOwnProperty('customsMatch')) {
        hasError = true;
    }
    else if (control.errors.hasOwnProperty('customsDuplicated')) {
        hasError = true;
    }
    else if (control.errors.hasOwnProperty('customsRequired')) {
        hasError = true;
    }
    else if (control.errors.hasOwnProperty('customsOneType')) {
        hasError = true;
    }
    return hasError;
}

/**
 * 통관 타입 유효화 검사 오류 메시지 추가
 * @param control 
 * @param message 
 * @returns 오류메시지
 */
export function addCustomsTypeErrorMessageByControl(control: AbstractControl, translator: FuseTranslationLoaderService) {
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
