import { CatalystApp } from '../catalyst-app';
import { AuthorizedHttpClient } from '../utils/api-request';
import { Component } from '../utils/pojo/common';
export declare class Functions implements Component {
    requester: AuthorizedHttpClient;
    constructor(app: CatalystApp);
    getComponentName(): string;
    execute(id: string | number, { args, method, data }?: {
        args?: {
            [x: string]: string;
        };
        method?: string;
        data?: {
            [x: string]: string;
        };
    }): Promise<string>;
}
