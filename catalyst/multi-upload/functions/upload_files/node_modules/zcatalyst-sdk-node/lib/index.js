"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const catalyst_namespace_1 = __importDefault(require("./catalyst-namespace"));
const catalyst = new catalyst_namespace_1.default();
// check if its a node.js env
const processGlobal = typeof process !== 'undefined' ? process : 0; // tslint:disable-line
if (Object.prototype.toString.call(processGlobal) !== '[object process]') {
    const message = `
======== WARNING! ========
catalyst-nodejs-sdk appears to have been installed in an unsupported environment.
This package should only be used in server-side or backend Node.js environments,
and should not be used in web browsers or other client-side environments.
`;
    throw new Error(message);
    // console.error(message); // need to uncomment after getting code check removed
}
module.exports = catalyst;
