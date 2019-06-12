import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class MarketItemMappingExcelColumn extends OliveTrackingAttribute {
    id?: number;
    name?: number;
    matchValue?: string;
    originalValue?: string;
    readOnly?: boolean;
    partMatch?: boolean;
    matchSearch?: boolean;
    userVisible?: boolean;
    priority?: number;
}
