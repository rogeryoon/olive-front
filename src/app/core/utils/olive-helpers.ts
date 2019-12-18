import { OliveConstants } from '../classes/constants';
import { PurchaseOrder } from 'app/main/purchasings/models/purchase-order.model';


/**
 * 참/거짓 아이콘을 반환
 * @param condition 
 * @returns 아이콘 이름
 */
export function checkIcon(condition: boolean): string {
    return condition ? OliveConstants.iconStatus.checked : OliveConstants.iconStatus.unchecked;
}

export function purchaseOrderId(item: PurchaseOrder): string {
    return `${this.dateCode(item.date)}-${item.shortId}`;
}