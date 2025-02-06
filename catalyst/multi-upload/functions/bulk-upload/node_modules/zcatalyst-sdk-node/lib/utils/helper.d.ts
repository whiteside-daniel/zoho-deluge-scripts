/**
 * Override a value with supplied environment variable if present.
 *
 * @param {string} envname The env key name.
 * @param {string} value The value to use if key is not present.
 * @param {Function} coerce Function to do manipulation of env value and given value.
 * @return {any} Either the env value or the given value according the presence.
 */
export declare function envOverride<T>(envname: string, value: T, coerce?: (environmentValue: string | undefined, givenValue?: T) => T): T | string;
export declare function copyInstance<T>(original: T): T;
export declare function isHttps(url?: string | URL): boolean;
