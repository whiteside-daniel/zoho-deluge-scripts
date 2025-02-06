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
exports.Cache = void 0;
const constants_1 = __importDefault(require("../utils/constants"));
const segment_1 = require("./segment");
const validator_1 = require("../utils/validator");
const api_request_1 = require("../utils/api-request");
const error_1 = require("../utils/error");
const { REQ_METHOD, COMPONENT, CREDENTIAL_USER } = constants_1.default;
class Cache {
    constructor(app) {
        (0, validator_1.isValidApp)(app, true);
        this.requester = new api_request_1.AuthorizedHttpClient(app, this);
    }
    getComponentName() {
        return COMPONENT.cache;
    }
    getAllSegment() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                method: REQ_METHOD.get,
                path: `/segment`,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            const json = resp.data;
            const segmentsArr = [];
            json.data.forEach((segment) => {
                segmentsArr.push(new segment_1.Segment(this, segment));
            });
            return segmentsArr;
        });
    }
    getSegmentDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyStringOrNumber)(id, 'segment_id', true);
            }, error_1.CatalystCacheError);
            const request = {
                method: REQ_METHOD.get,
                path: `/segment/${id}`,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            const json = resp.data;
            return new segment_1.Segment(this, json.data);
        });
    }
    segment(id) {
        if (typeof id === 'undefined') {
            return new segment_1.Segment(this, {});
        }
        if (!(0, validator_1.isNonEmptyStringOrNumber)(id)) {
            throw new error_1.CatalystCacheError('invalid-argument', 'Provided value segment_id must be a string or number', id);
        }
        return new segment_1.Segment(this, { id });
    }
}
exports.Cache = Cache;
