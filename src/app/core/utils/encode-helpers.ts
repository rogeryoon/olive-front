import { testIsUndefined } from './object-helpers';

/**
 * Make Base36 Radom ID
 * @param length 
 * @returns id 
 */
export function makeRandom36Id(length: number): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

/**
 * Determines whether valid36 id is
 * @param id 
 * @returns true if valid36 id 
 */
export function isValid36Id(id: string): boolean {
    if (testIsUndefined(id)) { return false; }
    return new RegExp('^[A-Za-z0-9]{1,6}$').test(id);
}

/**
 * Converts to base36 ID
 * @param input 
 * @returns base36 ID string
 */
export function convertToBase36(input: number): string {
    if (testIsUndefined(input)) { return ''; }
    return input.toString(36).toUpperCase();
}

/**
 * Converts base36 to number
 * @param input 
 * @returns base36 to number 
 */
export function convertBase36ToNumber(input: string): number {
    if (!isValid36Id(input)) { return 0; }
    return parseInt(input, 36);
}

/**
 * Converts number to excel column name style id (1 => A, 27 => AA)
 * @param num 
 * @returns to excel column name style id 
 */
export function convertToBase26(num: number): string {
    let alpha = '';

    num--;
    for (; num >= 0; num = parseInt((num / 26).toString(), 10) - 1) {
      alpha = String.fromCharCode(num % 26 + 0x41) + alpha;
    }

    return alpha;
}

/**
 * Converts excel column name style id to number (A => 1, AA => 27)
 * @param val 
 * @returns excel column name style id to number 
 */
export function convertBase26ToNumber(val: string): number {
    const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = 0;
  
    for (let i = 0, j = val.length - 1; i < val.length; i += 1, j -= 1) {
      result += Math.pow(base.length, j) * (base.indexOf(val[i]) + 1);
    }
  
    return result;
}
  

