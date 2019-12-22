import { String } from 'typescript-string-operations';

import { SearchUnit } from '../models/search-unit';
import { Address } from '../models/address.model';
import { testIsUndefined } from './object-helpers';

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
 * @returns true if money
 */
export function isMoneyPattern(input: string): boolean {
    return /^\s*\d*(\.\d{1,2})?\s*$/.test(input);
}

/**
 * Make the string to camel case
 * @param input 
 * @returns camelized string
 */
export function camelize(str): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) { return ''; } // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

/**
 * Determines whether number pattern is
 * @param input 
 * @returns  
 */
export function isNumberPattern(input: string) {
    return /^\s*\d*\s*$/.test(input);
}

/**
 * Webs site host name
 * @param url 
 * @returns site host name 
 */
export function webSiteHostName(url: string): string {
    url = webSiteUrl(url);

    if (url == null) { return null; }

    return getLocation(url).hostname.replace(/www./gi, '');
}

/**
 * Gets location
 * @param url 
 * @returns location 
 */
export function getLocation(url: string): any {
    const l = document.createElement('a');
    l.href = url;
    return l;
}

/**
 * Adjusts url
 * @param url 
 * @returns url 
 */
export function adjustUrl(url: string): string {
    // remove prefix
    url = url.replace(/https?:\/\//gi, '');
    // append standard url type
    return 'http://' + url;
}

/**
 * Webs site url
 * @param url 
 * @returns site url 
 */
export function webSiteUrl(url: string): string {
    if (!url) { return null; }

    url = adjustUrl(url);
    const valid = isValidWebSiteUrl(url);

    if (!valid) { return null; }

    return url;
}

/**
 * Determines whether valid web site url is
 * @param url 
 * @returns true if valid web site url 
 */
export function isValidWebSiteUrl(url: string): boolean {
    return /^https?:\/\/[^ "]+$/i.test(url);
}

/**
 * 구분자로 정리된 HashSet구성
 * @param input 입력
 * @param [delimiter] 구분자
 * @returns string HashSet
 */
export function getDelimiterSet(input: string, delimiter: string = ','): Set<string> {
    const words = new Set<string>();
    for (const word of input.split(delimiter)) {
        words.add(word.trim());
    }
    return words;
}

/**
 * Trims string by max length
 * @param input 
 * @param maxLength 
 * @returns string by max length 
 */
export function trimStringByMaxLength(input: string, maxLength: number): string {
    return input.length > maxLength ? input.substring(0, maxLength - 3) + '...' : input;
}

/**
 * Splits sticky words
 * 예: TowerRecord => Tower,Record
 * @param input 
 * @param separator 
 * @returns sticky words 
 */
export function splitStickyWords(input, separator): string {
    const words: string[] = [];
    const exp = /[A-Z][a-z]+/g;

    let match = exp.exec(input);

    while (match != null) {
        words.push(match[0]);
        match = exp.exec(input);
    }

    return words.join(separator);
}

/**
 * Adds count tooltip
 * @param count 
 * @param [tooltip] 
 * @returns count tooltip 
 */
export function addCountTooltip(count: number, tooltip: string = null): string {
    const tooltipAttribute = tooltip ? ` title="${tooltip.replace(/["']/gi, '')}"` : '';
    // ov-td-click를 추가해야지 이중 팝업이 되질 않는다.
    return `<span class="added-count ov-td-click"${tooltipAttribute}>+${count}</span>`;
}

/**
 * Gets items name
 * @param items 
 * @returns  
 */
export function getItemsName(items: any[], propertyName: string = 'name', numberPropertyName: string = null): string {
    let itemsName = '-';

    if (items && items.length > 0) {
        const itemName = items[0][propertyName];
        itemsName = numberPropertyName ? `${itemName}(${items[0][numberPropertyName]})` : itemName;

        if (items.length > 1) {
            let index = 0;
            itemsName += addCountTooltip(
                items.length - 1, 
                items.filter(x => ++index > 1)
                    .map(x => numberPropertyName ? `${x[propertyName]}(${x[numberPropertyName]})` : x[propertyName])
                    .join('\r\n')
            );
        }
    }

    return itemsName;
}

/**
 * To trim string
 * @param input 
 * @returns  
 */
export function toTrimString(input: any) {
    let returnValue = '';
    if (!testIsUndefined(input)) {
        returnValue = input.toString().trim();
    }
    return returnValue;
}

/**
 * Regex 패턴으로 검색 치환
 * @param input 
 * @param units 
 * @returns 치환 결과값 
 */
export function replaceValue(input: string, units: SearchUnit[], index: number = null): string {
    for (const unit of units) {
        if (!testIsUndefined(unit.appliedIndex) && index !== unit.appliedIndex) {
            continue;
        }

        if (unit.exclusive) {
            const matches = input.match(unit.searchPattern);
            if (matches && matches.length > 0) {
                return matches[0];
            }
        }
        else {
            input = input.replace(unit.searchPattern, unit.replaceValue ? unit.replaceValue : '');
        }
    }
    return input;
}

/**
 * 주소 요소들을 한 문자열로 표현
 * @param address 
 * @returns address 
 */
export function showAddress(address: Address): string {
    const values = [];

    values.push(address.address1);

    if (address.address2) {
        values.push(address.address2);
    }

    if (address.city) {
        values.push(address.city);
    }

    if (address.stateProvince) {
        values.push(address.stateProvince);
    }

    if (address.postalCode) {
        values.push(address.postalCode);
    }

    return values.join(' ');
}

/**
 * Shows param message
 * @param template 
 * @param [firstValue] 
 * @param [secondValue] 
 * @returns param message 
 */
export function showParamMessage(template: string, firstValue: string = null, secondValue: string = null): string {
    let message = null;
    if (!testIsUndefined(firstValue)) {
        message = String.Format(template, ` [${firstValue}]`);
    }
    else if (!testIsUndefined(secondValue)) {
        message = String.Format(template, ` ${secondValue}`);
    }
    else {
        message = String.Format(template, '');
    }

    return message;
}
