import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class Address extends OliveTrackingAttribute {
    id?: number;
    address1: string;
    address2: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    countryId?: number;
}
