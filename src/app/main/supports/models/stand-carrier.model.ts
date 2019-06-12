import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class StandCarrier extends OliveTrackingAttribute {
    id?: number;
    code: string;
    name: string;
    webSite: string;
    memo: string;
    data: string;
    activated?: boolean;
}
