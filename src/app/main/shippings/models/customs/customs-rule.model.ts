export class CustomsType {
    code?: string;
    groupCode?: string;
    default?: boolean;
}

export class CustomsWarning {
    typeCode?: string;
    oneItemMaxQuantity?: number;
    sameTypeMaxQuantity?: number;
    totalMaxPrice?: number;
    allowedOtherTypeCodes?: string[];
}

export class CustomsRule {
    countryCode?: string;
    requiredGroupCodes?: string[];
    warnings?: CustomsWarning[];
    types?: CustomsType[];
}
