import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { PurchaseOrderPayment } from './purchase-order-payment.model';
import { PurchaseOrderItem } from './purchase-order-item.model';
import { Supplier } from 'app/main/supports/models/supplier.model';
import { Warehouse } from 'app/main/supports/models/warehouse.model';
import { Currency } from 'app/main/supports/models/currency.model';

export class PurchaseOrder extends OliveTrackingAttribute {
    id?: number;
    supplierOrderId?: string;
    date?: any;
    memo?: string;
    totalAmount?: number;
    addedDiscountAmount?: number;
    freightAmount?: number;
    taxAmount?: number;
    totalDueAmount?: number;
    currencyExchangeRate?: number;
    closedDate?: any;
    inWarehouseCompletedDate?: any;
    printOutCount?: number;
    lastPrintOutUser?: string;

    supplierId?: number;
    supplierFk?: Supplier;

    warehouseId?: number;
    warehouseFk?: Warehouse;

    currencyId?: number;
    currencyFk?: Currency;

    purchaseOrderPayments?: PurchaseOrderPayment[];
    purchaseOrderItems?: PurchaseOrderItem[];

    tagPurchaseOrderItem?: PurchaseOrderItem;
    tagCode?: string;
}
