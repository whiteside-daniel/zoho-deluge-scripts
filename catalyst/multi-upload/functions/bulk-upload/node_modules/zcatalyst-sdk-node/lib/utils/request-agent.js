'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const https_1 = require("https");
const constants_1 = __importDefault(require("./constants"));
/**
 * example structure
 * {
 * 	http: {
 * 		domain: httpAgent
 * 	}
 * }
 */
const agentMap = {};
class RequestAgent {
    constructor(isHttps, host, replaceAgent) {
        const protocol = isHttps ? constants_1.default.PROTOCOL.HTTPS : constants_1.default.PROTOCOL.HTTP;
        if (agentMap[protocol] === undefined) {
            agentMap[protocol] = {};
        }
        const protocolMap = agentMap[protocol];
        if (protocolMap[host] === undefined || replaceAgent) {
            protocolMap[host] = isHttps
                ? new https_1.Agent({ keepAlive: true })
                : new http_1.Agent({ keepAlive: true });
        }
        this.agent = protocolMap[host];
    }
}
exports.default = RequestAgent;
