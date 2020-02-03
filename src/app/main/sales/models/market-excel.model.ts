import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class MarketExcel extends OliveTrackingAttribute {
    id?: number;
    transferredUtc?: any;    
    companyGroupId?: number;
    interfaceId?: number;
    interfaceName?: string;
    excelRowCount?: number;
    duplicatedOrderCount?: number;
    mappingItemCount?: number;
    orderTransferredCount?: number;
}
