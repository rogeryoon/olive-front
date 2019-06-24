import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { Address } from 'app/core/models/address.model';

export class Branch extends OliveTrackingAttribute {
    id?: number;
    code: string;
    name: string;
    outsourcing?: boolean;
    private?: boolean;
    activated?: boolean;
    phoneNumber: string;
    faxNumber: string;
    email: string;
    weekdayBusinessHours: string;
    weekendBusinessHours: string;
    addressFk?: Address;
}
