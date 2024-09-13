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
exports.Cron = void 0;
const validator_1 = require("../utils/validator");
const cronValidator_1 = require("./cronValidator");
const api_request_1 = require("../utils/api-request");
const constants_1 = __importDefault(require("../utils/constants"));
const error_1 = require("../utils/error");
const { REQ_METHOD, COMPONENT, CREDENTIAL_USER } = constants_1.default;
class Cron {
    constructor(app) {
        (0, validator_1.isValidApp)(app, true);
        this.requester = new api_request_1.AuthorizedHttpClient(app, this);
    }
    getComponentName() {
        return COMPONENT.cron;
    }
    createCron(cron) {
        return __awaiter(this, void 0, void 0, function* () {
            const validCronObj = yield (0, cronValidator_1.validate)(cron);
            const request = {
                method: REQ_METHOD.post,
                path: '/cron',
                data: validCronObj,
                type: "json" /* JSON */,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            return resp.data.data;
        });
    }
    getAllCron() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                method: REQ_METHOD.get,
                path: '/cron',
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            return resp.data.data;
        });
    }
    getCronDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyStringOrNumber)(id, 'cron_id', true);
            }, error_1.CatalystCronError);
            const request = {
                method: REQ_METHOD.get,
                path: `/cron/${id}`,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            return resp.data.data;
        });
    }
    updateCron(cron) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyStringOrNumber)(cron.id, 'id in cron', true);
            }, error_1.CatalystCronError);
            const validCronObj = yield (0, cronValidator_1.validate)(cron);
            const request = {
                method: REQ_METHOD.put,
                path: `/cron/${cron.id}`,
                data: validCronObj,
                type: "json" /* JSON */,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            return resp.data.data;
        });
    }
    deleteCron(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyStringOrNumber)(id, 'cron_id', true);
            }, error_1.CatalystCronError);
            const request = {
                method: REQ_METHOD.delete,
                path: `/cron/${id}`,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            const json = resp.data;
            return json.data ? true : false;
        });
    }
}
exports.Cron = Cron;
