﻿import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class PurchaseOrderItem extends OliveTrackingAttribute {
    id?: number;
    quantity?: number;
    cancelQuantity?: number;
    balance?: number;
    price?: number;
    discount?: number;
    appliedCost?: number;
    otherCurrencyPrice?: number;
    remarks: string;
    productVariantId?: number;
    name: string;

    tagProcessed?: boolean;
}