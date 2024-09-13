'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
const validator_1 = require("../utils/validator");
const api_request_1 = require("../utils/api-request");
const error_1 = require("../utils/error");
const constants_1 = __importDefault(require("../utils/constants"));
const emailFormConstructor_1 = require("./emailFormConstructor");
const { REQ_METHOD, COMPONENT, CREDENTIAL_USER } = constants_1.default;
class Email {
    constructor(app) {
        (0, validator_1.isValidApp)(app, true);
        this.requester = new api_request_1.AuthorizedHttpClient(app, this);
    }
    getComponentName() {
        return COMPONENT.email;
    }
    sendMail(mailObj) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyObject)(mailObj, 'email_object', true);
            }, error_1.CatalystEmailError);
            const formData = (0, emailFormConstructor_1.getFormData)(mailObj);
            const request = {
                method: REQ_METHOD.post,
                path: `/email/send`,
                data: formData,
                type: "file" /* FILE */,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            const response = resp.data.data;
            if (typeof mailObj.to_email === 'string' && response.to_email) {
                response.to_email = response.to_email[0];
            }
            return response;
        });
    }
}
exports.Email = Email;
