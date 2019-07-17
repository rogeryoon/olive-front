import { FuseNavigation } from '@fuse/types';

import { NavIcons } from './nav-icons';
import { NavTranslates } from './nav-translates';
import { Permission } from '@quick/models/permission.model';

export const defaultNavigation: FuseNavigation[] = [
    {
        id: 'product',
        title: '상품',
        translate: NavTranslates.Group.product,
        type: 'group',
        icon: NavIcons.Group.product,
        children: [
            {
                id: 'purchaseGroup',
                title: '발주',
                translate: NavTranslates.Purchase.group,
                type: 'collapsable',
                icon: NavIcons.Purchase.group,
                children: [
                    {
                        id: 'purchaseEntry',
                        title: '발주서 작성',
                        translate: NavTranslates.Purchase.entry,
                        type: 'item',
                        icon: NavIcons.Purchase.entry,
                        url: '/purchases/0'
                    },                   
                    {
                        id: 'purchaseOrderList',
                        title: '발주서 목록',
                        translate: NavTranslates.Purchase.list,
                        type: 'item',
                        icon: NavIcons.Purchase.list,
                        url: '/purchases/list'
                    },
                    {
                        id: 'purchaseInWarehousePending',
                        title: '미입고 현황',
                        translate: NavTranslates.Purchase.inWarehousePending,
                        type: 'item',
                        icon: NavIcons.Purchase.inWarehousePending,
                        url: '/purchases/pending'
                    },
                    {
                        id: 'purchaseCancel',
                        title: '반품/취소 목록',
                        translate: NavTranslates.Purchase.cancel,
                        type: 'item',
                        icon: NavIcons.Purchase.cancel,
                        url: '/purchases/cancel/list'
                    },                    
                    {
                        id: 'purchaseCancelEntry',
                        title: '반품/취소 작성',
                        translate: NavTranslates.Purchase.cancelEntry,
                        type: 'item',
                        icon: NavIcons.Purchase.cancelEntry,
                        url: '/purchases/cancel/0'
                    }
                ]
            },
            {
                id: 'inWarehouseGroup',
                title: '입고',
                translate: 'navi.inWarehouse.group',
                type: 'collapsable',
                icon: NavIcons.InWarehouse.group,
                children: [
                    {
                        id: 'inWarehouseList',
                        title: '입고서 작성',
                        translate: NavTranslates.InWarehouse.entry,
                        type: 'item',
                        icon: NavIcons.InWarehouse.entry,
                        url: '/inwarehouses/0'
                    },                    
                    {
                        id: 'inWarehouseList',
                        title: '입고 목록',
                        translate: NavTranslates.InWarehouse.list,
                        type: 'item',
                        icon: NavIcons.InWarehouse.list,
                        url: '/inwarehouses/list'
                    }
                ]
            },
            {
                id: 'productHome',
                title: '상품',
                translate: NavTranslates.Product.productHome,
                type: 'collapsable',
                icon: NavIcons.Product.productHome,
                children: [
                    {
                        id: 'products',
                        title: '상품 그룹',
                        translate: NavTranslates.Product.productGroup,
                        type: 'item',
                        icon: NavIcons.Product.productGroup,
                        url: '/products/group'
                    },
                    {
                        id: 'products',
                        title: '상품',
                        translate: NavTranslates.Product.productVariant,
                        type: 'item',
                        icon: NavIcons.Product.productVariant,
                        url: '/products/variant'
                    }
                ]
            },
            {
                id: 'inventoryGroup',
                title: '재고 목록',
                translate: NavTranslates.Product.inventoryGroup,
                type: 'collapsable',
                icon: NavIcons.Product.inventoryGroup,
                children: [
                    {
                        id: 'inventoriesBalance',
                        title: '재고 현황',
                        translate: NavTranslates.Product.inventoriesBalance,
                        type: 'item',
                        icon: NavIcons.Product.inventoriesBalance,
                        url: '/inventories/balance'
                    },
                    {
                        id: 'inventoriesWarehouse',
                        title: '창고별 재고',
                        translate: NavTranslates.Product.inventoriesWarehouse,
                        type: 'item',
                        icon: NavIcons.Product.inventoriesWarehouse,
                        url: '/inventories/warehouse'
                    },
                    {
                        id: 'inventoriesHistory',
                        title: '품목별 재고',
                        translate: NavTranslates.Product.inventoriesHistory,
                        type: 'item',
                        icon: NavIcons.Product.inventoriesHistory,
                        url: '/inventories/history'
                    }
                ]
            },
            {
                id: 'salesGroup',
                title: '판매',
                translate: NavTranslates.Sales.group,
                type: 'collapsable',
                icon: NavIcons.Sales.group,
                children: [
                    {
                        id: 'orderList',
                        title: '주문 목록',
                        translate: NavTranslates.Sales.orderList,
                        type: 'item',
                        icon: NavIcons.Sales.orderList,
                        url: '/orders/list'
                    },
                    {
                        id: 'listShipOut',
                        title: '출고 리스팅',
                        translate: NavTranslates.Sales.shipOutPackageLister,
                        type: 'item',
                        icon: NavIcons.Sales.shipOutPackageLister,
                        url: '/orders/ship-out-package-lister'
                    },
                    {
                        id: 'excelList',
                        title: '판매처 엑셀',
                        translate: NavTranslates.Sales.marketExcels,
                        type: 'item',
                        icon: NavIcons.Sales.marketExcels,
                        url: '/data/market/orders/list'
                    },
                    {
                        id: 'matchItems',
                        title: '판매처 상품 연결',
                        translate: NavTranslates.Sales.matchItems,
                        type: 'item',
                        icon: NavIcons.Sales.matchItems,
                        url: '/data/market/orders/matches'
                    },                    
                ]
            }            
        ]
    },
    {
        id: 'config',
        title: '환경설정',
        translate: NavTranslates.Group.config,
        type: 'group',
        icon: NavIcons.Group.config,
        children: [
            {
                id: 'secure',
                title: '보안 설정',
                type: 'collapsable',
                translate: NavTranslates.Secure.group,
                icon: NavIcons.Secure.group,
                children: [
                    {
                        id: 'secureUsers',
                        title: '사용자',
                        type: 'item',
                        translate: NavTranslates.Secure.user,
                        icon: NavIcons.Secure.user,
                        url: '/configs/users'
                    },
                    {
                        id: 'secureRoles',
                        title: '권한설정',
                        type: 'item',
                        translate: NavTranslates.Secure.role,
                        icon: NavIcons.Secure.role,
                        url: '/configs/roles'
                    }
                ]
            },
            {
                id: 'company',
                title: '기초코드-회사',
                translate: NavTranslates.Company.group,
                type: 'collapsable',
                icon: NavIcons.Company.group,

                children: [
                    {
                        id: 'companyList',
                        title: '고객사',
                        type: 'item',                        
                        translate: NavTranslates.Company.list,
                        icon: NavIcons.Company.list,
                        url: '/companies/list'
                    },
                    {
                        id: 'companyGroupList',
                        title: '고객사 그룹',
                        type: 'item',                        
                        translate: NavTranslates.Company.groupList,
                        icon: NavIcons.Company.groupList,
                        url: '/companies/groups'
                    },
                    {
                        id: 'companyBranch',
                        title: '지점',
                        type: 'item',                        
                        translate: NavTranslates.Company.branch,
                        icon: NavIcons.Company.branch,
                        url: '/companies/branch'
                    },
                    {
                        id: 'companyWarehouse',
                        title: '창고',
                        type: 'item',                        
                        translate: NavTranslates.Company.warehouse,
                        icon: NavIcons.Company.warehouse,
                        url: '/companies/warehouse'
                    },
                    {
                        id: 'companySupplier',
                        title: '공급처',
                        type: 'item',                        
                        translate: NavTranslates.Company.supplier,
                        icon: NavIcons.Company.supplier,
                        url: '/companies/supplier'
                    },
                    {
                        id: 'companyMarket',
                        title: '판매처',
                        type: 'item',                        
                        translate: NavTranslates.Company.market,
                        icon: NavIcons.Company.market,
                        url: '/companies/market'
                    },
                    {
                        id: 'companyMarket',
                        title: '판매자',
                        type: 'item',                        
                        translate: NavTranslates.Company.marketSeller,
                        icon: NavIcons.Company.marketSeller,
                        url: '/companies/market-seller'
                    }
                ]
            },
            {
                id: 'basic',
                title: '기초코드-기타',
                translate: NavTranslates.Basic.group,
                type: 'collapsable',
                icon: NavIcons.Basic.group,

                children: [
                    {
                        id: 'basicCurrency',
                        title: '외국 화폐',
                        type: 'item',                        
                        translate: NavTranslates.Basic.currency,
                        icon: NavIcons.Basic.currency,
                        url: '/bases/currency'
                    },
                    {
                        id: 'basicPaymentMethod',
                        title: '결제 수단',
                        type: 'item',                        
                        translate: 'navi.company.paymentMethod',
                        icon: NavIcons.Company.paymentMethod,
                        url: '/companies/payment-method'
                    },
                    {
                        id: 'basicCountry',
                        title: '국가 코드',
                        type: 'item',                        
                        translate: NavTranslates.Basic.country,
                        icon: NavIcons.Basic.country,
                        url: '/bases/country'
                    },
                    {
                        id: 'basicCarrier',
                        title: '캐리어',
                        type: 'item',                        
                        translate: NavTranslates.Basic.carrier,
                        icon: NavIcons.Basic.carrier,
                        url: '/bases/carrier'
                    }
                ]
            }
        ]
    },
    {
        id: 'public',
        title: '공개테스트',
        type: 'group',
        permissions: [],
        icon: 'settings_input_component',
        children: [
            {
                id: 'publicConfig',
                title: '공개',
                type: 'collapsable',
                icon: 'person',
                children: [
                    {
                        id: 'publicUsers',
                        title: '사용자',
                        type: 'item',
                        icon: 'person_add',
                        url: '/configs/users'
                    },
                    {
                        id: 'publicRoles',
                        title: '권한설정',
                        type: 'item',
                        icon: 'contacts',
                        url: '/configs/roles'
                    }
                ]
            }
        ]
    },
    // {
    //     id: 'sales',
    //     title: '판매',
    //     type: 'group',
    //     icon: 'add_shopping_cart',
    //     permissions: [Permission.assignCompanyMasters],
    //     children: [
    //         {
    //             id: 'salesEntry',
    //             title: '판매 등록',
    //             type: 'item',
    //             icon: 'payment',
    //             url: '/sales/new'
    //         },
    //         {
    //             id: 'salesShipOut',
    //             title: '판매 출고',
    //             type: 'item',
    //             icon: 'local_shipping',
    //             url: '/sales/shipout',
    //             badge: {
    //                 title: '186',
    //                 bg: '#F44336',
    //                 fg: '#FFFFFF'
    //             }
    //         },
    //         {
    //             id: 'salesViewGroup',
    //             title: '판매 목록',
    //             type: 'collapsable',
    //             icon: 'camera_enhance',

    //             children: [
    //                 {
    //                     id: 'salesView',
    //                     title: '판매 조회',
    //                     type: 'item',
    //                     icon: 'account_circle',
    //                     url: '/sales/view'
    //                 },
    //                 {
    //                     id: 'salesStats',
    //                     title: '판매 현황',
    //                     type: 'item',
    //                     icon: 'all_inclusive',
    //                     url: '/sales/stats'
    //                 },
    //                 {
    //                     id: 'salesProfit',
    //                     title: '이익 현황',
    //                     type: 'item',
    //                     icon: 'local_atm',
    //                     url: '/sales/profit'
    //                 }
    //             ]
    //         }
    //     ]
    // },
];
