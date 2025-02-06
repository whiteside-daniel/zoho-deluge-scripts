import { CatalystApp } from '../catalyst-app';
import { AuthorizedHttpClient } from '../utils/api-request';
import { MobileNotification } from './mobile-notification';
import { WebNotification } from './web-notification';
import { Component } from '../utils/pojo/common';
export declare class PushNotification implements Component {
    requester: AuthorizedHttpClient;
    constructor(app: CatalystApp);
    getComponentName(): string;
    mobile(id: string | number): MobileNotification;
    web(): WebNotification;
}
