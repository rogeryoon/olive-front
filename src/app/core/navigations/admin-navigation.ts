export const adminNavigation = [
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
                    'title': 25,
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
                    'title': 25,
                    'bg'   : '#F44336',
                    'fg'   : '#FFFFFF'
                }
            }
        ]
    }
];
