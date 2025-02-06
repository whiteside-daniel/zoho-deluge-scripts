'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
const validator_1 = require("../utils/validator");
const consumer_1 = require("./consumer");
const catalyst_app_1 = require("../catalyst-app");
const constants_1 = __importDefault(require("../utils/constants"));
const error_1 = require("../utils/error");
const { PRODUCT_NAME, API_VERSION } = constants_1.default;
class Topic extends catalyst_app_1.CatalystAppInternals {
    constructor(topicDetails, queueInstance) {
        super(queueInstance);
        this._topicDetails = topicDetails;
        this.requester = queueInstance.requester;
    }
    produce(value) {
        return (0, validator_1.wrapValidatorsWithPromise)(() => {
            (0, validator_1.isNonEmptyString)(value, 'queue_value', true);
        }, error_1.CatalystQueueError).then(() => {
            const postData = {
                value: value
            };
            const request = {
                method: 'POST',
                type: 'json',
                data: postData,
                path: `/${PRODUCT_NAME}/${API_VERSION}/project/${this.projectId}/queue/${this._topicDetails.id}`
            };
            return this.requester.send(request).then((resp) => {
                const json = resp.data;
                return json.data;
            });
        });
    }
    consumer() {
        return new consumer_1.Consumer(this);
    }
    toString() {
        return JSON.stringify(this._topicDetails);
    }
    toJSON() {
        return this._topicDetails;
    }
}
exports.Topic = Topic;
