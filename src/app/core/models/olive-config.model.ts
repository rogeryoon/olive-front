import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class OliveConfig extends OliveTrackingAttribute {
    id?: number;
    code: string;
    name: string;
    data: string;
}
