import { CatalystApp } from '../catalyst-app';
import { AuthorizedHttpClient } from '../utils/api-request';
import { Component } from '../utils/pojo/common';
export declare class Circuit implements Component {
    requester: AuthorizedHttpClient;
    constructor(app: CatalystApp);
    getComponentName(): string;
    execute(id: string | number, name: string, input?: {
        [x: string]: string;
    }): Promise<any>;
    status(id: string | number, exeId: string | number): Promise<any>;
    abort(id: string | number, exeId: string | number): Promise<any>;
}
