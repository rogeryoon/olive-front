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
        static group = 'navi.company.group';

        static list = 'navi.company.list';
        static groupList = 'navi.company.groupList';
        static branch = 'navi.company.branch';
        static vendor = 'navi.company.vendor';
        static warehouse = 'navi.company.warehouse';
        static paymentMethod = 'navi.company.paymentMethod';
    };

    static Basic = class {
        static group = 'navi.basic.group';

        static currency = 'navi.basic.currency';
        static country = 'navi.basic.country';
        static carrier = 'navi.basic.carrier';
    };

    static Secure = class {
        static group = 'navi.secure.group';

        static user = 'navi.secure.user';
        static role = 'navi.secure.role';
    };
}

