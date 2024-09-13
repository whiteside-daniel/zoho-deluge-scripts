"use strict";
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
exports._getTextAnalytics = exports._getNERPrediction = exports._getKeywordExtraction = exports._getSentimentAnalysis = void 0;
const constants_1 = __importDefault(require("../utils/constants"));
const error_1 = require("../utils/error");
const validator_1 = require("../utils/validator");
const { REQ_METHOD, CREDENTIAL_USER } = constants_1.default;
function _getSentimentAnalysis(requester, listOfDocuments, keywords) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, validator_1.wrapValidatorsWithPromise)(() => {
            (0, validator_1.isNonEmptyArray)(listOfDocuments, 'documents list', true);
            if (keywords !== undefined) {
                (0, validator_1.isNonEmptyArray)((0, validator_1.isNonEmptyArray)(keywords, 'keywords', true));
            }
        }, error_1.CatalystZiaError);
        const requestData = {
            document: listOfDocuments,
            keywords
        };
        const request = {
            method: REQ_METHOD.post,
            path: '/ml/text-analytics/sentiment-analysis',
            data: requestData,
            type: "json" /* JSON */,
            catalyst: true,
            track: true,
            user: CREDENTIAL_USER.admin
        };
        const resp = yield requester.send(request);
        return resp.data.data;
    });
}
exports._getSentimentAnalysis = _getSentimentAnalysis;
function _getKeywordExtraction(requester, listOfDocuments) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, validator_1.wrapValidatorsWithPromise)(() => {
            (0, validator_1.isNonEmptyArray)(listOfDocuments, 'documents list', true);
        }, error_1.CatalystZiaError);
        const request = {
            method: REQ_METHOD.post,
            path: '/ml/text-analytics/keyword-extraction',
            data: { document: listOfDocuments },
            type: "json" /* JSON */,
            catalyst: true,
            track: true,
            user: CREDENTIAL_USER.admin
        };
        const resp = yield requester.send(request);
        return resp.data.data;
    });
}
exports._getKeywordExtraction = _getKeywordExtraction;
function _getNERPrediction(requester, listOfDocuments) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, validator_1.wrapValidatorsWithPromise)(() => {
            (0, validator_1.isNonEmptyArray)(listOfDocuments, 'documents list', true);
        }, error_1.CatalystZiaError);
        const request = {
            method: REQ_METHOD.post,
            path: '/ml/text-analytics/ner',
            data: { document: listOfDocuments },
            type: "json" /* JSON */,
            catalyst: true,
            track: true,
            user: CREDENTIAL_USER.admin
        };
        const resp = yield requester.send(request);
        return resp.data.data;
    });
}
exports._getNERPrediction = _getNERPrediction;
function _getTextAnalytics(requester, listOfDocuments, keywords) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, validator_1.wrapValidatorsWithPromise)(() => {
            (0, validator_1.isNonEmptyArray)(listOfDocuments, 'documents list', true);
            if (keywords !== undefined) {
                (0, validator_1.isNonEmptyArray)((0, validator_1.isNonEmptyArray)(keywords, 'keywords', true));
            }
        }, error_1.CatalystZiaError);
        const requestData = {
            document: listOfDocuments,
            keywords
        };
        const request = {
            method: REQ_METHOD.post,
            path: '/ml/text-analytics',
            data: requestData,
            type: "json" /* JSON */,
            catalyst: true,
            track: true,
            user: CREDENTIAL_USER.admin
        };
        const resp = yield requester.send(request);
        return resp.data.data;
    });
}
exports._getTextAnalytics = _getTextAnalytics;
