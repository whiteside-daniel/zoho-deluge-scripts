export declare abstract class Credential {
    abstract getToken(): Promise<{
        [x: string]: string;
    }>;
    getCurrentUser(): string;
    switchUser(_givenUser?: string): string | null;
    getCurrentUserType(): string;
}
export declare class RefreshTokenCredential extends Credential {
    refreshToken: string;
    clientId: string;
    clientSecret: string;
    cachedToken: {
        [x: string]: string | number;
    } | null;
    constructor(refreshObj: {
        [x: string]: string;
    });
    getToken(): Promise<{
        ['access_token']: string;
    }>;
}
export declare class AccessTokenCredential extends Credential {
    accessToken: string;
    constructor(accessObj: {
        [x: string]: string;
    });
    getToken(): Promise<{
        access_token: string;
    }>;
}
export declare class TicketCredential extends Credential {
    ticket: string;
    constructor(ticketObj: {
        [x: string]: string;
    });
    getToken(): Promise<{
        ['ticket']: string;
    }>;
}
export declare class CookieCredential extends Credential {
    cookie: string;
    cookieObj: {
        [x: string]: string;
    };
    constructor(cookieObj: {
        [x: string]: string;
    });
    private getAsObject;
    private getZCSRFHeader;
    getToken(): Promise<{
        ['cookie']: string;
        ['zcrf_header']: string;
    }>;
}
export declare class CatalystCredential extends Credential {
    adminCredType: string;
    userCredType: string | undefined;
    adminToken: string;
    userToken: string | undefined;
    adminCred: TicketCredential | AccessTokenCredential;
    userCred: TicketCredential | AccessTokenCredential | CookieCredential | undefined;
    cookieStr: string | undefined;
    currentUser: string;
    userType: string;
    private strictScope;
    constructor(credObj: {
        [x: string]: string | undefined;
    }, user?: string);
    /** @override */
    getToken(): Promise<{
        [x: string]: string;
    }>;
    /** @override */
    getCurrentUser(): string;
    /** @override */
    getCurrentUserType(): string;
    /** @override */
    switchUser(givenUser?: string): string;
}
export declare class ApplicationDefaultCredential extends Credential {
    credential: RefreshTokenCredential | AccessTokenCredential | TicketCredential;
    constructor();
    getToken(): Promise<{
        access_token: string;
    } | {
        ticket: string;
    }>;
}
