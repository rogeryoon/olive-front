import { FuseNavigation } from '@fuse/types';

// 현재 사용하지 않고, 나중을 위해 Mult Navigation지원을 위해 잡아둔다.
export const reserveNavigation: FuseNavigation[] = [
    {
        'id'      : 'applications',
        'title'   : 'Applications',
        'type'    : 'group',
        'children': [
            {
                'id'   : 'sample',
                'title': 'Sample',
                'type' : 'item',
                'icon' : 'email',
                'url'  : '/sample',
                'badge': {
                    'bg'   : '#F44336',
                    'fg'   : '#FFFFFF'
                }
            },
            {
                'id'   : 'login',
                'title': 'Login',
                'type' : 'item',
                'icon' : 'email',
                'url'  : '/pages/auth/login'
            },
            {
                'id'   : 'olive',
                'title': 'Olive',
                'type' : 'item',
                'icon' : 'today',
                'url'  : '/olive',
                'badge': {
                    'bg'   : '#F44336',
                    'fg'   : '#FFFFFF'
                }
            }
        ]
    }
];
