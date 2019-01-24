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

    static iconChecked = 'check';
    static iconUnchecked = 'remove';

    static CacheKeys = class {
        static PaymentMethod = 'paymentmethod';
    };
}
