import { Connection } from './connection';
import { ICatalystCache, ICatalystGResponse } from '../utils/pojo/common';
declare type ICatalystCacheRes = ICatalystCache & Omit<ICatalystGResponse, 'created_time' | 'created_by' | 'modified_time' | 'modified_by'>;
export declare class Connector {
    connectorName: string;
    authUrl: string;
    refreshUrl: string;
    refreshToken: string;
    clientId: string;
    clientSecret: string;
    expiresIn: number;
    redirectUrl: string;
    accessToken: null | string;
    private app;
    private requester;
    constructor(connectionInstance: Connection, connectorDetails: {
        [x: string]: string;
    });
    private get _connectorName();
    getAccessToken(): Promise<string>;
    generateAccessToken(code: string): Promise<string>;
    refreshAndPersistToken(): Promise<string>;
    refreshAccessToken(): Promise<void>;
    putAccessTokenInCache(): Promise<ICatalystCacheRes>;
}
export {};
