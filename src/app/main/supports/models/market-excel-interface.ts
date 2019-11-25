import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class MarketExcelInterface extends OliveTrackingAttribute {
    id?: number;
    name: string;
    memo: string;
    data: string;
    activated: boolean;
}
