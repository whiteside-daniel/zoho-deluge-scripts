import { CatalystApp } from '../catalyst-app';
import { AuthorizedHttpClient } from '../utils/api-request';
import { Component, ICatalystSearch } from '../utils/pojo/common';
declare type ICatalystSearchResults = {
    [tableName: string]: Array<{
        [columnName: string]: any;
    }>;
};
export declare class Search implements Component {
    requester: AuthorizedHttpClient;
    constructor(app: CatalystApp);
    getComponentName(): string;
    executeSearchQuery(searchQuery: ICatalystSearch): Promise<ICatalystSearchResults>;
}
export {};
