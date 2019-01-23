import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { Company } from './company.model';
import { CompanyGroupSetting } from 'app/core/models/company-group-setting.model';

export class CompanyGroup extends OliveTrackingAttribute {
    id?: number;
    name: string;
    memo: string;
    companyGroupSettingFk?: CompanyGroupSetting;
    companies?: Company[];
    activated?: boolean;
}
