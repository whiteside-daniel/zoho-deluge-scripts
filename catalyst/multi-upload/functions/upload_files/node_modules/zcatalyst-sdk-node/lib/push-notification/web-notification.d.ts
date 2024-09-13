import { PushNotification } from './push-notification';
import { AuthorizedHttpClient } from '../utils/api-request';
export declare class WebNotification {
    requester: AuthorizedHttpClient;
    constructor(notificationInstance: PushNotification);
    sendNotification(message: string, recipients: Array<string>): Promise<boolean>;
}
