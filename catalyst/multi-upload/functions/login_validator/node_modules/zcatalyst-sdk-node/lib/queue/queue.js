'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const validator_1 = require("../utils/validator");
const topic_1 = require("./topic");
const catalyst_app_1 = require("../catalyst-app");
const api_request_1 = require("../utils/api-request");
const constants_1 = __importDefault(require("../utils/constants"));
const error_1 = require("../utils/error");
const { CREDENTIAL_USER, PRODUCT_NAME, API_VERSION } = constants_1.default;
class Queue extends catalyst_app_1.CatalystAppInternals {
    constructor(app) {
        (0, validator_1.isValidApp)(app, true);
        super(app.internal);
        super.switchUser(CREDENTIAL_USER.admin);
        this.requester = new api_request_1.AuthorizedHttpClient(this);
    }
    getAllTopics() {
        const request = {
            method: 'GET',
            path: `/${PRODUCT_NAME}/${API_VERSION}/project/${this.projectId}/queue`
        };
        return this.requester.send(request).then((resp) => {
            const json = resp.data;
            const topicsArr = [];
            json.data.forEach((topic) => {
                topicsArr.push(new topic_1.Topic(topic, this));
            });
            return topicsArr;
        });
    }
    getTopicDetails(id) {
        return (0, validator_1.wrapValidatorsWithPromise)(() => {
            (0, validator_1.isNonEmptyStringOrNumber)(id, 'queue_id', true);
        }, error_1.CatalystQueueError).then(() => {
            const request = {
                method: 'GET',
                path: `/${PRODUCT_NAME}/${API_VERSION}/project/${this.projectId}/queue/${id}`
            };
            return this.requester.send(request).then((resp) => {
                const json = resp.data;
                return new topic_1.Topic(json.data, this);
            });
        });
    }
    topic(id) {
        if (!(0, validator_1.isNonEmptyStringOrNumber)(id)) {
            throw new error_1.CatalystQueueError('invalid-argument', 'Value provided for topic_id must be a non empty String or Number.', id);
        }
        return new topic_1.Topic({ id: id }, this);
    }
}
exports.Queue = Queue;
