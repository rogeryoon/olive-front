import { OliveConstants } from '../classes/constants';

import { PurchaseOrder } from 'app/main/purchasings/models/purchase-order.model';
import { get6DigitDate, getShortDate } from './date-helper';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';


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
 * Purchases order status remark
 * @param item 
 * @param translator 
 * @returns order status remark 
 */
export function purchaseOrderStatusRemark(item: PurchaseOrder, translator: FuseTranslationLoaderService): string {
    let returnValue = '';

    if (item.closedDate) {
        returnValue = translator.get('purchasing.purchaseOrder.closedStatus');
        returnValue = `[${returnValue}-${getShortDate(item.closedDate)}]`;
    }
    else {
        returnValue = `[${translator.get('purchasing.purchaseOrder.pendingStatus')}]`;
    }

    return returnValue;
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
    return key + OliveConstants.cacheSubKey.activated + '-';
}

/**
 * 유저가 마우스로 문자를 선택한 값이 있을 경우 참을 반환
 */
export function hasTextSelection(): boolean {
    const selection = window.getSelection();

    // User가 문자를 복사하려고 하는 경우엔 편집창을 팝업하지 않는다.
    if (selection && selection.type === 'Range') {
        return true;
    }

    return false;
}
