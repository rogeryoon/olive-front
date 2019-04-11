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
                translate: NavTranslates.Product.ProductHome,
                type: 'collapsable',
                icon: NavIcons.Product.ProductHome,
                children: [
                    {
                        id: 'products',
                        title: '상품 그룹',
                        translate: NavTranslates.Product.ProductGroup,
                        type: 'item',
                        icon: NavIcons.Product.ProductGroup,
                        url: '/products/group'
                    },
                    {
                        id: 'products',
                        title: '상품',
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
        permissions: [Permission.assignCompanyMasters],
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
                        id: 'companyVendor',
                        title: '거래처',
                        type: 'item',                        
                        translate: NavTranslates.Company.vendor,
                        icon: NavIcons.Company.vendor,
                        url: '/companies/vendor'
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
                        title: 'paymentMethod',
                        type: 'item',                        
                        translate: NavTranslates.Company.paymentMethod,
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
    }

];
