import { FormGroup } from '@angular/forms';
import { camelCase } from 'lodash';

import { NameValue } from '../models/name-value';
import { isoDateString } from './date-helper';

/**
 * Tests is undefined
 * @param value 
 * @returns true if is undefined 
 */
export function testIsUndefined(value: any): boolean {
    return typeof value === 'undefined' || value == null;
}

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
 * 공용으로 사용되는 id, updatedUser, updatedUtc, createdUser, createdUtc를 가져옴
 */
export function itemWithIdNAudit(source: any, referItem): any {
    source.id = referItem.id;
    source.updatedUser = referItem.updatedUser;
    source.updatedUtc = referItem.updatedUtc;
    source.createdUser = referItem.createdUser;
    source.createdUtc = referItem.createdUtc;
    return source;
}

/**
 * Marks form group touched
 * @param formGroup 
 */
export function markFormGroupTouched(formGroup: FormGroup): void {
    (<any>Object).values(formGroup.controls).forEach(control => {
        control.markAsTouched();

        if (control.controls) {
            markFormGroupTouched(control);
        }
    });
}

/**
 * Object Property 첫글자가 대문자인것을 소문자로 변경
 * 재귀함수 호출로 Nested Object 모두 적용됨
 * @param obj 
 * @returns 변경완료 Object
 */
export function camelizeKeys(obj) {
    if (Array.isArray(obj)) {
        return obj.map(v => camelizeKeys(v));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce(
            (result, key) => ({
                ...result,
                [camelCase(key)]: camelizeKeys(obj[key]),
            }),
            {},
        );
    }
    return obj;
}