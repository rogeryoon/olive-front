import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { Company } from './company.model';
import { Branch } from './branch.model';

export class Warehouse extends OliveTrackingAttribute {
    id?: number;
    code: string;
    name: string;
    activated?: boolean;
    companyId?: number;
    companyFk?: Company;
    companyMasterBranchId?: number;
    companyMasterBranchFk?: Branch;

    selected?: boolean;
}
