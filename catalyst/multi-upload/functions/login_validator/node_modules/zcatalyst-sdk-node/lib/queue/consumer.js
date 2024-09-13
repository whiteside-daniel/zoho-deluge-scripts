'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Consumer = void 0;
const constants_1 = __importDefault(require("../utils/constants"));
const error_1 = require("../utils/error");
const validator_1 = require("../utils/validator");
const { PRODUCT_NAME, API_VERSION } = constants_1.default;
class Consumer {
    constructor(topic) {
        this._messagelistners = [];
        this._errorlistners = [];
        this.validEvents = ['message', 'error'];
        this._topic = topic;
        this._deleted = false;
        this.requester = topic.requester;
    }
    _startConsumerTimeout(delayInMillis) {
        this.consumerTimeout = setInterval(() => {
            const request = {
                method: 'GET',
                path: `/${PRODUCT_NAME}/${API_VERSION}/project/${this._topic.projectId}/queue/${this._topic._topicDetails.id}/records`
            };
            this.requester
                .send(request)
                .then((resp) => {
                const json = resp.data;
                this._messagelistners.forEach((listner) => {
                    if (typeof listner === 'function') {
                        listner(json.data[0]);
                    }
                    else {
                        this._messagelistners = this._messagelistners.filter((other) => other !== listner);
                    }
                });
                return;
            })
                .then(() => {
                if (this._deleted && (this._deleted === true || this._deleted === 'true')) {
                    this._messagelistners = [];
                    this._errorlistners = [];
                    clearInterval(this.consumerTimeout);
                    this.consumerTimeout = null;
                }
            })
                .catch((err) => {
                this._errorlistners.forEach((listner) => {
                    if (typeof listner === 'function') {
                        listner(err);
                    }
                    else {
                        this._errorlistners = this._errorlistners.filter((other) => other !== listner);
                    }
                });
            });
        }, delayInMillis);
    }
    on(event, listner) {
        if (!this.validEvents.includes(event)) {
            throw new error_1.CatalystQueueError('invalid-argument', 'Provided event is not valid, event must be one of ' + this.validEvents.toString(), event);
        }
        if (!(0, validator_1.isValidType)(listner, 'function')) {
            throw new error_1.CatalystQueueError('invalid-argument', 'Provided listner is not valid, listner must be of type function');
        }
        if (event === 'message' && !this._messagelistners.includes(listner)) {
            this._messagelistners.push(listner);
        }
        else if (event === 'error' && !this._errorlistners.includes(listner)) {
            this._errorlistners.push(listner);
        }
        if (!this.consumerTimeout || this.consumerTimeout === null) {
            this._startConsumerTimeout(5 * 1000);
        }
        return this;
    }
    close(force) {
        return new Promise((resolve, reject) => {
            try {
                if (force && (force === true || force === 'true')) {
                    this._deleted = true;
                    this._messagelistners = [];
                    this._errorlistners = [];
                    clearInterval(this.consumerTimeout);
                    this.consumerTimeout = null;
                    return resolve('success');
                }
                else {
                    this._deleted = true;
                    return resolve('success');
                }
            }
            catch (err) {
                reject(err);
            }
        });
    }
}
exports.Consumer = Consumer;
