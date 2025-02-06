'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const credential_1 = require("./utils/credential");
const error_1 = __importStar(require("./utils/error"));
const catalyst_app_1 = require("./catalyst-app");
const validator_1 = require("./utils/validator");
const constants_1 = __importDefault(require("./utils/constants"));
const { INIT_TYPE, DEFAULT_APP_NAME, PROJECT_HEADER, CATALYST_ORIGIN, CATALYST_CONFIG_ENV_KEY } = constants_1.default;
class CatalystNamespace {
    constructor() {
        this.type = INIT_TYPE;
        this.credential = {
            refreshToken: (refreshTokenObj) => {
                return new credential_1.RefreshTokenCredential(refreshTokenObj);
            },
            accessToken: (access_token) => {
                return new credential_1.AccessTokenCredential({ access_token });
            },
            ticket: (ticket) => {
                return new credential_1.TicketCredential({ ticket });
            }
        };
        this.appCollection = {};
    }
    initializeApp(options, appName) {
        if (typeof appName === 'undefined') {
            appName = DEFAULT_APP_NAME;
        }
        if (appName in this.appCollection) {
            throw new error_1.CatalystAppError('duplicate_app', 'The app already exists.', appName);
        }
        if (!(0, validator_1.isNonEmptyObject)(options)) {
            options = this.loadOptionsFromEnvVar();
            if (!(0, validator_1.isNonEmptyObject)(options)) {
                throw new error_1.CatalystAppError('invalid_app_options', 'Options provided for initializeApp in invalid.', options);
            }
        }
        // credential alone can be not given
        if (typeof options.credential === 'undefined') {
            options.credential = new credential_1.ApplicationDefaultCredential();
        }
        try {
            (0, validator_1.isNonEmptyStringOrNumber)(options.project_id, 'project_id in options', true);
            (0, validator_1.isNonEmptyStringOrNumber)(options.project_key, 'project_key in options', true);
            (0, validator_1.isNonEmptyStringOrNumber)(options.environment, 'environment in options', true);
            (0, validator_1.isNonEmptyString)(appName, 'appName', true);
        }
        catch (e) {
            if (e instanceof error_1.default) {
                throw new error_1.CatalystAppError(e.code, e.message, e);
            }
            throw e;
        }
        const app = new catalyst_app_1.CatalystApp(options);
        this.appCollection[appName] = app;
        return app;
    }
    initialize(object, { type = 'auto', scope, appName } = {}) {
        let appOptions = {};
        switch (type) {
            case INIT_TYPE.advancedio:
                if (!object || typeof object.headers !== 'object') {
                    throw new error_1.CatalystAppError('invalid_app_object', 'the object passed to initialize method is not valid', object);
                }
                appOptions = this.loadOptionsFromObj(object['headers']);
                appOptions.credential = new credential_1.CatalystCredential(object['headers'], scope);
                break;
            case INIT_TYPE.basicio:
                if (!object || typeof object.catalystHeaders !== 'object') {
                    throw new error_1.CatalystAppError('invalid_app_object', 'the object passed to initialize method is not valid', object);
                }
                appOptions = this.loadOptionsFromObj(object['catalystHeaders']);
                appOptions.credential = new credential_1.CatalystCredential(object['catalystHeaders'], scope);
                break;
            default:
                if (object && typeof object.headers === 'object') {
                    return this.initialize(object, { type: INIT_TYPE.advancedio, scope, appName });
                }
                if (object && typeof object.catalystHeaders === 'object') {
                    return this.initialize(object, { type: INIT_TYPE.basicio, scope, appName });
                }
                throw new error_1.CatalystAppError('invalid_app_object', 'unable to find the type of initialisation. kindly specify one', object);
        }
        const catalystApp = new catalyst_app_1.CatalystApp(appOptions);
        if (appName !== undefined && (0, validator_1.isNonEmptyString)(appName)) {
            this.appCollection[appName] = catalystApp;
        }
        else {
            this.appCollection[DEFAULT_APP_NAME] = catalystApp;
        }
        return catalystApp;
    }
    loadOptionsFromObj(obj) {
        const projectId = obj[PROJECT_HEADER.id];
        const projectKey = obj[PROJECT_HEADER.key];
        const environment = obj[PROJECT_HEADER.environment];
        const projectDomain = obj[PROJECT_HEADER.domain] || CATALYST_ORIGIN;
        const projectSecretKey = obj[PROJECT_HEADER.projectSecretKey];
        if (!projectKey || !projectId) {
            throw new error_1.CatalystAppError('invalid_project_details', 'Failed to parse object', obj);
        }
        return {
            projectId,
            projectKey,
            environment,
            projectDomain,
            projectSecretKey
        };
    }
    loadOptionsFromEnvVar() {
        const config = process.env[CATALYST_CONFIG_ENV_KEY];
        if (!(0, validator_1.isNonEmptyString)(config)) {
            return {};
        }
        try {
            const contents = config.startsWith('{')
                ? config
                : (0, fs_1.readFileSync)(config, 'utf8');
            return JSON.parse(contents);
        }
        catch (err) {
            // Throw a nicely formed error message if the file contents cannot be parsed
            throw new error_1.CatalystAppError('invalid_app_options', 'Failed to parse app options : ' + err, err);
        }
    }
    app(appName) {
        if (typeof appName === 'undefined') {
            appName = DEFAULT_APP_NAME;
        }
        if (!(0, validator_1.isNonEmptyString)(appName)) {
            throw new error_1.CatalystAppError('invalid_app_name', 'Invalid app name provided. App name must be a non-empty string.', appName);
        }
        else if (!(appName in this.appCollection)) {
            let errorMessage = appName === DEFAULT_APP_NAME
                ? 'The default project does not exist. '
                : `project named "${appName}" does not exist. `;
            errorMessage += 'Make sure you call initializeApp() before getting the desired app';
            throw new error_1.CatalystAppError('no_app', errorMessage, appName);
        }
        return this.appCollection[appName];
    }
}
exports.default = CatalystNamespace;
