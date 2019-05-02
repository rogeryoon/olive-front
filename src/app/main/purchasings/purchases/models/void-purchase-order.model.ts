import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { InWarehouse } from '../../in-warehouses/models/in-warehouse.model';
import { CarrierTracking } from 'app/main/shippings/bases/models/carrier-tracking.model';
import { PurchaseOrder } from './purchase-order.model';

export class VoidPurchaseOrder extends OliveTrackingAttribute {
    id?: number;
    closedDate?: any;
    confirmedDate?: any;

    inWarehouseFk?: InWarehouse;

    purchaseOrderFk?: PurchaseOrder;    

    returnTrackings?: CarrierTracking[];
}
