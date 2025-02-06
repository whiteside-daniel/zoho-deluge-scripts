import { Cache } from './cache';
import { AuthorizedHttpClient } from '../utils/api-request';
import { ICatalystCache, ICatalystSegment, ICatalystGResponse, ParsableComponent } from '../utils/pojo/common';
declare type ICatalystCacheRes = ICatalystCache & Omit<ICatalystGResponse, 'created_time' | 'created_by' | 'modified_time' | 'modified_by'>;
export declare class Segment implements ParsableComponent<ICatalystSegment> {
    readonly requester: AuthorizedHttpClient;
    id: string | null;
    segmentName: string | null;
    constructor(cacheInstance: Cache, segmentDetails: {
        [x: string]: unknown;
    });
    getComponentName(): string;
    put(key: string, value: string, expiry?: number): Promise<ICatalystCacheRes>;
    update(key: string, value: string, expiry?: number): Promise<ICatalystCacheRes>;
    getValue(cacheKey: string): Promise<string>;
    get(cacheKey: string): Promise<ICatalystCacheRes>;
    delete(cacheKey: string): Promise<boolean>;
    toString(): string;
    toJSON(): ICatalystSegment;
}
export {};
