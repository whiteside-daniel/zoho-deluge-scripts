import { RefreshTokenCredential, AccessTokenCredential, TicketCredential, Credential } from './utils/credential';
import { CatalystApp } from './catalyst-app';
export default class CatalystNamespace {
    private appCollection;
    constructor();
    type: {
        advancedio: string;
        basicio: string;
    };
    credential: {
        refreshToken: (refreshTokenObj: {
            [x: string]: string;
        }) => RefreshTokenCredential;
        accessToken: (access_token: string) => AccessTokenCredential;
        ticket: (ticket: string) => TicketCredential;
    };
    initializeApp(options: {
        [x: string]: string | number | Credential;
    }, appName?: string): CatalystApp;
    initialize(object: {
        [x: string]: unknown;
    }, { type, scope, appName }?: {
        type?: string;
        scope?: 'admin' | 'user';
        appName?: string;
    }): CatalystApp;
    private loadOptionsFromObj;
    private loadOptionsFromEnvVar;
    app(appName?: string): CatalystApp;
}
