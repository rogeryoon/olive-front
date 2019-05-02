export class OliveConstants {
    static weightTypes = [
        { code: 'L', name: 'Pound', symbol: 'Lb' },
        { code: 'K', name: 'Kilogram', symbol: 'Kg' }
    ];

    static countries = [
        { value: 'KR', name: 'Korea' },
        { value: 'US', name: 'USA' },
        { value: 'JP', name: 'Japan' },
        { value: 'DE', name: 'China' },
        { value: 'CN', name: 'Germany' }
    ];

    static cacheKeys = class {
        static paymentMethod = 'paymentmethod';
        static userName = 'usr';
    };

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
}



