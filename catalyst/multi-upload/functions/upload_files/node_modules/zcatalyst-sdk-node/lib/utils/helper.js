'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHttps = exports.copyInstance = exports.envOverride = void 0;
/**
 * Override a value with supplied environment variable if present.
 *
 * @param {string} envname The env key name.
 * @param {string} value The value to use if key is not present.
 * @param {Function} coerce Function to do manipulation of env value and given value.
 * @return {any} Either the env value or the given value according the presence.
 */
function envOverride(envname, value, coerce) {
    var _a;
    if (process.env[envname] && ((_a = process.env[envname]) === null || _a === void 0 ? void 0 : _a.length)) {
        if (coerce !== undefined) {
            try {
                return coerce(process.env[envname], value);
            }
            catch (e) {
                return value;
            }
        }
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        return process.env[envname];
    }
    return value;
}
exports.envOverride = envOverride;
function copyInstance(original) {
    return Object.assign(Object.create(Object.getPrototypeOf(original)), original);
}
exports.copyInstance = copyInstance;
function isHttps(url) {
    if (url === undefined) {
        return false;
    }
    const parsedUrl = url instanceof URL ? url : new URL(url);
    return parsedUrl.protocol !== 'http:';
}
exports.isHttps = isHttps;
