export class NavTranslates {
    static Purchase = class {
        static List = 'navi.purchase.list';
        static Entry = 'navi.purchase.entry';
    };

    static InWarehouse = class {
        static Group = 'navi.inWarehouse.group';
        static Entry = 'navi.inWarehouse.entry';
        static List = 'navi.inWarehouse.list';
        static Pending = 'navi.inWarehouse.pending';
        static Status = 'navi.inWarehouse.status';
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

