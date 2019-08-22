import { CarrierTrackingIssueDto } from './carrier-tracking-issue.model';

export class OrderShipOutTrackingNumberIssue {
    carrierId?: number;
    branchId?: number;
    companyGroupId?: number;
    carrierTrackingIssues?: CarrierTrackingIssueDto[];
}
