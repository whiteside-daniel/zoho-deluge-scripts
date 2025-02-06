'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const stream_1 = require("stream");
const util_1 = require("util");
const clonable_stream_1 = __importDefault(require("./clonable-stream"));
class FormData extends stream_1.Stream {
    constructor(streams) {
        super();
        this.writable = false;
        this.readable = true;
        this.released = false;
        this.streams = streams || [];
        this.insideLoop = false;
        this.pendingNext = false;
    }
    isStream(value) {
        return (value !== undefined &&
            value !== null &&
            ((typeof value.on === 'function' &&
                typeof value.pipe === 'function') ||
                value instanceof stream_1.Readable));
    }
    _multiPartHeader(field, value) {
        const contentDisposition = this._getContentDisposition(value);
        const contentType = this._getContentType(value);
        let contents = '';
        const headers = {
            // add custom disposition as third element or keep it two elements if not
            'Content-Disposition': ['form-data', 'name="' + field + '"'].concat(contentDisposition || []),
            // if no content type. allow it to be empty array
            'Content-Type': [contentType] || []
        };
        for (const prop in headers) {
            if (headers[prop]) {
                const header = headers[prop];
                // add non-empty headers.
                if (header.length > 0) {
                    contents += prop + ': ' + header.join('; ') + FormData.LINE_BREAK;
                }
            }
        }
        return '--' + this.getBoundary() + FormData.LINE_BREAK + contents + FormData.LINE_BREAK;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    _getContentDisposition(value) {
        let filename;
        let contentDisposition;
        if (value.name || value.path) {
            // custom filename take precedence
            // formidable and the browser add a name property
            // fs- and request- streams have path property
            filename = (0, path_1.basename)(value.name || value.path);
        }
        else if (value.readable && value.hasOwnProperty('httpVersion')) {
            // or try http response
            filename = (0, path_1.basename)(value.client._httpMessage.path || '');
        }
        if (filename) {
            contentDisposition = 'filename="' + filename + '"';
        }
        return contentDisposition;
    }
    _getContentType(value) {
        let contentType;
        // if it's http-reponse
        if (value.readable && value.hasOwnProperty('httpVersion')) {
            contentType = value.headers['content-type'];
        }
        // fallback to the default content type if `value` is not simple value
        if (!contentType) {
            contentType = FormData.CONTENT_TYPE;
        }
        return contentType;
    }
    _lastBoundary() {
        return '--' + this.getBoundary() + '--' + FormData.LINE_BREAK;
    }
    _generateBoundary() {
        // This generates a 50 character boundary similar to those used by Firefox.
        // They are optimized for boyer-moore parsing.
        let boundary = '--------------------------';
        for (let i = 0; i < 24; i++) {
            boundary += Math.floor(Math.random() * 10).toString(16);
        }
        this.boundary = boundary;
        return boundary;
    }
    _error(err) {
        this._reset();
        this.emit('error', err);
    }
    _handleStreamErrors(stream) {
        stream.on('error', (err) => {
            this._error(err);
        });
    }
    _pipeNext(stream) {
        this.currentStream = stream;
        if (this.isStream(stream)) {
            stream.on('end', this._getNext.bind(this));
            stream.pipe(this, {
                end: false
            });
            return;
        }
        const value = stream;
        this.write(value);
        this._getNext();
    }
    _getNext() {
        this.currentStream = undefined;
        if (this.insideLoop) {
            this.pendingNext = true;
            return; // defer call
        }
        this.insideLoop = true;
        try {
            do {
                this.pendingNext = false;
                // actual next logic
                const stream = this.streams.shift();
                if (typeof stream === 'undefined') {
                    this.end();
                }
                else {
                    this._pipeNext(stream);
                }
            } while (this.pendingNext);
        }
        finally {
            this.insideLoop = false;
        }
    }
    _reset() {
        this.writable = false;
        this.streams = [];
        this.currentStream = undefined;
    }
    createClone() {
        const newStreams = [];
        this.streams.forEach((stream) => {
            const clone = this.isStream(stream)
                ? new clonable_stream_1.default(stream).clone()
                : stream;
            newStreams.push(clone);
        });
        return new FormData(newStreams);
    }
    append(field, value) {
        if (Array.isArray(value)) {
            // should convert array to string as expected by web server
            this._error(new Error('Arrays are not supported.'));
            return this;
        }
        if (typeof value !== 'string' && !Buffer.isBuffer(value) && !this.isStream(value)) {
            value = (0, util_1.inspect)(value);
        }
        if (this.isStream(value)) {
            this._handleStreamErrors(value);
        }
        this.streams.push(this._multiPartHeader(field, value));
        this.streams.push(value);
        this.streams.push(FormData.LINE_BREAK);
        return this;
    }
    getHeaders(userHeaders) {
        const formHeaders = {};
        for (const header in userHeaders) {
            if (userHeaders[header]) {
                formHeaders[header.toLowerCase()] = userHeaders[header];
            }
        }
        formHeaders['content-type'] = 'multipart/form-data; boundary=' + this.getBoundary();
        return formHeaders;
    }
    getBoundary() {
        if (this.boundary === undefined) {
            return this._generateBoundary();
        }
        return this.boundary;
    }
    pipe(dest, options) {
        stream_1.Stream.prototype.pipe.call(this, dest, options);
        this.resume();
        return dest;
    }
    write(data) {
        const lastPart = this.streams.length === 0;
        this.emit('data', data);
        if (lastPart) {
            this.emit('data', this._lastBoundary());
        }
        return true;
    }
    pause() {
        if (this.currentStream !== undefined &&
            typeof this.currentStream.pause === 'function') {
            this.currentStream.pause();
        }
        this.emit('pause');
    }
    resume() {
        if (!this.released) {
            this.released = true;
            this.writable = true;
            this._getNext();
        }
        if (this.currentStream && typeof this.currentStream.resume === 'function') {
            this.currentStream.resume();
        }
        this.emit('resume');
    }
    end() {
        this._reset();
        this.emit('end');
    }
    destroy() {
        this._reset();
        this.emit('close');
    }
    toString() {
        return '[object FormData]';
    }
}
exports.default = FormData;
FormData.LINE_BREAK = '\r\n';
FormData.CONTENT_TYPE = 'application/octet-stream';
