import { OliveConstants } from '../classes/constants';
import { PurchaseOrder } from 'app/main/purchasings/models/purchase-order.model';
import { get6DigitDate } from './date-helper';


/**
 * 참/거짓 아이콘을 반환
 * @param condition 
 * @returns 아이콘 이름
 */
export function checkIcon(condition: boolean): string {
    return condition ? OliveConstants.iconStatus.checked : OliveConstants.iconStatus.unchecked;
}

/**
 * Purchases order id
 * @param item 
 * @returns order id 
 */
export function purchaseOrderId(item: PurchaseOrder, datePropertyName = 'date', shortIdPropertyName = 'shortId'): string {
    return `${get6DigitDate(item[datePropertyName])}-${item[shortIdPropertyName]}`;
}

/**
 * Created date + shortId
 * @param item 
 * @returns date id 
 */
export function createdDateShortId(item: any, datePropertyName = 'createdUtc', shortIdPropertyName = 'shortId'): string {
    return `${get6DigitDate(item[datePropertyName])}-${item[shortIdPropertyName]}`;
}

/**
 * Adds activated cache key
 * @param key 
 * @returns activated cache key 
 */
export function addActivatedCacheKey(key: string): string {
    return key + OliveConstants.cacheSubKey + '-';
}
