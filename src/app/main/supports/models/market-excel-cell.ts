export enum MarketExcelCellTypes {
    LoginId,
    AccountNumber,
    OrderNumber,
    CarrierName,
    TrackingNumber,
    Misc
}

// 주의 : CamelCase로 변경하지 말것

export class MarketExcelCell {
    Index?: number;
    CellType?: MarketExcelCellTypes;
    DummyValue: string;
}
