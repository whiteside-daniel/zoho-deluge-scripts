import { Segment } from './segment';
import { CatalystApp } from '../catalyst-app';
import { AuthorizedHttpClient } from '../utils/api-request';
import { Component } from '../utils/pojo/common';
export declare class Cache implements Component {
    readonly requester: AuthorizedHttpClient;
    constructor(app: CatalystApp);
    getComponentName(): string;
    getAllSegment(): Promise<Array<Segment>>;
    getSegmentDetails(id: string | number): Promise<Segment>;
    segment(id?: string | number): Segment;
}
