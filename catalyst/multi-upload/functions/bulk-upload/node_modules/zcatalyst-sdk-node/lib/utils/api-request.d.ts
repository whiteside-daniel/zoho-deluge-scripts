/// <reference types="node" />
import http from 'http';
import FormData from './form-data';
import { CatalystApp } from '../catalyst-app';
import { Component } from './pojo/common';
export declare const enum ResponseType {
    RAW = "raw",
    JSON = "json",
    STRING = "string",
    BUFFER = "buffer"
}
export declare const enum RequestType {
    FILE = "file",
    JSON = "json",
    URL_ENCODED = "url_encoded"
}
export interface IRequestConfig {
    data?: string | {
        [x: string]: unknown;
    } | FormData | Array<{
        [x: string]: unknown;
    }> | Array<string | number>;
    type?: RequestType;
    qs?: {
        [x: string]: string | number | null | undefined;
    };
    path?: string;
    origin?: string;
    url?: string;
    method?: string;
    headers?: {
        [x: string]: string;
    };
    user?: string;
    catalyst: boolean;
    track?: boolean;
    expecting?: ResponseType;
}
export interface IAPIResponse {
    request: http.ClientRequest;
    statusCode?: number;
    headers: http.IncomingHttpHeaders;
    data?: string;
    buffer?: Buffer;
    config: IRequestConfig;
    stream?: http.IncomingMessage;
}
declare class DefaultHttpResponse {
    statusCode: number;
    headers: http.IncomingHttpHeaders;
    config: IRequestConfig;
    resp: IAPIResponse;
    constructor(resp: IAPIResponse);
    get data(): any;
}
export declare class HttpClient {
    app?: CatalystApp;
    private user;
    /**
     * @param {CatalystApp} app The app used to fetch access tokens to sign API requests.
     * @constructor
     */
    constructor(app?: CatalystApp);
    send(req: IRequestConfig, apmTrackerName?: string): Promise<DefaultHttpResponse>;
}
export declare class AuthorizedHttpClient extends HttpClient {
    readonly componentName?: string;
    /**
     * @param {any} app The app used to fetch access tokens to sign API requests.
     * @constructor
     */
    constructor(app: CatalystApp, component?: Component);
    send(request: IRequestConfig): Promise<DefaultHttpResponse>;
}
export {};
