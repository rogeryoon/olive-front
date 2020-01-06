import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { InWarehouse } from './in-warehouse.model';
import { CarrierTracking } from 'app/main/shippings/models/carrier-tracking.model';
import { PurchaseOrder } from './purchase-order.model';

export class VoidPurchaseOrder extends OliveTrackingAttribute {
    id?: number;
    voidTypeCode?: string;
    closedDate?: any;
    confirmedDate?: any;
    confirmedUser?: string;

    inWarehouseFk?: InWarehouse;

    purchaseOrderFk?: PurchaseOrder;    

    returnTrackings?: CarrierTracking[];
}
