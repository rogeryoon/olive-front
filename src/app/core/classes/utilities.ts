import { DecimalPipe } from '@angular/common';
import { FormGroup } from '@angular/forms';

import { String } from 'typescript-string-operations';

import * as moment from 'moment';

import { NameValue } from '../models/name-value';

import { OliveConstants } from './constants';
import { Address } from '../models/address.model';
import { UserName } from '../models/user-name';

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

    /**
     * Date을 표준 포맷 (예:2013-02-13 13:15:15) 문자열로 변환
     * @param date 
     * @param [showTime] 시간 표시/비표시
     * @returns date string 
     */
    public static isoDateString(date: any, showTime: boolean = false): string {
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

    /**
     * 공용으로 사용되는 id, updatedUser, updatedUtc, createdUser, createdUtc를 가져옴
     */
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
        if (!this.isValid36Id(input)) { return 0; }
        return parseInt(input, 36);
    }

    public static isNumber(input: string, maxDigits: number): boolean {
        let decimalPattern = '';

        if (maxDigits > 0) {
            decimalPattern = `(\\.\\d{1,${maxDigits}})?`;
        }

        const pattern = new RegExp(`^\\s*\\d*${decimalPattern}\\s*$`);

        return pattern.test(input);
    }

    public static minNumber(array: number[], addedNumbers: number[] = []): string {
        let returnValue = '';

        array = array.concat(addedNumbers).filter(a => a !== null);

        if (array.length > 0) {
            returnValue = Math.min(...array).toString();
        }

        return returnValue;
    }

    public static maxNumber(array: number[], addedNumbers: number[] = []): string {
        let returnValue = '';

        array = array.concat(addedNumbers).filter(a => a !== null);

        if (array.length > 0) {
            returnValue = Math.max(...array).toString();
        }

        return returnValue;
    }

    /**
    * Number를 형식에 맞게 표시
    * @param amount 타겟 표시 숫자
    * @param [digits] 소숫점 자릿수
    * @param [zero] 0일 경우 숫자대체 문자열
    * @returns 포맷 반환 문자열
    */
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

    public static showParamMessage(template: string, firstValue: string = null, secondValue: string = null): string {
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

    public static dateCode(date: any, id: number = 0): string {
        if (id === 0) {
            return OliveUtilities.getDateCode(date);
        }
        else {
            return this.convertToBase36(id) + '-' + OliveUtilities.getDateCode(date);
        }
    }

    public static volume(volumeString: string): number | null {
        const stringValues = volumeString.trim().split(/[ ,]+/).filter(Boolean);

        if (
            stringValues.length === 3 &&
            this.isNumber(stringValues[0], 2) &&
            this.isNumber(stringValues[1], 2) &&
            this.isNumber(stringValues[2], 2)
        ) {
            return +(+stringValues[0] * +stringValues[1] * +stringValues[2]).toFixed(2);
        }

        return null;
    }

    public static volumeWeight(volume: number, lengthTypeCode: string, weightTypeCode: string): number {

        let inchVolume = volume;
        // Centimeter
        if (lengthTypeCode === 'C') {
            inchVolume = volume * OliveConstants.unitConversionRate.centimeterToInchVolume;
        }

        const poundVolumeWeight = +(inchVolume / 166).toFixed(2);

        let returnVolumeWeight = poundVolumeWeight;
        // Kilogram
        if (weightTypeCode === 'K') {
            returnVolumeWeight = poundVolumeWeight * OliveConstants.unitConversionRate.poundToKilo;
        }

        return +(returnVolumeWeight).toFixed(2);
    }

    public static renderVolumeWeight(volumeCtrl: any, weightTypeCtrl: any, lengthTypeCtrl: any) {
        if (volumeCtrl && weightTypeCtrl && weightTypeCtrl.selected && lengthTypeCtrl && lengthTypeCtrl.selected) {
            const volumeValue = this.volume(volumeCtrl.value);
            const weightTypeCode = weightTypeCtrl.selected.value;
            const lengthTypeCode = lengthTypeCtrl.selected.value;

            if (volumeValue != null) {
                const symbol = OliveConstants.weightTypes.find(e => e.code === weightTypeCode).symbol;

                const volumeWeight = this.numberFormat(this.volumeWeight(volumeValue, lengthTypeCode, weightTypeCode), 2);

                return `${volumeWeight} ${symbol}`;
            }
        }
        return '';
    }

    public static searchOption(extSearches: NameValue[], orderColumnName: string, sort: string = 'asc'): any {
        const option =
        {
            columns: [{ data: orderColumnName }],
            order: [{ column: 0, dir: sort }],
            length: 0
        };

        if (extSearches && extSearches.length > 0) {
            option['extSearch'] = extSearches;
        }

        return option;
    }

    public static showEventDateAndName(date: any, userName: UserName) {
        let value = null;

        if (!date && !userName) {
            return null;
        }

        if (userName && userName.fullName) {
            value = userName.fullName;
        }

        if (date) {
            if (value) {
                value = `${this.getMomentDate(date)} - ${value}`;
            }
            else {
                value = this.getMomentDate(date);
            }
        }

        return value;
    }
}

