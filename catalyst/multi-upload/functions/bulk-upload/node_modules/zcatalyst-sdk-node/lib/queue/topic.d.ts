export class Topic {
    constructor(topicDetails: any, queueInstance: any);
    _topicDetails: any;
    requester: any;
    produce(value: any): Promise<any>;
    consumer(): Consumer;
    toString(): string;
    toJSON(): any;
}
import { Consumer } from "./consumer";
