import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class MarketExcelInterface extends OliveTrackingAttribute {
    id?: number;
    code: string;
    countryCode: string;
    name: string;
    activated?: boolean;
}
