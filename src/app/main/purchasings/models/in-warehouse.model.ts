import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { InWarehouseItem } from './in-warehouse-item.model';
import { Warehouse } from 'app/main/supports/models/warehouse.model';

export class InWarehouse extends OliveTrackingAttribute {
    id?: number;
    shortId?: number;
    itemCount?: number;
    memo: string;
    warehouseId: number;
    warehouseFk: Warehouse;
    inWarehouseItems?: InWarehouseItem[];
}
