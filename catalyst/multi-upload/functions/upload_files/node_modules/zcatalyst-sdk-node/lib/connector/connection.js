/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const connectorValidator_1 = require("./connectorValidator");
const connector_1 = require("./connector");
const validator_1 = require("../utils/validator");
const api_request_1 = require("../utils/api-request");
const error_1 = require("../utils/error");
const constants_1 = __importDefault(require("../utils/constants"));
const { CLIENT_ID, CLIENT_SECRET, AUTH_URL, REFRESH_URL, CONNECTOR_NAME } = constants_1.default;
class Connection {
    constructor(app, propJson) {
        (0, validator_1.isValidApp)(app, true);
        this.app = app;
        this.requester = new api_request_1.HttpClient(app);
        this.connectionJson = (0, connectorValidator_1.getConnectorJson)(propJson);
    }
    getConnector(connectorName) {
        if (this.connectionJson === null) {
            throw new error_1.CatalystConnectorError('invalid_input', 'the input passed to connector must be a valid json object or a string path to json file', this.connectionJson);
        }
        const connector = this.connectionJson[connectorName];
        (0, validator_1.isNonNullObject)(connector, 'connector.' + connectorName, true);
        (0, validator_1.ObjectHasProperties)(connector, [CLIENT_ID, CLIENT_SECRET, AUTH_URL, REFRESH_URL], 'connector.' + connectorName, true);
        return new connector_1.Connector(this, Object.assign({ [CONNECTOR_NAME]: connectorName }, connector));
    }
}
exports.Connection = Connection;
