import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class CompanyGroupPreference extends OliveTrackingAttribute {
    id?: number;
    dataKey: string;
    data: string;
    companyGroupId?: number;
}
