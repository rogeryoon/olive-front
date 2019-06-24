import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { Address } from 'app/core/models/address.model';
import { CompanyGroup } from './company-group.model';

export class Company extends OliveTrackingAttribute {
    id?: number;
    code: string;
    name: string;
    phoneNumber?: string;
    memo: string;
    activated?: boolean;
    addressId?: number;
    addressFk?: Address;
    companyGroupId?: number;
    companyGroupFk?: CompanyGroup;
}
