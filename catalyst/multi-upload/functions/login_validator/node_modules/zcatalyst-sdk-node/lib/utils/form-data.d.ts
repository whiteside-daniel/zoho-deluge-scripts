/// <reference types="node" />
import { PassThrough, Readable, Stream } from 'stream';
import http from 'http';
declare type formDataType = string | Buffer | Readable | http.IncomingMessage | PassThrough;
export default class FormData extends Stream {
    writable: boolean;
    readable: boolean;
    released: boolean;
    streams: Array<formDataType>;
    currentStream: undefined | formDataType;
    insideLoop: boolean;
    pendingNext: boolean;
    boundary: string | undefined;
    constructor(streams?: Array<formDataType>);
    static LINE_BREAK: string;
    static CONTENT_TYPE: string;
    isStream(value: unknown): boolean;
    _multiPartHeader(field: string, value: formDataType): string;
    _getContentDisposition(value: any): string | undefined;
    _getContentType(value: formDataType): string;
    _lastBoundary(): string;
    _generateBoundary(): string;
    _error(err: Error): void;
    _handleStreamErrors(stream: Stream): void;
    _pipeNext(stream: formDataType): void;
    _getNext(): void;
    _reset(): void;
    createClone(): FormData;
    append(field: string, value: unknown): this;
    getHeaders(userHeaders: {
        [x: string]: string;
    }): {
        [x: string]: string;
    };
    getBoundary(): string;
    pipe<T extends NodeJS.WritableStream>(dest: T, options?: {
        end?: boolean;
    }): T;
    write(data: Uint8Array | string): boolean;
    pause(): void;
    resume(): void;
    end(): void;
    destroy(): void;
    toString(): string;
}
export {};
