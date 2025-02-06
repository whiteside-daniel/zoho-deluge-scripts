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
exports.Search = void 0;
const validator_1 = require("../utils/validator");
const api_request_1 = require("../utils/api-request");
const constants_1 = __importDefault(require("../utils/constants"));
const error_1 = require("../utils/error");
const { REQ_METHOD, CREDENTIAL_USER, COMPONENT } = constants_1.default;
class Search {
    constructor(app) {
        (0, validator_1.isValidApp)(app, true);
        this.requester = new api_request_1.AuthorizedHttpClient(app, this);
    }
    getComponentName() {
        return COMPONENT.search;
    }
    executeSearchQuery(searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyObject)(searchQuery, 'search_object', true);
                (0, validator_1.ObjectHasProperties)(searchQuery, ['search', 'search_table_columns'], 'search_object', true);
            }, error_1.CatalystSearchError);
            const request = {
                method: REQ_METHOD.post,
                path: `/search`,
                data: searchQuery,
                type: "json" /* JSON */,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.user
            };
            const resp = yield this.requester.send(request);
            return resp.data.data;
        });
    }
}
exports.Search = Search;
