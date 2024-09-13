import { Table } from './table';
import { CatalystApp } from '../catalyst-app';
import { AuthorizedHttpClient } from '../utils/api-request';
import { Component } from '../utils/pojo/common';
export declare class Datastore implements Component {
    requester: AuthorizedHttpClient;
    constructor(app: CatalystApp);
    getComponentName(): string;
    getAllTables(): Promise<Array<Table>>;
    getTableDetails(id: string | number): Promise<Table>;
    table(id: string | number): Table;
}
