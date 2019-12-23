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

/**
 * Determines whether undefined is
 * @param value 
 * @returns  
 */
export function isUndefined(value: any) {
    return typeof value === 'undefined';
}

/**
 * Determines whether function is
 * @param value 
 * @returns  
 */
export function isFunction(value: any) {
    return typeof value === 'function';
}

/**
 * Determines whether number type is
 * @param value 
 * @returns  
 */
export function isNumberType(value: any) {
    return typeof value === 'number';
}

/**
 * Determines whether string is
 * @param value 
 * @returns  
 */
export function isString(value: any) {
    return typeof value === 'string';
}

/**
 * Determines whether boolean is
 * @param value 
 * @returns  
 */
export function isBoolean(value: any) {
    return typeof value === 'boolean';
}

/**
 * Determines whether object is
 * @param value 
 * @returns  
 */
export function isObject(value: any) {
    return value !== null && typeof value === 'object';
}

/**
 * Determines whether number finite is
 * @param value 
 * @returns  
 */
export function isNumberFinite(value: any) {
    return isNumberType(value) && isFinite(value);
}

/**
 * Extracts deep property by map key
 * @param obj 
 * @param map 
 * @returns deep property by map key 
 */
export function extractDeepPropertyByMapKey(obj: any, map: string): any {
    const keys = map.split('.');
    const head = keys.shift();

    return keys.reduce((prop: any, key: string) => {
        return !isUndefined(prop) && !isUndefined(prop[key])
            ? prop[key]
            : undefined;
    }, obj[head || '']);
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

/**
 * Calculates object properties
 * @param item 
 * @param input 
 * @returns  
 */
export function calculateObjectProperties(item: any, input: string) {

    const f = {
      add: '+',
      sub: '-',
      div: '/',
      mlt: '*',
      mod: '%',
      exp: '^',
      ooo: null
    };
  
    // Create array for Order of Operation and precedence
    f.ooo = [
      [
        [f.mlt],
        [f.div],
        [f.mod],
        [f.exp]
      ],
      [
        [f.add],
        [f.sub]
      ]
    ];
  
    input = input.replace(/[^a-zA-Z0-9%^*\/()\-+.]/g, ''); // clean up unnecessary characters
  
    input = _replaceItemPropertiesToNumber(item, input);  
  
    // 연산자가 없을 경우 값만 반환
    if (!input.match(/[\*\+\-\%\^\/]/)) {
      return input;
    }
    
    let output;
    for (let i = 0, n = f.ooo.length; i < n; i++) {
  
      // Regular Expression to look for operators between floating numbers or integers
      const re = new RegExp('(\\d+\\.?\\d*)([\\' + f.ooo[i].join('\\') + '])(\\d+\\.?\\d*)');
      re.lastIndex = 0; // take precautions and reset re starting pos
  
      // Loop while there is still calculation for level of precedence
      while (re.test(input)) {
        output = _calculate(RegExp.$1, RegExp.$2, RegExp.$3);

        if (isNaN(output) || !isFinite(output)) { 
          return output;
        } // exit early if not a number

        input = input.replace(re, output);
      }
    }
  
    return output;
  
    function _replaceItemPropertiesToNumber(_item: any, _input: string): string {
      for (const propertyName of _input.match(/\w+/g)) {
        _input = _input.replace(propertyName, _item[propertyName]);
      }
      return _input;
    }
  
    function _calculate(a, op, b) {
      a = a * 1;
      b = b * 1;
      switch (op) {
        case f.add:
          return a + b;
          break;
        case f.sub:
          return a - b;
          break;
        case f.div:
          return a / b;
          break;
        case f.mlt:
          return a * b;
          break;
        case f.mod:
          return a % b;
          break;
        case f.exp:
          return Math.pow(a, b);
          break;
        default:
          return null;
      }
    }
}
