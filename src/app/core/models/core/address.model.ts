import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { Country } from 'app/main/supports/bases/models/country.model';

export class Address extends OliveTrackingAttribute {
    id?: number;
    address1: string;
    address2: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    countryId?: number;
}
