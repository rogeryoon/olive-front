import { DecimalPipe } from '@angular/common';

/**
 * 반올림 숫자 반환
 * @param num 입력 숫자
 * @param precision 소숫점 자릿수
 * @returns 반올림 표현 
 */
export function applyPrecision(num: number, precision: number): number {
    if (precision <= 0) {
        return Math.round(num);
    }

    const tho = 10 ** precision;

    return Math.round(num * tho) / tho;
}

/**
 * Number를 형식에 맞게 표시
 * @param amount 타겟 표시 숫자
 * @param [digits] 소숫점 자릿수
 * @param [zero] 0일 경우 숫자대체 문자열
 * @returns 포맷 반환 문자열
 */
export function numberFormat(amount: number, digits = 0, zero = null): string {
    if (zero !== null && amount === 0) {
        return zero;
    }
    return new DecimalPipe('en-us').transform(amount, `1.${digits}-${digits}`);
}

/**
 * 배열 숫자중 최소값
 * @param array 
 * @param [addedNumbers] 추가 배열
 * @returns number 
 */
export function minNumber(array: number[], addedNumbers: number[] = []): string {
    let returnValue = '';

    array = array.concat(addedNumbers).filter(a => a !== null);

    if (array.length > 0) {
        returnValue = Math.min(...array).toString();
    }

    return returnValue;
}

/**
 * 배열 숫자중 최대값
 * @param array 
 * @param [addedNumbers] 추가 배열
 * @returns number 
 */
export function maxNumber(array: number[], addedNumbers: number[] = []): string {
    let returnValue = '';

    array = array.concat(addedNumbers).filter(a => a !== null);

    if (array.length > 0) {
        returnValue = Math.max(...array).toString();
    }

    return returnValue;
}


