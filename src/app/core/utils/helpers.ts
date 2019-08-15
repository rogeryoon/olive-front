import { NameValue } from '../models/name-value';
import { OliveConstants } from '../classes/constants';
import { isoDateString } from './date-helper';

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
    return input.toString().replace(/\s/g, '').length < 1;
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
 * 참/거짓 아이콘을 반환
 * @param condition 
 * @returns 아이콘 이름
 */
export function checkIcon(condition: boolean): string {
    return condition ? OliveConstants.iconStatus.checked : OliveConstants.iconStatus.unchecked;
}

