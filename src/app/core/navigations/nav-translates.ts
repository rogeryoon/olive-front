export class NavTranslates {
    static Group = class {
        static product = 'navi.group.product';
        static config = 'navi.group.config';
    };
    
    static Purchase = class {
        static group = 'navi.purchase.group';
        static list = 'navi.purchase.list';
        static entry = 'navi.purchase.entry';
        static inWarehousePending = 'navi.purchase.inWarehousePending';
        static cancel = 'navi.purchase.cancel';
        static cancelEntry = 'navi.purchase.cancelEntry';
    };

    static InWarehouse = class {
        static group = 'navi.inWarehouse.group';
        static entry = 'navi.inWarehouse.entry';
        static list = 'navi.inWarehouse.list';
        static status = 'navi.inWarehouse.status';        
    };

    static Product = class {
        static home = 'navi.product.home';
                
        static productHome = 'navi.product.productHome';
        static productGroup = 'navi.product.productGroup';
        static productVariant = 'navi.product.productVariant';

        static inventoryGroup = 'navi.product.inventoryGroup';
        static inventoriesBalance = 'navi.product.inventoriesBalance';
        static inventoriesWarehouse = 'navi.product.inventoriesWarehouse';
        static inventoriesHistory = 'navi.product.inventoriesHistory';
    };

    static Company = class {
        static group = 'navi.company.group';

        static list = 'navi.company.list';
        static groupList = 'navi.company.groupList';
        static branch = 'navi.company.branch';
        static supplier = 'navi.company.supplier';
        static warehouse = 'navi.company.warehouse';
        static paymentMethod = 'navi.company.paymentMethod';
        static market = 'navi.company.market';
        static marketSeller = 'navi.company.marketSeller';
    };

    static Basic = class {
        static group = 'navi.basic.group';

        static currency = 'navi.basic.currency';
        static country = 'navi.basic.country';
        static carrier = 'navi.basic.carrier';
        static standCarrier = 'navi.basic.standCarrier';
        static carrierTrackingNumberRange = 'navi.basic.carrierTrackingNumberRange';
    };

    static Sales = class {
        static group = 'navi.sales.group';

        static orderList = 'navi.sales.orderList';
        static shipOutPackageLister = 'navi.sales.shipOutPackageLister';
        
        static marketExcels = 'navi.sales.marketExcels';
        static marketExcelRows = 'navi.sales.marketExcelRows';
        static matchItems = 'navi.sales.matchItems';
    };    

    static Secure = class {
        static group = 'navi.secure.group';

        static user = 'navi.secure.user';
        static role = 'navi.secure.role';
    };
}

