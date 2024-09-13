import { Connector } from './connector';
import { CatalystApp } from '../catalyst-app';
import { HttpClient } from '../utils/api-request';
export declare class Connection {
    app: CatalystApp;
    requester: HttpClient;
    connectionJson: {
        [x: string]: unknown;
    } | null;
    constructor(app: CatalystApp, propJson: string | {
        [x: string]: {
            [x: string]: string;
        };
    });
    getConnector(connectorName: string): Connector;
}
