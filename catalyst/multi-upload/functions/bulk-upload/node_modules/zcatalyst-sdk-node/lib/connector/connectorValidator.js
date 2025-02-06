'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectorJson = void 0;
const validator_1 = require("../utils/validator");
const fs_1 = require("fs");
function getConnectorJson(propJson) {
    let connectorJson = null;
    if ((0, validator_1.isNonNullObject)(propJson, 'connectorJson', false)) {
        connectorJson = propJson;
    }
    else {
        let jsonString;
        try {
            jsonString = (0, fs_1.readFileSync)(propJson, 'utf8');
        }
        catch (err) {
            return null;
        }
        try {
            connectorJson = JSON.parse(jsonString);
        }
        catch (err) {
            return null;
        }
    }
    return connectorJson;
}
exports.getConnectorJson = getConnectorJson;
