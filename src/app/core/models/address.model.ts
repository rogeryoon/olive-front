import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class Address extends OliveTrackingAttribute {
    id?: number;
    address1: string;
    address2: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    countryId?: number;

    static joinedAddressNoCountry(input: Address): string {
        let address = '';

        if (input.postalCode) {
            address += input.postalCode + ' ';
        }

        if (input.stateProvince) {
            address += input.stateProvince + ' ';
        }

        if (input.city) {
            address += input.city + ' ';
        }

        if (input.address1) {
            address += input.address1 + ' ';
        }

        if (input.address2) {
            address += input.address2 + ' ';
        }

        return address.trim();
    }
}
