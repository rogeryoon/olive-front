export class OliveContants {
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

    static CacheKeys = class {
        static PaymentMethod = 'paymentmethod';
        static UserName = 'usr';
    };

    static ForegroundColor = class {
        static Blue = 'foreground-blue';
        static Orange = 'foreground-orange';
        static Red = 'foreground-red';
    };

    static IconStatus = class {
        static Checked = 'check';
        static Unchecked = 'remove';
        static Pending = 'access_time';
        static Error = 'error_outline';
        static Completed = 'check';
    };
}
