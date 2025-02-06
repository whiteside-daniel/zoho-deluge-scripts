'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotification = void 0;
const validator_1 = require("../utils/validator");
const api_request_1 = require("../utils/api-request");
const error_1 = require("../utils/error");
const mobile_notification_1 = require("./mobile-notification");
const web_notification_1 = require("./web-notification");
const constants_1 = __importDefault(require("../utils/constants"));
const { COMPONENT } = constants_1.default;
class PushNotification {
    constructor(app) {
        (0, validator_1.isValidApp)(app, true);
        this.requester = new api_request_1.AuthorizedHttpClient(app, this);
    }
    getComponentName() {
        return COMPONENT.notification;
    }
    mobile(id) {
        if (!(0, validator_1.isNonEmptyStringOrNumber)(id)) {
            throw new error_1.CatalystUserManagementError('invalid-argument', 'Value provided for app_id must be a non empty String or Number.', id);
        }
        return new mobile_notification_1.MobileNotification(this, id + '');
    }
    web() {
        return new web_notification_1.WebNotification(this);
    }
}
exports.PushNotification = PushNotification;
