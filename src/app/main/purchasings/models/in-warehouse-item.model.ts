import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class InWarehouseItem extends OliveTrackingAttribute {
    id?: number;
    purchaseOrderClosed?: boolean;
    quantity?: number;
    balance?: number;
    purchaseOrderItemId?: number;
    inWarehouseId?: number;
    inWarehouseShortId?: number;
    inWarehouseCreatedDate?: any;

    productVariantId?: number;    
    productVariantShortId?: number;
    productName?: string;    

    originalBalance?: number;
    appliedCost?: number;
    supplierName?: string;

    purchaseOrderId?: number;
    purchaseOrderShortId?: number;
    purchaseOrderDate?: any;
}
