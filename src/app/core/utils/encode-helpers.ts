import { testIsUndefined } from './object-helpers';

/**
 * Make 36 Type Radom ID;
 * @param length 
 * @returns id 
 */
export function make36Id(length: number): string {
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
