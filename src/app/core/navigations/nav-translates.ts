export class NavTranslates {
    static Purchase = class {
        static list = 'navi.purchase.list';
        static entry = 'navi.purchase.entry';
        static inWarehousePending = 'navi.purchase.inWarehousePending';
        static cancel = 'navi.purchase.cancel';
    };

    static InWarehouse = class {
        static group = 'navi.inWarehouse.group';
        static entry = 'navi.inWarehouse.entry';
        static list = 'navi.inWarehouse.list';
        static status = 'navi.inWarehouse.status';        
    };

    static Product = class {
        static Home = 'navi.product.home';
                
        static ProductHome = 'navi.product.productHome';
        static ProductGroup = 'navi.product.productGroup';
        static ProductVariant = 'navi.product.productVariant';

        static InventoryGroup = '';
        static InventoriesBalance = '';
        static InventoriesWarehouse = '';
        static InventoriesHistory = '';
    };

    static Company = class {
        static List = 'navi.company.list';
        static Group = 'navi.company.group';
        static Branch = 'navi.company.branch';
        static Vendor = 'navi.company.vendor';
        static Warehouse = 'navi.company.warehouse';
        static PaymentMethod = 'navi.company.paymentMethod';
    };

    static Basic = class {
        static Currency = 'navi.basic.currency';
        static Country = 'navi.basic.country';
    };
}

