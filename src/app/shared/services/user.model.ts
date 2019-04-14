export class Userm {
    uid: string;
    email: string;
    displayName: string;
    $key?: string;
    role: {
        noaccess: boolean;
        user?: boolean;
        admin?: boolean;
        superuser?: boolean;
    }
    rolestring: string;

    constructor(uid: string, email: string) {
        this.uid = uid;
        this.email = email;
        this.displayName = email.substring(0, email.lastIndexOf("@"));
        this.role = {
            noaccess: true,
            user: false,
            admin: false,
            superuser: false
        }
        this.rolestring = "noaccess";
    }
}
