import { CatalystApp } from '../catalyst-app';
import { AuthorizedHttpClient } from '../utils/api-request';
import { Component } from '../utils/pojo/common';
declare type ICatalystTableData = {
    [tableName: string]: {
        [x: string]: any;
    };
};
export declare class ZCQL implements Component {
    requester: AuthorizedHttpClient;
    constructor(app: CatalystApp);
    getComponentName(): string;
    executeZCQLQuery(sql: string): Promise<Array<ICatalystTableData>>;
}
export {};
