import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { PurchaseOrderPayment } from './purchase-order-payment.model';
import { PurchaseOrderItem } from './purchase-order-item.model';
import { Vendor } from 'app/main/supports/companies/models/vendor.model';
import { Warehouse } from 'app/main/supports/companies/models/warehouse.model';
import { Currency } from 'app/main/supports/bases/models/currency.model';

export class PurchaseOrder extends OliveTrackingAttribute {
    id?: number;
    vendorOrderId: string;
    date?: any;
    memo: string;
    totalItemsAmount?: number;
    addedDiscountAmount?: number;
    freightAmount?: number;
    taxAmount?: number;
    totalDueAmount?: number;
    currencyExchangeRate?: number;
    closedDate?: any;
    inWareHouseCompletedDate?: any;
    printOutCount?: number;
    lastPrintOutUser: string;

    vendorId?: number;
    vendorFk?: Vendor;

    warehouseId?: number;
    warehouseFk?: Warehouse;

    currencyId?: number;
    currencyFk?: Currency;

    purchaseOrderPayments?: PurchaseOrderPayment[];
    purchaseOrderItems?: PurchaseOrderItem[];
}
