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
exports.ApplicationDefaultCredential = exports.CatalystCredential = exports.CookieCredential = exports.TicketCredential = exports.AccessTokenCredential = exports.RefreshTokenCredential = exports.Credential = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const api_request_1 = require("./api-request");
const error_1 = require("./error");
const constants_1 = __importDefault(require("./constants"));
const { CREDENTIAL_SUFFIX, CATALYST_AUTH_ENV_KEY, REQ_METHOD, ACCOUNTS_ORIGIN, CREDENTIAL_HEADER, CREDENTIAL_TYPE, CREDENTIAL_USER, CSRF_TOKEN_NAME } = constants_1.default;
const CREDENTIAL_PATH = process.env.HOME
    ? (0, path_1.resolve)((0, path_1.resolve)(process.env.HOME, '.config'), CREDENTIAL_SUFFIX)
    : (0, path_1.resolve)('.', CREDENTIAL_SUFFIX);
function getAttr(from, key, alt) {
    const tmp = from[key] || (alt ? from[alt] : undefined);
    if (typeof tmp === 'undefined') {
        throw new error_1.CatalystAuthError('invalid_credential', `Unable to get ${alt} from credential Object provided`, from);
    }
    return tmp;
}
/*
 * Tries to load a RefreshToken from a path. If the path is not present, returns null.
 * Throws if data at the path is invalid.
 */
function fromPath(filePath) {
    let jsonString;
    try {
        jsonString = (0, fs_1.readFileSync)(filePath, 'utf8');
    }
    catch (ignored) {
        // Ignore errors if the file is not present, as this is sometimes an expected condition
        return null;
    }
    try {
        return JSON.parse(jsonString);
    }
    catch (err) {
        // Throw a nicely formed error message if the file contents cannot be parsed
        throw new error_1.CatalystAuthError('invalid_credential', 'Failed to parse token file: ' + err, err);
    }
}
function fromEnv() {
    const jsonString = process.env[CATALYST_AUTH_ENV_KEY];
    if (jsonString === undefined) {
        return null;
    }
    try {
        return JSON.parse(jsonString);
    }
    catch (err) {
        // Throw a nicely formed error message if the file contents cannot be parsed
        throw new error_1.CatalystAuthError('invalid_credential', 'Failed to parse refresh token string from env: ' + err, err);
    }
}
function requestAccessToken(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield new api_request_1.HttpClient().send(request);
        const json = resp.data;
        if (json.error) {
            const errorMessage = 'Error fetching access token: ' + json.error;
            return Promise.reject(errorMessage);
        }
        else if (!json.access_token || !json.expires_in) {
            return Promise.reject(`Unexpected response while fetching access token: ${JSON.stringify(json)}`);
        }
        else {
            return json;
        }
    });
}
class Credential {
    getCurrentUser() {
        return CREDENTIAL_USER.admin;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    switchUser(_givenUser) {
        return null;
    }
    getCurrentUserType() {
        return CREDENTIAL_USER.admin;
    }
}
exports.Credential = Credential;
class RefreshTokenCredential extends Credential {
    constructor(refreshObj) {
        super();
        this.clientId = getAttr(refreshObj, 'clientId', 'client_id');
        this.clientSecret = getAttr(refreshObj, 'clientSecret', 'client_secret');
        this.refreshToken = getAttr(refreshObj, 'refreshToken', 'refresh_token');
        this.cachedToken = null;
    }
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cachedToken === null || this.cachedToken['expiry'] <= Date.now()) {
                const token = yield requestAccessToken({
                    method: REQ_METHOD.post,
                    origin: ACCOUNTS_ORIGIN,
                    path: '/oauth/v2/token',
                    data: {
                        client_id: this.clientId,
                        client_secret: this.clientSecret,
                        refresh_token: this.refreshToken,
                        grant_type: 'refresh_token'
                    },
                    catalyst: false
                });
                this.cachedToken = token;
                this.cachedToken.expiry = Date.now() + token.expires_in * 1000;
            }
            return this.cachedToken;
        });
    }
}
exports.RefreshTokenCredential = RefreshTokenCredential;
class AccessTokenCredential extends Credential {
    constructor(accessObj) {
        super();
        this.accessToken = getAttr(accessObj, 'accessToken', 'access_token');
    }
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve({ access_token: this.accessToken });
        });
    }
}
exports.AccessTokenCredential = AccessTokenCredential;
class TicketCredential extends Credential {
    constructor(ticketObj) {
        super();
        this.ticket = getAttr(ticketObj, 'ticket', 'ticket');
    }
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve({ ticket: this.ticket });
        });
    }
}
exports.TicketCredential = TicketCredential;
class CookieCredential extends Credential {
    constructor(cookieObj) {
        super();
        this.cookie = getAttr(cookieObj, 'cookie', 'cookie');
        this.cookieObj = {};
    }
    getAsObject() {
        if (Object.keys(this.cookieObj).length > 0) {
            return this.cookieObj;
        }
        this.cookie.split(';').forEach((cookie) => {
            var _a;
            const parts = cookie.split('=');
            this.cookieObj[(_a = parts.shift()) === null || _a === void 0 ? void 0 : _a.trim()] = decodeURI(parts.join('='));
        });
        return this.cookieObj;
    }
    getZCSRFHeader() {
        const cookieObj = this.getAsObject();
        return 'zd_csrparam=' + cookieObj[CSRF_TOKEN_NAME];
    }
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve({ cookie: this.cookie, zcrf_header: this.getZCSRFHeader() });
        });
    }
}
exports.CookieCredential = CookieCredential;
class CatalystCredential extends Credential {
    constructor(credObj, user) {
        super();
        this.strictScope = false;
        this.adminCredType = getAttr(credObj, 'adminType', CREDENTIAL_HEADER.admin_cred_type);
        this.adminToken = getAttr(credObj, 'adminToken', CREDENTIAL_HEADER.admin_token);
        // cannot use `getAttr` coz user cred and cookie are optional
        this.userCredType = credObj[CREDENTIAL_HEADER.user_cred_type];
        this.userToken = credObj[CREDENTIAL_HEADER.user_token];
        this.cookieStr = credObj[CREDENTIAL_HEADER.cookie];
        this.userType =
            credObj[CREDENTIAL_HEADER.user] === CREDENTIAL_USER.admin
                ? CREDENTIAL_USER.admin
                : CREDENTIAL_USER.user;
        this.currentUser = CREDENTIAL_USER.user;
        if (typeof user === 'string' && !(user in CREDENTIAL_USER)) {
            throw new error_1.CatalystAuthError('invalid_credential', 'invalid user scope', user);
        }
        if (typeof user === 'string') {
            this.currentUser = user;
            this.strictScope = true;
        }
        if (this.userToken === undefined && this.cookieStr === undefined) {
            throw new error_1.CatalystAuthError('invalid_credential', 'missing user credentials', credObj);
        }
        switch (this.adminCredType) {
            case CREDENTIAL_TYPE.ticket:
                this.adminCred = new TicketCredential({ ticket: this.adminToken });
                break;
            case CREDENTIAL_TYPE.token:
                this.adminCred = new AccessTokenCredential({
                    access_token: this.adminToken
                });
                break;
            default:
                throw new error_1.CatalystAuthError('invalid_credential', 'admin credential type is unknown', credObj);
        }
        switch (this.userCredType) {
            case CREDENTIAL_TYPE.ticket:
                this.userCred = new TicketCredential({ ticket: this.userToken });
                break;
            case CREDENTIAL_TYPE.token:
                this.userCred = new AccessTokenCredential({
                    access_token: this.userToken
                });
                break;
            default:
                if (this.cookieStr !== undefined) {
                    this.userCred = new CookieCredential({
                        cookie: this.cookieStr
                    });
                }
        }
    }
    /** @override */
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.currentUser) {
                case CREDENTIAL_USER.admin:
                    return this.adminCred.getToken();
                case CREDENTIAL_USER.user:
                    if (this.userCred === undefined) {
                        throw new error_1.CatalystAuthError('invalid_credential', 'User Credential is not initialised', this.currentUser);
                    }
                    if (this.strictScope && this.userType === CREDENTIAL_USER.admin) {
                        throw new error_1.CatalystAuthError('invalid_credential', 'no user credentials present for catalyst app initialized in user scope');
                    }
                    return this.userCred.getToken();
                default:
                    throw new error_1.CatalystAuthError('invalid_credential', 'user provided is not recognized', this.currentUser);
            }
        });
    }
    /** @override */
    getCurrentUser() {
        return this.currentUser;
    }
    /** @override */
    getCurrentUserType() {
        if (this.currentUser === CREDENTIAL_USER.user) {
            return this.userType;
        }
        return this.currentUser;
    }
    /** @override */
    switchUser(givenUser) {
        if (this.strictScope) {
            // user switching not allowed for strict scopes
            return this.currentUser;
        }
        if (givenUser === undefined) {
            switch (this.currentUser) {
                case CREDENTIAL_USER.admin:
                    givenUser = CREDENTIAL_USER.user;
                    break;
                case CREDENTIAL_USER.user:
                    givenUser = CREDENTIAL_USER.admin;
                    break;
            }
        }
        this.currentUser = givenUser;
        return this.currentUser;
    }
}
exports.CatalystCredential = CatalystCredential;
class ApplicationDefaultCredential extends Credential {
    constructor() {
        super();
        // It is OK to not have this file. If it is present, it must be valid.
        let token = fromPath(CREDENTIAL_PATH);
        if (token === undefined || token === null) {
            token = fromEnv();
        }
        if (token === undefined || token === null) {
            throw new error_1.CatalystAuthError('invalid_credential', 'Unable to get token object from path or env', token);
        }
        if ('refresh_token' in token) {
            this.credential = new RefreshTokenCredential(token);
        }
        else if ('access_token' in token) {
            this.credential = new AccessTokenCredential(token);
        }
        else if ('ticket' in token) {
            this.credential = new TicketCredential(token);
        }
        else {
            throw new error_1.CatalystAuthError('invalid_credential', 'The given token object does not contain proper credentials', token);
        }
    }
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.credential.getToken();
        });
    }
}
exports.ApplicationDefaultCredential = ApplicationDefaultCredential;
