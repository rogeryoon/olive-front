import { MarketExcelCell } from './market-excel-cell';

// 주의 : camel case로 바꾸지 말것

export class MarketExcelInterfaceRule {
    TrackingUploadColumnNames?: string[];
    TrackingUploadCells: MarketExcelCell[];
    TrackingUploadCarrierValues: object;

    // 현재 프론트에서 사용하지 않음
    // OrderColumnName?: MarketExcelColumnName;
    // OrderSanitizations?: MarketExcelColumnStringProcess;
    // OrderDefaultValues?: object;
}
