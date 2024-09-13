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
exports.Segment = void 0;
const validator_1 = require("../utils/validator");
const error_1 = require("../utils/error");
const constants_1 = __importDefault(require("../utils/constants"));
const { REQ_METHOD, COMPONENT, CREDENTIAL_USER } = constants_1.default;
class Segment {
    constructor(cacheInstance, segmentDetails) {
        this.requester = cacheInstance.requester;
        const segmentId = parseInt(segmentDetails.id + '');
        this.id = isNaN(segmentId) ? null : segmentDetails.id + '';
        this.segmentName = (0, validator_1.isNonEmptyString)(segmentDetails.segment_name)
            ? segmentDetails.segment_name
            : null;
    }
    getComponentName() {
        return COMPONENT.cache;
    }
    put(key, value, expiry) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyString)(key, 'cache_key', true);
            }, error_1.CatalystCacheError);
            const apiUrl = this.id === null ? '/cache' : `/segment/${this.id}/cache`;
            const postData = {
                cache_name: key,
                cache_value: value,
                expiry_in_hours: expiry ? expiry : null
            };
            const request = {
                method: REQ_METHOD.post,
                type: "json" /* JSON */,
                data: postData,
                path: apiUrl,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const response = yield this.requester.send(request);
            return response.data.data;
        });
    }
    update(key, value, expiry) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyString)(value, 'cache_value', true);
                (0, validator_1.isNonEmptyString)(key, 'cache_key', true);
            }, error_1.CatalystCacheError);
            const apiUrl = this.id === null ? '/cache' : `/segment/${this.id}/cache`;
            const postData = {
                cache_name: key,
                cache_value: value,
                expiry_in_hours: expiry ? expiry : null
            };
            const request = {
                method: REQ_METHOD.put,
                type: "json" /* JSON */,
                data: postData,
                path: apiUrl,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const response = yield this.requester.send(request);
            return response.data.data;
        });
    }
    getValue(cacheKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheObj = yield this.get(cacheKey);
            return cacheObj.cache_value;
        });
    }
    get(cacheKey) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyString)(cacheKey, 'cache_key', true);
            }, error_1.CatalystCacheError);
            const apiUrl = this.id === null ? '/cache' : `/segment/${this.id}/cache`;
            const query = {
                cacheKey
            };
            const request = {
                method: REQ_METHOD.get,
                path: apiUrl,
                qs: query,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const response = yield this.requester.send(request);
            return response.data.data;
        });
    }
    delete(cacheKey) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyString)(cacheKey, 'cache_key', true);
            }, error_1.CatalystCacheError);
            const apiUrl = this.id === null ? '/cache' : `/segment/${this.id}/cache`;
            const query = {
                cacheKey
            };
            const request = {
                method: REQ_METHOD.delete,
                path: apiUrl,
                qs: query,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            yield this.requester.send(request);
            return true;
        });
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
    toJSON() {
        return {
            id: this.id,
            segment_name: this.segmentName
        };
    }
}
exports.Segment = Segment;
