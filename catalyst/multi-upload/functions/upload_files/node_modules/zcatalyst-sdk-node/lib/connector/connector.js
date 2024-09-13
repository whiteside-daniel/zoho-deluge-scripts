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
exports.Connector = void 0;
const error_1 = require("../utils/error");
const validator_1 = require("../utils/validator");
const constants_1 = __importDefault(require("../utils/constants"));
const { CONNECTOR_NAME, AUTH_URL, REFRESH_URL, ACCESS_TOKEN, REFRESH_TOKEN, CLIENT_ID, CLIENT_SECRET, EXPIRES_IN, REDIRECT_URL, GRANT_TYPE, CODE, REQ_METHOD } = constants_1.default;
class Connector {
    constructor(connectionInstance, connectorDetails) {
        this.connectorName = connectorDetails[CONNECTOR_NAME];
        this.authUrl = connectorDetails[AUTH_URL];
        this.refreshUrl = connectorDetails[REFRESH_URL];
        this.refreshToken = connectorDetails[REFRESH_TOKEN];
        this.clientId = connectorDetails[CLIENT_ID];
        this.clientSecret = connectorDetails[CLIENT_SECRET];
        this.expiresIn = parseInt(connectorDetails[EXPIRES_IN]);
        this.redirectUrl = connectorDetails[REDIRECT_URL];
        this.accessToken = null;
        this.app = connectionInstance.app;
        this.requester = connectionInstance.requester;
    }
    get _connectorName() {
        return 'ZC_CONN_' + this.connectorName;
    }
    getAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedTokenObj = yield this.app.cache().segment().get(this._connectorName);
            const value = cachedTokenObj.cache_value;
            if (value === null) {
                return yield this.refreshAndPersistToken();
            }
            const remainingTime = cachedTokenObj.ttl_in_milliseconds;
            const actualTime = 3600000;
            const time = actualTime - remainingTime;
            if (time > this.expiresIn * 1000) {
                return yield this.refreshAndPersistToken();
            }
            return value;
        });
    }
    generateAccessToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyString)(code, 'grant_token', true);
                (0, validator_1.isNonEmptyString)(this.redirectUrl, REDIRECT_URL, true);
            }, error_1.CatalystConnectorError);
            const request = {
                method: REQ_METHOD.post,
                url: this.authUrl,
                data: {
                    [GRANT_TYPE]: 'authorization_code',
                    [CODE]: code,
                    [CLIENT_ID]: this.clientId,
                    [CLIENT_SECRET]: this.clientSecret,
                    [REDIRECT_URL]: this.redirectUrl
                },
                catalyst: false
            };
            const resp = yield this.requester.send(request);
            const tokenObj = resp.data;
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonNullObject)(tokenObj, 'auth_response', true);
                (0, validator_1.ObjectHasProperties)(tokenObj, [ACCESS_TOKEN, REFRESH_TOKEN, EXPIRES_IN], 'auth_response', true);
            }, error_1.CatalystConnectorError);
            this.accessToken = tokenObj[ACCESS_TOKEN];
            this.refreshToken = tokenObj[REFRESH_TOKEN];
            this.expiresIn = parseInt(tokenObj[EXPIRES_IN]);
            yield this.putAccessTokenInCache();
            return this.accessToken;
        });
    }
    refreshAndPersistToken() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.refreshAccessToken();
            yield this.putAccessTokenInCache();
            return this.accessToken;
        });
    }
    refreshAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyString)(this.refreshToken, 'refresh_token', true);
                (0, validator_1.isNonEmptyString)(this.refreshUrl, 'refresh_url', true);
            }, error_1.CatalystConnectorError);
            const request = {
                method: REQ_METHOD.post,
                url: this.refreshUrl,
                data: {
                    [GRANT_TYPE]: 'refresh_token',
                    [CLIENT_ID]: this.clientId,
                    [CLIENT_SECRET]: this.clientSecret,
                    [REFRESH_TOKEN]: this.refreshToken
                },
                catalyst: false
            };
            const resp = yield this.requester.send(request);
            const tokenObject = resp.data;
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonNullObject)(tokenObject, 'auth_response', true);
                (0, validator_1.ObjectHasProperties)(tokenObject, [ACCESS_TOKEN, EXPIRES_IN], 'auth_response', true);
            }, error_1.CatalystConnectorError);
            this.accessToken = tokenObject[ACCESS_TOKEN];
            this.expiresIn = parseInt(tokenObject[EXPIRES_IN]);
        });
    }
    putAccessTokenInCache() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.app
                .cache()
                .segment()
                .put(this._connectorName, this.accessToken, 1);
        });
    }
}
exports.Connector = Connector;
