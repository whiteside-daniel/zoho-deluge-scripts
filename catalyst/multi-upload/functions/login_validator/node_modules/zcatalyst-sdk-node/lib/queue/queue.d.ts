export class Queue {
    constructor(app: any);
    requester: AuthorizedHttpClient;
    getAllTopics(): Promise<any[]>;
    getTopicDetails(id: any): Promise<Topic>;
    topic(id: any): Topic;
}
import { AuthorizedHttpClient } from "../utils/api-request";
import { Topic } from "./topic";
