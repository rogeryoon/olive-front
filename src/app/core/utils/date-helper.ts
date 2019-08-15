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

