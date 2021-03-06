export class OliveConstants {
    static weightTypes = [
        { code: 'L', name: 'Pound', symbol: 'Lb' },
        { code: 'K', name: 'Kilogram', symbol: 'Kg' }
    ];

    static weightTypeCode = class {
        static Pound = 'L';
        static Kilogram = 'K';
    };

    static lengthTypes = [
        { code: 'I', name: 'Inch', symbol: 'In' },
        { code: 'C', name: 'Centimeter', symbol: 'Cm' }
    ];

    static voidPurchaseOrderTypes = [
        { code: 'R', name: 'Return' },
        { code: 'C', name: 'Cancel' }
    ];

    static voidPurchaseOrderTypeCode = class {
        static Return = 'R';
        static Cancel = 'C';
    };

    static unitConversionRate = class {
        static centimeterToInchVolume = 0.06102374409;
        static poundToKilo = 0.45359237;
        static kiloToPound = 2.204622621848787;
    };

    static countries = [
        { value: 'KR', name: 'Korea' },
        { value: 'US', name: 'USA' },
        { value: 'JP', name: 'Japan' },
        { value: 'DE', name: 'China' },
        { value: 'CN', name: 'Germany' }
    ];

    static foregroundColor = class {
        static blue = 'foreground-blue';
        static orange = 'foreground-orange';
        static red = 'foreground-red';
    };

    static iconStatus = class {
        static checked = 'check';
        static unchecked = 'clear';
        static pending = 'access_time';
        static error = 'error_outline';
        static completed = 'check';
        static locked = 'lock';
        static unlocked = 'lock_open';
    };

    static orderStatus = class {
        static pending = 'access_time';
        static canceled = 'cancel';
        static shipped = 'local_shipping';
    };

    static style = class {
        static footerCell = 'text-align: right; padding-right: 0px;';
    };

    static contextMenu = class {
        static all = 'all';
        static newItem = 'newItem';
        static excel = 'excel';
        static print = 'print';
        static upload = 'upload';
    };

    static customButton = class {
        static cancelOrder = 'cancelOrder';
        static restoreOrder = 'restoreOrder';
        static splitOrder = 'splitOrder';
    };

    static customsRule = class {
        static typeCodes = 'CustomsRule-TypeCodes';
        static ruleCountryCode = 'CustomsRule-';
    };

    static listerConfigType = class {
        static customsConfigs = 'customsConfigs';
        static carrierTrackingNumbersGroups = 'carrierTrackingNumbersGroups';
        static countries = 'countries';
    };

    static constant = class {
        static carrierTrackingNumberRangeEventKey = 'numbersGroup';
        static serverValidationDelimiter = '||';
        static selected = 'selected';
    };

    static uiConfig = class {
        static maxErrorMessageLength = 400;
    };

    static shipOutIcon = class {
        static shortageQuantityIcon = 'shopping_cart';
        static nullWeightIcon = 'view_agenda';
        static nullCustomsPriceIcon = 'attach_money';
        static customsTypeCodeErrorIcon = 'comment';
        static customsSameTypeMaxQuantityIcon = 'offline_bolt';
        static customsOneItemMaxQuantityIcon = 'computer';
        static customsTotalMaxPriceIcon = 'monetization_on';
        static customsAddUpCustomsTaxingIcon = 'control_point_duplicate';
    };

    static cacheSubKey = class {
        static activated = 'activated';
    };

    static listExtraCommand = class {
        static close = 'close';
        static open = 'open';
        static print = 'print';
        static confirm = 'confirm';
    };
}
