import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { MarketExcelInterface } from './market-excel-interface';

export class Market extends OliveTrackingAttribute {
    id?: number;
    code: string;
    name: string;
    phoneNumber: string;
    email: string;
    webSite: string;
    memo: string;
    internalTransaction: boolean;
    activated?: boolean;
    companyGroupId: number;
    marketExcelInterfaceId: number;
    marketExcelInterfaceFk?: MarketExcelInterface;
}
