import { AuthorizedHttpClient } from '../utils/api-request';
import { CatalystApp } from '../catalyst-app';
import { Component, ICatalystCron, ICatalystGResponse } from '../utils/pojo/common';
declare type ICatalystCronReq = Omit<ICatalystCron, 'id' | 'success_count' | 'failure_count'>;
declare type ICatalystCronRes = ICatalystCron & ICatalystGResponse;
declare type ICatalystCronUpdateReq = Partial<Omit<ICatalystCron, 'success_count' | 'failure_count'>> & {
    status: boolean;
};
export declare class Cron implements Component {
    requester: AuthorizedHttpClient;
    constructor(app: CatalystApp);
    getComponentName(): string;
    createCron(cron: ICatalystCronReq): Promise<ICatalystCronRes>;
    getAllCron(): Promise<Array<ICatalystCronRes>>;
    getCronDetails(id: string | number): Promise<ICatalystCronRes>;
    updateCron(cron: ICatalystCronUpdateReq): Promise<ICatalystCronRes>;
    deleteCron(id: string | number): Promise<boolean>;
}
export {};
