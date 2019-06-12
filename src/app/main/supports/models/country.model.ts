import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class Country extends OliveTrackingAttribute {
    id?: number;
    code: string;
    name: string;
    activated?: boolean;
}
