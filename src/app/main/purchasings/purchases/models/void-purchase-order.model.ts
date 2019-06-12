import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { InWarehouse } from '../../models/in-warehouse.model';
import { CarrierTracking } from 'app/main/shippings/models/carrier-tracking.model';
import { PurchaseOrder } from '../../models/purchase-order.model';

export class VoidPurchaseOrder extends OliveTrackingAttribute {
    id?: number;
    closedDate?: any;
    confirmedDate?: any;

    inWarehouseFk?: InWarehouse;

    purchaseOrderFk?: PurchaseOrder;    

    returnTrackings?: CarrierTracking[];
}
