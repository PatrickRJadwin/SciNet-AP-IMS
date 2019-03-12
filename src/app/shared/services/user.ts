export interface User {
    uid: string;
    email: string;
    roles: {
        user: boolean;
        admin?: boolean;
    }
}
