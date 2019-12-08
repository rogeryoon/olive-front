import * as moment from 'moment';

import { UserName } from '../models/user-name';
import { convertToBase36 } from './encode-helpers';

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
 * Gets moment short date
 * @param date 
 * @returns short date 
 */
export function getShortDate(date: any): string {
    moment.locale();
    return moment(date).format('L');
}

/**
 * Get 6digit date
 * 예) 191231
 * @param date 
 * @returns digit date 
 */
export function get6DigitDate(date: any): string {
    moment.locale();
    return moment(date).format('YYMMDD');
}

/**
 * Gets moment date
 * @param date 
 * @returns moment date 
 */
export function getMomentDate(date: any): string {
    if (!date) { return ''; }

    moment.locale();
    return moment(date).fromNow();
}

/**
 * Shows event date and name
 * @param date 
 * @param userName 
 * @returns event date and name 
 */
export function showEventDateAndName(date: any, userName: UserName): string {
    let value = null;

    if (!date && !userName) {
        return null;
    }

    if (userName && userName.fullName) {
        value = userName.fullName;
    }

    if (date) {
        if (value) {
            value = `${getMomentDate(date)} - ${value}`;
        }
        else {
            value = getMomentDate(date);
        }
    }

    return value;
}

/**
 * Base36 + Dates code
 * @param date 
 * @param [id] 
 * @returns code 
 */
export function dateCode(date: any, id: number = 0): string {
    if (id === 0) {
        return get6DigitDate(date);
    }
    else {
        return convertToBase36(id) + '-' + get6DigitDate(date);
    }
}