/// <reference types="node" />
import { PassThrough, Readable } from 'stream';
declare class StreamClone extends PassThrough {
    parent: CloneableStream;
    constructor(parent: CloneableStream);
    private onDataClone;
    private onResumeClone;
    clone(): StreamClone;
    isCloneable(stream: unknown): boolean;
}
export default class CloneableStream extends PassThrough {
    _original: Readable | undefined;
    _clonesCount: number;
    _internalPipe: boolean;
    _hasListener: boolean;
    constructor(stream: Readable);
    private onData;
    private onResume;
    resume(): this;
    clone(): StreamClone;
}
export {};
