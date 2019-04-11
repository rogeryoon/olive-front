import { DecimalPipe } from '@angular/common';
import { FormGroup } from '@angular/forms';

import { String } from 'typescript-string-operations';

import * as moment from 'moment';

import { NameValue } from '../models/name-value';

import { OliveConstants } from './constants';
import { Address } from '../models/core/address.model';

export class OliveUtilities {
    public static isNullOrWhitespace(input): boolean {
        if (typeof input === 'undefined' || input == null) { return true; }
        return input.replace(/\s/g, '').length < 1;
    }

    public static filterNotNullNameValues(array: NameValue[]): NameValue[] {
        array.forEach(e => {
            if (e.value instanceof Date) {
                e.value = this.isoDateString(e.value);
            }
        });

        return array.filter(e => !this.isNullOrWhitespace(e.value));
    }

    public static isoDateString(date): string {
        if (date instanceof Date) {
            let month = '' + (date.getMonth() + 1);
            let day = '' + date.getDate();
            const year = date.getFullYear();

            if (month.length < 2) { month = '0' + month; }
            if (day.length < 2) { day = '0' + day; }

            return [year, month, day].join('-');
        }
        else {
            return null;
        }
    }

    public static splitStickyWords(input, separator): string {
        const words: string[] = [];
        const exp = /[A-Z][a-z]+/g;

        let match = exp.exec(input);

        while (match != null) {
            words.push(match[0]);
            match = exp.exec(input);
        }

        return words.join(separator);
    }

    public static getShortDate(date: any): string {
        moment.locale();
        return moment(date).format('L');
    }

    public static getDateCode(date: any): string {
        moment.locale();
        return moment(date).format('YYMMDD');
    }    

    public static getMomentDate(date: any): string {
        if (!date) { return ''; }

        moment.locale();
        return moment(date).fromNow();
    }

    public static testIsUndefined(value: any): boolean {
        return typeof value === 'undefined' || value == null;
    }

    public static markFormGroupTouched(formGroup: FormGroup): void {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    public static itemWithIdNAudit(source: any, referItem): any {
        source.id = referItem.id;
        source.updatedUser = referItem.updatedUser;
        source.updatedUtc = referItem.updatedUtc;
        source.createdUser = referItem.createdUser;
        source.createdUtc = referItem.createdUtc;
        return source;
    }

    public static iconName(condition: boolean): string {
        return condition ? OliveConstants.iconStatus.checked : OliveConstants.iconStatus.unchecked;
    }

    public static webSiteHostName(url: string): string {
        url = this.webSiteUrl(url);

        if (url == null) { return null; }

        return this.getLocation(url).hostname.replace(/www./gi, '');
    }

    public static getLocation(url: string): any {
        const l = document.createElement('a');
        l.href = url;
        return l;
    }

    private static adjustUrl(url: string): string {
        // remove prefix
        url = url.replace(/https?:\/\//gi, '');
        // append standard url type
        return 'http://' + url;
    }

    public static webSiteUrl(url: string): string {
        if (!url) { return null; }

        url = this.adjustUrl(url);
        const valid = this.isValidWebSiteUrl(url);

        if (!valid) { return null; }

        return url;
    }

    public static isValidWebSiteUrl(url: string): boolean {
        return /^https?:\/\/[^ "]+$/i.test(url);
    }

    public static make36Id(length: number): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    public static isValid36Id(id: string): boolean {
        if (this.testIsUndefined(id)) { return false; }
        return new RegExp('^[A-Za-z0-9]{1,6}$').test(id);
    }

    public static convertToBase36(input: number): string {
        if (this.testIsUndefined(input)) { return ''; }
        return input.toString(36).toUpperCase();
    }

    public static convertBase36ToNumber(input: string): number {
        if (this.isValid36Id(input)) { return 0; }
        return parseInt(input, 36);
    }

    public static minNumber(array: number[]): string {
        let returnValue = '';

        array = array.filter(a => a !== null);

        if (array.length > 0) {
            returnValue = Math.min(...array).toString();
        }

        return returnValue;
    }

    public static maxNumber(array: number[]): string {
        let returnValue = '';

        array = array.filter(a => a !== null);

        if (array.length > 0) {
            returnValue = Math.max(...array).toString();
        }

        return returnValue;
    }

    public static numberFormat(amount: number, digits = 0, zero = null): string {
        if (zero !== null && amount === 0) {
            return zero;
        }
        return new DecimalPipe('en-us').transform(amount, `1.${digits}-${digits}`);
    }

    public static addSpanAddedCount(count: number) {
        // ov-td-click를 추가해야지 이중 팝업이 되질 않는다.
        return `<span class="added-count ov-td-click">+${count}</span>`;
    }

    public static getItemsFirstName(items: any) {
        let returnValue = '-';
        if (items && items.length > 0) {
            returnValue = items[0].name;
            if (items.length > 1) {
                returnValue += this.addSpanAddedCount(items.length - 1);
            }
        }
        return returnValue;
    }

    public static getItemsFirstCode(items: any) {
        let returnValue = '-';
        if (items && items.length > 0) {
            returnValue = items[0].code;
            if (items.length > 1) {
                returnValue += this.addSpanAddedCount(items.length - 1);
            }
        }
        return returnValue;
    }

    public static toTrimString(input: any) {
        let returnValue = '';
        if (!this.testIsUndefined(input)) {
            returnValue = input.toString().trim();
        }
        return returnValue;
    }

    public static isMoneyPattern(input: string) {
        return /^\s*\d*(\.\d{1,2})?\s*$/.test(input);
    }

    public static isNumberPattern(input: string) {
        return /^\s*\d*\s*$/.test(input);
    }

    public static showAddress(address: Address) {
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

    public static showParamMessage(template: string, firstValue: string, secondValue: string = null): string {
        let message = null;
        if (!this.testIsUndefined(firstValue)) {
            message = String.Format(template, ` [${firstValue}]`);
        }
        else if (!this.testIsUndefined(secondValue)) {
            message = String.Format(template, ` ${secondValue}`);
        }
        else {
            message = String.Format(template, '');
        }

        return message;
    }
}

