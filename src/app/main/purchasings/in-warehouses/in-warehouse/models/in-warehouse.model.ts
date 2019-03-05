import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { InWarehouseItem } from './in-warehouse-item.model';
import { Warehouse } from 'app/main/supports/companies/models/warehouse.model';

export class InWarehouse extends OliveTrackingAttribute {
    id?: number;
    memo: string;
    wareHouseId: number;
    wareHouseFk: Warehouse;
    inWarehouseItems?: InWarehouseItem[];
}
