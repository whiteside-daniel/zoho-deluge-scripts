import { AuthorizedHttpClient } from '../utils/api-request';
import { CatalystApp } from '../catalyst-app';
import { ICatalystMail, ICatalystGResponse, Component } from '../utils/pojo/common';
declare type ICatalystMailRes = ICatalystMail & Omit<ICatalystGResponse, 'created_time' | 'created_by' | 'modified_time' | 'modified_by'>;
export declare class Email implements Component {
    requester: AuthorizedHttpClient;
    constructor(app: CatalystApp);
    getComponentName(): string;
    sendMail(mailObj: ICatalystMail): Promise<ICatalystMailRes>;
}
export {};
