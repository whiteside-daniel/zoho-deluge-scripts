export class Consumer {
    constructor(topic: any);
    _messagelistners: any[];
    _errorlistners: any[];
    validEvents: string[];
    _topic: any;
    _deleted: boolean;
    requester: any;
    _startConsumerTimeout(delayInMillis: any): void;
    consumerTimeout: any;
    on(event: any, listner: any): Consumer;
    close(force: any): Promise<any>;
}
