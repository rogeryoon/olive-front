export class NavUrls {
    static Purchase = class {
        static Base = '/purchases';        
        // static PurchaseOrderList = 'find_in_page';
        
        // static Purchase = 'add_shopping_cart';
        static PurchaseEntry = NavUrls.Purchase.Base + 'orders/';
        // static PurchaseViewGroup = 'assessment';
        // static PurchaseView =  'find_in_page';
        // static PurchaseStats = 'business_center';
        // static PurchasePending = 'assistant_photo';
        // static PaymentMethod = 'card_membership';
    };

    static Product = class {
        // static Home = 'offline_pin';
       
        // static ProductHome = 'shopping_basket';
        // static ProductGroup = 'add_shopping_cart';
        // static ProductVariant = 'card_giftcard';

        // static InventoryGroup = 'check_box';
        // static InventoriesBalance = 'compare';
        // static InventoriesWarehouse = 'import_contacts';
        // static InventoriesHistory = 'class';
    };

    static Company = class {
        // static List = 'domain';
        // static Group = 'dns';
        // static Branch = 'account_balance';
        // static Supplier = 'forum';
        // static Warehouse = 'store';
    };

    static Basic = class {
        // static Currency = 'attach_money';
        // static Country = 'landscape';
    };    
}



