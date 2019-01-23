// olive by roger
export type PermissionNames =
    'Manage Customer Companies' |
    'View Products' | 'Manage Products' |
    'View Inventories' | 'Manage Inventories' |
    'View Users' | 'Manage Users' |
    'View Roles' | 'Manage Roles' | 'Assign Roles' |
    'Assign Company Masters' | 'Assign Company Groups' | 
    'View Companies' | 'Manage Companies';

export type PermissionValues =
    'app.manage.other.company' |
    'products.view' | 'products.manage' |
    'inventories.view' | 'inventories.manage' |
    'users.view' | 'users.manage' |
    'roles.view' | 'roles.manage' | 'roles.assign' |
    'company.master.assign' | 'company.group.assign' |
    'companies.view' | 'companies.manage';

export class Permission {

    public static readonly viewProductsPermission: PermissionValues = 'products.view';
    public static readonly manageProductsPermission: PermissionValues = 'products.manage';

    public static readonly viewInventoriesPermission: PermissionValues = 'inventories.view';
    public static readonly manageInventoriesPermission: PermissionValues = 'inventories.manage';

    public static readonly manageOtherCompanies: PermissionValues = 'app.manage.other.company';

    public static readonly viewUsersPermission: PermissionValues = 'users.view';
    public static readonly manageUsersPermission: PermissionValues = 'users.manage';

    public static readonly viewRolesPermission: PermissionValues = 'roles.view';
    public static readonly manageRolesPermission: PermissionValues = 'roles.manage';
    public static readonly assignRolesPermission: PermissionValues = 'roles.assign';

    public static readonly assignCompanyMasters: PermissionValues = 'company.master.assign';
    public static readonly assignCompanyGroups: PermissionValues = 'company.group.assign';

    public static readonly viewCompaniesPermission: PermissionValues = 'companies.view';
    public static readonly manageCompaniesPermission: PermissionValues = 'companies.manage';

    constructor(name?: PermissionNames, value?: PermissionValues, groupName?: string, description?: string) {
        this.name = name;
        this.value = value;
        this.groupName = groupName;
        this.description = description;
    }

    public name: PermissionNames;
    public value: PermissionValues;
    public groupName: string;
    public description: string;
}
