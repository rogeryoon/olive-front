import { FuseNavigation } from '@fuse/types';

import { NavIcons } from './nav-icons';
import { NavTranslates } from './nav-translates';

export const defaultNavigation: FuseNavigation[] = [
    {
        id: 'purchase',
        title: '발주',
        translate: 'navi.purchase.purchase',
        type: 'group',
        icon: NavIcons.Purchase.Purchase,
        children: [
            {
                id: 'purchaseViewGroup',
                title: '발주서',
                translate: 'navi.purchase.viewGroup',
                type: 'collapsable',
                icon: NavIcons.Purchase.PurchaseViewGroup,
                children: [
                    {
                        id: 'purchaseOrderList',
                        title: '발주서 목록',
                        translate: NavTranslates.Purchase.PurchaseOrderList,
                        type: 'item',
                        icon: NavIcons.Purchase.PurchaseOrderList,
                        url: '/purchases/purchase-orders'
                    },
                    {
                        id: 'purchaseEntry',
                        title: '발주서 작성',
                        translate: NavTranslates.Purchase.PurchaseEntry,
                        type: 'item',
                        icon: NavIcons.Purchase.PurchaseEntry,
                        url: '/purchases/orders/0'
                    },                    
                    // {
                    //     id: 'purchaseStats',
                    //     title: '발주서 현황',
                    //     translate: 'navi.purchase.stats',
                    //     type: 'item',
                    //     icon: NavIcons.Purchase.PurchaseStats,
                    //     url: '/purchases/stats',
                    //     badge: {
                    //         title: '25',
                    //         bg: '#F44336',
                    //         fg: '#FFFFFF'
                    //     }
                    // },
                    {
                        id: 'purchasePending',
                        title: '미입고 현황',
                        translate: 'navi.purchase.pending',
                        type: 'item',
                        icon: NavIcons.Purchase.PurchasePending,
                        url: '/purchases/peding',
                        badge: {
                            title: '13',
                            bg: '#F44336',
                            fg: '#FFFFFF'
                        }
                    }
                ]
            }
        ]
    },
    {
        id: 'product',
        title: '제품',
        translate: NavTranslates.Product.Home,
        type: 'group',
        icon: NavIcons.Product.Home,
        children: [
            {
                id: 'productHome',
                title: '제품',
                translate: NavTranslates.Product.ProductHome,
                type: 'collapsable',
                icon: NavIcons.Product.ProductHome,
                children: [
                    {
                        id: 'products',
                        title: '제품 그룹',
                        translate: NavTranslates.Product.ProductGroup,
                        type: 'item',
                        icon: NavIcons.Product.ProductGroup,
                        url: '/products/group'
                    },
                    {
                        id: 'products',
                        title: '제품',
                        translate: NavTranslates.Product.ProductVariant,
                        type: 'item',
                        icon: NavIcons.Product.ProductVariant,
                        url: '/products/variant'
                    }
                ]
            },
            {
                id: 'inventoryGroup',
                title: '재고 목록',
                translate: 'navi.product.invetoryGroup',
                type: 'collapsable',
                icon: NavIcons.Product.InventoryGroup,
                children: [
                    {
                        id: 'inventoriesBalance',
                        title: '재고 조회',
                        translate: 'navi.product.inventoriesBalance',
                        type: 'item',
                        icon: NavIcons.Product.InventoriesBalance,
                        url: '/inventories/balance'
                    },
                    {
                        id: 'inventoriesWarehouse',
                        title: '창고별 재고',
                        translate: 'navi.product.inventoriesWarehouse',
                        type: 'item',
                        icon: NavIcons.Product.InventoriesWarehouse,
                        url: '/inventories/warehouse'
                    },
                    {
                        id: 'inventoriesHistory',
                        title: '품목별 재고',
                        translate: 'navi.product.inventoriesHistory',
                        type: 'item',
                        icon: NavIcons.Product.InventoriesHistory,
                        url: '/inventories/history'
                    }
                ]
            },
            {
                id: 'inventoryEdit',
                title: '재고 조정',
                type: 'collapsable',
                icon: 'settings_input_component',

                children: [
                    {
                        id: 'inventoryEntry',
                        title: '입고',
                        type: 'item',
                        icon: 'border_all',
                        url: '/inventory/entry',
                        badge: {
                            title: '13',
                            bg: '#09d261',
                            fg: '#FFFFFF'
                        }
                    },
                    {
                        id: 'inventoryAdjust',
                        title: '재고 수동조정',
                        type: 'item',
                        icon: 'content_cut',
                        url: '/inventory/adjust'
                    },
                    {
                        id: 'inventoryTransfer',
                        title: '재고 창고이동',
                        type: 'item',
                        icon: 'games',
                        url: '/inventory/transfer'
                    },
                    {
                        id: 'inventoryReturn',
                        title: '반품 / 폐기',
                        type: 'item',
                        icon: 'import_export',
                        url: '/inventory/return'
                    }
                ]
            }
        ]
    },
    {
        id: 'sales',
        title: '판매',
        type: 'group',
        icon: 'add_shopping_cart',
        children: [
            {
                id: 'salesEntry',
                title: '판매 등록',
                type: 'item',
                icon: 'payment',
                url: '/sales/new'
            },
            {
                id: 'salesShipOut',
                title: '판매 출고',
                type: 'item',
                icon: 'local_shipping',
                url: '/sales/shipout',
                badge: {
                    title: '186',
                    bg: '#F44336',
                    fg: '#FFFFFF'
                }
            },
            {
                id: 'salesViewGroup',
                title: '판매 목록',
                type: 'collapsable',
                icon: 'camera_enhance',

                children: [
                    {
                        id: 'salesView',
                        title: '판매 조회',
                        type: 'item',
                        icon: 'account_circle',
                        url: '/sales/view'
                    },
                    {
                        id: 'salesStats',
                        title: '판매 현황',
                        type: 'item',
                        icon: 'all_inclusive',
                        url: '/sales/stats'
                    },
                    {
                        id: 'salesProfit',
                        title: '이익 현황',
                        type: 'item',
                        icon: 'local_atm',
                        url: '/sales/profit'
                    }
                ]
            }
        ]
    },
    {
        id: 'config',
        title: '환경설정',
        type: 'group',
        icon: 'settings_input_component',
        children: [
            {
                id: 'configSecure',
                title: '보안 설정',
                type: 'collapsable',
                icon: 'person',
                children: [
                    {
                        id: 'configUsers',
                        title: '사용자',
                        type: 'item',
                        icon: 'person_add',
                        url: '/configs/users'
                    },
                    {
                        id: 'configRoles',
                        title: '권한설정',
                        type: 'item',
                        icon: 'contacts',
                        url: '/configs/roles'
                    }
                ]
            },
            {
                id: 'configCodes',
                title: '기초코드',
                type: 'collapsable',
                icon: 'business_center',

                children: [
                    {
                        id: 'companyBranch',
                        title: NavTranslates.Company.Branch,
                        type: 'item',
                        icon: NavIcons.Company.Branch,
                        url: '/companies/branch'
                    },
                    {
                        id: 'companyList',
                        title: '고객사',
                        translate: NavTranslates.Company.List,
                        type: 'item',
                        icon: NavIcons.Company.List,
                        url: '/companies/list'
                    },
                    {
                        id: 'companyGroup',
                        title: '고객사 그룹',
                        translate: NavTranslates.Company.Group,
                        type: 'item',
                        icon: NavIcons.Company.Group,
                        url: '/companies/groups'
                    },
                    {
                        id: 'vendor',
                        title: '거래처',
                        translate: NavTranslates.Company.Vendor,
                        type: 'item',
                        icon: NavIcons.Company.Vendor,
                        url: '/companies/vendor'
                    },
                    {
                        id: 'currency',
                        title: NavTranslates.Basic.Currency,
                        type: 'item',
                        icon: NavIcons.Basic.Currency,
                        url: '/bases/currency'
                    },
                    {
                        id: 'companyWarehouse',
                        title: NavTranslates.Company.Warehouse,
                        type: 'item',
                        icon: NavIcons.Company.Warehouse,
                        url: '/companies/warehouse'
                    },
                    {
                        id: 'paymentMethod',
                        title: NavTranslates.Purchase.PaymentMethod,
                        type: 'item',
                        icon: NavIcons.Purchase.PaymentMethod,
                        url: '/companies/payment-method'
                    },
                    {
                        id: 'country',
                        title: NavTranslates.Basic.Country,
                        type: 'item',
                        icon: NavIcons.Basic.Country,
                        url: '/bases/country'
                    }
                ]
            },
            {
                id: 'configMisc',
                title: '기타설정',
                type: 'item',
                icon: 'build',
                url: '/config/misc'
            }
        ]
    }

];
