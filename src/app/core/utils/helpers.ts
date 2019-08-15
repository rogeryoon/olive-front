import { NameValue } from '../models/name-value';
import { DecimalPipe } from '@angular/common';
import { OliveConstants } from '../classes/constants';

export function isUndefined(value: any) {
    return typeof value === 'undefined';
}

export function isFunction(value: any) {
    return typeof value === 'function';
}

export function isNumberType(value: any) {
    return typeof value === 'number';
}

export function isString(value: any) {
    return typeof value === 'string';
}

export function isBoolean(value: any) {
    return typeof value === 'boolean';
}

export function isObject(value: any) {
    return value !== null && typeof value === 'object';
}

export function isNumberFinite(value: any) {
    return isNumberType(value) && isFinite(value);
}

export function applyPrecision(num: number, precision: number) {
    if (precision <= 0) {
        return Math.round(num);
    }

    const tho = 10 ** precision;

    return Math.round(num * tho) / tho;
}

export function extractDeepPropertyByMapKey(obj: any, map: string): any {
    const keys = map.split('.');
    const head = keys.shift();

    return keys.reduce((prop: any, key: string) => {
        return !isUndefined(prop) && !isUndefined(prop[key])
            ? prop[key]
            : undefined;
    }, obj[head || '']);
}

export function getKeysTwoObjects(obj: any, other: any): any {
    return [...Object.keys(obj), ...Object.keys(other)]
        .filter((key, index, array) => array.indexOf(key) === index);
}

/**
 * Determines whether null or whitespace is
 * @param input 
 * @returns true if null or whitespace 
 */
export function isNullOrWhitespace(input): boolean {
    if (typeof input === 'undefined' || input == null) { return true; }
    return input.replace(/\s/g, '').length < 1;
}

/**
 * Filters not null name values
 * @param array 
 * @returns not null name values 
 */
export function filterNotNullNameValues(array: NameValue[]): NameValue[] {
    array.forEach(e => {
        if (e.value instanceof Date) {
            e.value = isoDateString(e.value);
        }
    });

    return array.filter(e => !isNullOrWhitespace(e.value));
}

/**
 *  Date을 표준 포맷 (예:2013-02-13 13:15:15) 문자열로 변환
 * @param date 
 * @param [showTime] 시간 표시/비표시
 * @returns date string 
 */
export function isoDateString(date: any, showTime: boolean = false): string {
    if (date instanceof Date) {
        let month = '' + (date.getMonth() + 1);
        let day = '' + date.getDate();
        const year = date.getFullYear();

        if (month.length < 2) { month = '0' + month; }
        if (day.length < 2) { day = '0' + day; }

        let hour = '' + (date.getHours());
        let minute = '' + (date.getMinutes());
        let second = '' + (date.getSeconds());

        if (hour.length < 2) { hour = '0' + hour; }
        if (minute.length < 2) { minute = '0' + minute; }
        if (second.length < 2) { second = '0' + second; }

        return [year, month, day].join('-') + (showTime ? ' ' + [hour, minute, second].join(':') : '');
    }
    else {
        return null;
    }
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

/**
 * 참/거짓 아이콘을 반환
 * @param condition 
 * @returns 아이콘 이름
 */
export function checkIcon(condition: boolean): string {
    return condition ? OliveConstants.iconStatus.checked : OliveConstants.iconStatus.unchecked;
}

/**
 * 입력 문자열이 필요 소숫점 자릿수를 가지고 있는지 확인
 * @param input 문자열
 * @param maxPrecision 최대 소숫점 자릿수
 * @returns true if number 
 */
export function isNumber(input: string, maxPrecision: number): boolean {
    let decimalPattern = '';

    if (maxPrecision > 0) {
        decimalPattern = `(\\.\\d{1,${maxPrecision}})?`;
    }

    const pattern = new RegExp(`^\\s*\\d*${decimalPattern}\\s*$`);

    return pattern.test(input);
}


/**
 * Determines whether money pattern is
 * @param input 
 * @returns  
 */
export function isMoneyPattern(input: string) {
    return /^\s*\d*(\.\d{1,2})?\s*$/.test(input);
}

/**
 * Determines whether number pattern is
 * @param input 
 * @returns  
 */
export function isNumberPattern(input: string) {
    return /^\s*\d*\s*$/.test(input);
}

