export class User {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(id?: string, userName?: string, fullName?: string, email?: string, 
        jobTitle?: string, phoneNumber?: string, roles?: string[],
        companyMasterCode?: string, companyGroupId?: number, 
        userAuditKey?: string, timeZoneId?: string
    ) {
        this.id = id;
        this.userName = userName;
        this.fullName = fullName;
        this.email = email;
        this.jobTitle = jobTitle;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
        this.companyMasterCode = companyMasterCode;
        this.companyGroupId = companyGroupId;
        this.userAuditKey = userAuditKey;
        this.timeZoneId = timeZoneId;
    }

    get friendlyName(): string {
        let name = this.fullName || this.userName;

        if (this.jobTitle) {
            name = this.jobTitle + ' ' + name;
        }

        return name;
    }

    public id: string;
    public userName: string;
    public fullName: string;
    public email: string;
    public jobTitle: string;
    public phoneNumber: string;
    public isEnabled: boolean;
    public isLockedOut: boolean;
    public roles: string[];
    public companyMasterCode: string;
    public companyGroupId: number;
    public companyGroupName?: string;
    public userAuditKey?: string;
    public timeZoneId?: string;
}
