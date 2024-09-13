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
exports.Functions = void 0;
const validator_1 = require("../utils/validator");
const api_request_1 = require("../utils/api-request");
const error_1 = require("../utils/error");
const constants_1 = __importDefault(require("../utils/constants"));
const { REQ_METHOD, CREDENTIAL_USER, COMPONENT } = constants_1.default;
class Functions {
    constructor(app) {
        (0, validator_1.isValidApp)(app, true);
        this.requester = new api_request_1.AuthorizedHttpClient(app, this);
    }
    getComponentName() {
        return COMPONENT.functions;
    }
    execute(id, { args = {}, method = REQ_METHOD.get, data = {} } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyStringOrNumber)(id, 'function_id|functions_name', true);
            }, error_1.CatalystFunctionsError);
            let functionData = {};
            if ((0, validator_1.isNonEmptyObject)(args)) {
                functionData = args;
            }
            else if ((0, validator_1.isNonEmptyObject)(data)) {
                functionData = data;
            }
            const request = {
                method,
                path: `/function/${id}/execute`,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.user
            };
            if (method === REQ_METHOD.get) {
                request.qs = functionData;
            }
            else {
                request.data = functionData;
                request.type = "json" /* JSON */;
            }
            const resp = yield this.requester.send(request);
            return (resp.data.data === undefined ? resp.data.output : resp.data.data);
        });
    }
}
exports.Functions = Functions;
