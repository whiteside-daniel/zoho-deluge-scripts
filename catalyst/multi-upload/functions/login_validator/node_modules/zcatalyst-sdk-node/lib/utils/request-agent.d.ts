/// <reference types="node" />
import { Agent as httpAgent } from 'http';
import { Agent as httpsAgent } from 'https';
export default class RequestAgent {
    agent: httpAgent | httpsAgent;
    constructor(isHttps: boolean, host: string, replaceAgent: boolean);
}
