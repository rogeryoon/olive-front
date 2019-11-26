import { OliveTrackingAttribute } from 'app/core/classes/tracking-attribute';
import { MarketExcelInterfaceRule } from './market-excel-interface-rule';

export class MarketExcelInterface extends OliveTrackingAttribute {
    id?: number;
    name: string;
    memo: string;
    data: string;
    activated: boolean;

    rule: MarketExcelInterfaceRule;
}
