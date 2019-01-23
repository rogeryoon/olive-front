import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class Currency extends OliveTrackingAttribute {
    id?: number;
    code: string;
    name: string;
    symbol: string;
    decimalPoint?: number;
    activated?: boolean;
}
