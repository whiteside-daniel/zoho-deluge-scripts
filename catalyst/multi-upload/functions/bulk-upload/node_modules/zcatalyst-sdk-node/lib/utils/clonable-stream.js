'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const process_1 = require("process");
function clonePiped(that) {
    var _a;
    if (--that._clonesCount === 0 && !that.destroyed) {
        (_a = that._original) === null || _a === void 0 ? void 0 : _a.pipe(that);
        that._original = undefined;
    }
}
function _destroy(error, callback) {
    if (!error) {
        this.push(null);
        this.end();
    }
    (0, process_1.nextTick)(callback, error);
}
function forwardDestroy(src, dest) {
    function destroy(err) {
        src.removeListener('close', onClose);
        dest.destroy(err);
    }
    function onClose() {
        dest.end();
    }
    src.on('error', destroy);
    src.on('close', onClose);
}
class StreamClone extends stream_1.PassThrough {
    constructor(parent) {
        super({ objectMode: parent.readableObjectMode });
        this.parent = parent;
        forwardDestroy(parent, this);
        // setting _internalPipe flag to prevent this pipe from starting
        // the flow. we have also overridden resume to do nothing when
        // this pipe tries to start the flow
        parent._internalPipe = true;
        parent.pipe(this);
        parent._internalPipe = false;
        // the events added by the clone should not count
        // for starting the flow
        // so we add the newListener handle after we are done
        this.on('newListener', this.onDataClone);
        this.once('resume', this.onResumeClone);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onDataClone(event, _listener) {
        // We start the flow once all clones are piped or destroyed
        if (event === 'data' || event === 'readable' || event === 'close') {
            (0, process_1.nextTick)(clonePiped, this.parent);
            this.removeListener('newListener', this.onDataClone);
            this.removeListener('resume', this.onResumeClone);
        }
    }
    onResumeClone() {
        this.removeListener('newListener', this.onDataClone);
        this.removeListener('resume', this.onResumeClone);
        (0, process_1.nextTick)(clonePiped, this.parent);
    }
    clone() {
        return this.parent.clone();
    }
    isCloneable(stream) {
        return stream instanceof CloneableStream || stream instanceof StreamClone;
    }
}
class CloneableStream extends stream_1.PassThrough {
    constructor(stream) {
        super({ objectMode: stream.readableObjectMode });
        this._original = stream;
        this._clonesCount = 1;
        this._internalPipe = false;
        forwardDestroy(stream, this);
        this.on('newListener', this.onData);
        this.on('resume', this.onResume);
        this._hasListener = true;
        this._destroy = _destroy;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onData(event, _listener) {
        if (event === 'data' || event === 'readable') {
            this._hasListener = false;
            this.removeListener('newListener', this.onData);
            this.removeListener('resume', this.onResume);
            (0, process_1.nextTick)(clonePiped, this);
        }
    }
    onResume() {
        this._hasListener = false;
        this.removeListener('newListener', this.onData);
        this.removeListener('resume', this.onResume);
        (0, process_1.nextTick)(clonePiped, this);
    }
    resume() {
        if (this._internalPipe) {
            return this;
        }
        stream_1.PassThrough.prototype.resume.call(this);
        return this;
    }
    clone() {
        if (!this._original) {
            throw new Error('already started');
        }
        this._clonesCount++;
        // the events added by the clone should not count
        // for starting the flow
        this.removeListener('newListener', this.onData);
        this.removeListener('resume', this.onResume);
        const clone = new StreamClone(this);
        if (this._hasListener) {
            this.on('newListener', this.onData);
            this.on('resume', this.onResume);
        }
        return clone;
    }
}
exports.default = CloneableStream;
