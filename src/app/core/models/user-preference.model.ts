import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';

export class UserPreference extends OliveTrackingAttribute {
    id?: number;
    userAuditKey: string;
    dataKey: string;
    data: string;
}
