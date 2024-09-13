/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.Circuit = void 0;
const api_request_1 = require("../utils/api-request");
const constants_1 = __importDefault(require("../utils/constants"));
const error_1 = require("../utils/error");
const validator_1 = require("../utils/validator");
const { REQ_METHOD, COMPONENT, CREDENTIAL_USER } = constants_1.default;
class Circuit {
    constructor(app) {
        (0, validator_1.isValidApp)(app, true);
        this.requester = new api_request_1.AuthorizedHttpClient(app, this);
    }
    getComponentName() {
        return COMPONENT.circuit;
    }
    execute(id, name, input) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyStringOrNumber)(id, 'circuit_id', true);
                (0, validator_1.isNonEmptyString)(name, 'name', true);
            }, error_1.CatalystCircuitError);
            const request = {
                method: REQ_METHOD.post,
                path: `/circuit/${id}/execute`,
                data: {
                    name,
                    input: input === undefined ? {} : input
                },
                type: "json" /* JSON */,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            return resp.data.data;
        });
    }
    status(id, exeId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyStringOrNumber)(id, 'circuit_id', true);
                (0, validator_1.isNonEmptyStringOrNumber)(exeId, 'execution_id', true);
            }, error_1.CatalystCircuitError);
            const request = {
                method: REQ_METHOD.get,
                path: `/circuit/${id}/execution/${exeId}`,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            return resp.data.data;
        });
    }
    abort(id, exeId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyStringOrNumber)(id, 'circuit_id', true);
                (0, validator_1.isNonEmptyStringOrNumber)(exeId, 'execution_id', true);
            }, error_1.CatalystCircuitError);
            const request = {
                method: REQ_METHOD.delete,
                path: `/circuit/${id}/execution/${exeId}`,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            return resp.data.data;
        });
    }
}
exports.Circuit = Circuit;
