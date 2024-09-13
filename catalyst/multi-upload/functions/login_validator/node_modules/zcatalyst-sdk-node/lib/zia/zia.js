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
exports.Zia = void 0;
const api_request_1 = require("../utils/api-request");
const constants_1 = __importDefault(require("../utils/constants"));
const error_1 = require("../utils/error");
const form_data_1 = __importDefault(require("../utils/form-data"));
const validator_1 = require("../utils/validator");
const zia_text_analysis_1 = require("./zia-text-analysis");
const { REQ_METHOD, COMPONENT, CREDENTIAL_USER } = constants_1.default;
function addOptsToFormData(formData, opts) {
    for (const [key, value] of Object.entries(opts)) {
        if (value !== undefined) {
            formData.append(key, value);
        }
    }
}
class Zia {
    constructor(app) {
        (0, validator_1.isValidApp)(app, true);
        this.requester = new api_request_1.AuthorizedHttpClient(app, this);
    }
    getComponentName() {
        return COMPONENT.zia;
    }
    detectObject(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new form_data_1.default();
            formData.append('image', file);
            const request = {
                method: REQ_METHOD.post,
                path: `/ml/detect-object`,
                data: formData,
                type: "file" /* FILE */,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            return resp.data.data;
        });
    }
    extractOpticalCharacters(file, opts = {
        language: undefined,
        modelType: undefined
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new form_data_1.default();
            formData.append('image', file);
            addOptsToFormData(formData, opts);
            const request = {
                method: REQ_METHOD.post,
                path: `/ml/ocr`,
                data: formData,
                type: "file" /* FILE */,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            return resp.data.data;
        });
    }
    extractAadhaarCharacters(frontImg, backImg, language) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyString)(language, 'language', true);
            }, error_1.CatalystZiaError);
            const formData = new form_data_1.default();
            formData.append('aadhaar_front', frontImg);
            formData.append('aadhaar_back', backImg);
            addOptsToFormData(formData, {
                language,
                model_type: 'AADHAAR'
            });
            const request = {
                method: REQ_METHOD.post,
                path: `/ml/ocr`,
                data: formData,
                type: "file" /* FILE */,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            return resp.data.data;
        });
    }
    scanBarcode(image, opts = { format: undefined }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isValidType)(image, 'object', 'image', true);
            }, error_1.CatalystZiaError);
            const formData = new form_data_1.default();
            formData.append('image', image);
            addOptsToFormData(formData, opts);
            const request = {
                method: REQ_METHOD.post,
                path: `/ml/barcode`,
                data: formData,
                type: "file" /* FILE */,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            return resp.data.data;
        });
    }
    moderateImage(image, opts = { mode: undefined }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isValidType)(image, 'object', 'image', true);
            }, error_1.CatalystZiaError);
            const formData = new form_data_1.default();
            formData.append('image', image);
            addOptsToFormData(formData, opts);
            const request = {
                method: REQ_METHOD.post,
                path: `/ml/imagemoderation`,
                data: formData,
                type: "file" /* FILE */,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            return resp.data.data;
        });
    }
    analyseFace(image, opts = {
        mode: undefined,
        emotion: undefined,
        age: undefined,
        gender: undefined
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isValidType)(image, 'object', 'image', true);
            }, error_1.CatalystZiaError);
            const formData = new form_data_1.default();
            formData.append('image', image);
            addOptsToFormData(formData, opts);
            const request = {
                method: REQ_METHOD.post,
                path: `/ml/faceanalytics`,
                data: formData,
                type: "file" /* FILE */,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            return resp.data.data;
        });
    }
    /**
     * @param sourceImage read stream of the source image
     * @param queryImage read stream of the image to be compared
     * @returns `ICatalystZiaFaceComparison` the object that contains the match and confidence value
     * @link https://www.zoho.com/catalyst/sdk/nodeJS-sdk/zia_compinst.html
     */
    compareFace(sourceImage, queryImage) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isValidType)(sourceImage, 'object', 'source_image', true);
                (0, validator_1.isValidType)(queryImage, 'object', 'query_image', true);
            }, error_1.CatalystZiaError);
            const formData = new form_data_1.default();
            formData.append('source_image', sourceImage);
            formData.append('query_image', queryImage);
            const request = {
                method: REQ_METHOD.post,
                path: `/ml/facecomparison`,
                data: formData,
                type: "file" /* FILE */,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            return resp.data.data;
        });
    }
    automl(modelId, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyStringOrNumber)(modelId, 'modelId', true);
                (0, validator_1.isValidType)(data, 'object', 'data', true);
            }, error_1.CatalystZiaError);
            const request = {
                method: REQ_METHOD.post,
                path: `/ml/automl/model/${modelId}`,
                data,
                type: "json" /* JSON */,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            return resp.data.data;
        });
    }
    //textAnalysis
    /**
     * Get the sentiment analytics for the list of documents.
     * @param listOfDocuments Array of strings whose sentiment is to be analysed.
     * @param keywords Entity-level sentiment key
     * @returns `ICatalystZiaSentimentAnalysis`
     * @link https://www.zoho.com/catalyst/sdk/nodeJS-sdk/zia_compinst.html
     */
    getSentimentAnalysis(listOfDocuments, keywords) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, zia_text_analysis_1._getSentimentAnalysis)(this.requester, listOfDocuments, keywords);
        });
    }
    /**
     * Extracts the keywords from the list of documents provided.
     * @param listOfDocuments Array of strings, which has to processed for keyword extraction
     * @returns `ICatalsytZiaKeywordExtraction`
     * @link https://www.zoho.com/catalyst/sdk/nodeJS-sdk/zia_compinst.html
     */
    getKeywordExtraction(listOfDocuments) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, zia_text_analysis_1._getKeywordExtraction)(this.requester, listOfDocuments);
        });
    }
    /**
     * Performs NER (Named Entity Recognition) on the given list of documents.
     * @param listOfDocuments Array of strings to be processed for NER.
     * @returns `ICatalystZiaNERPrediction`
     * @link https://www.zoho.com/catalyst/sdk/nodeJS-sdk/zia_compinst.html
     */
    getNERPrediction(listOfDocuments) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, zia_text_analysis_1._getNERPrediction)(this.requester, listOfDocuments);
        });
    }
    /**
     * Performs all the three available text analytics on the list of documents provided.
     *
     * Available text anaytics features:
     * * `Sentiment Analysis`
     * * `Keyword Extraction`
     * * `NER Prediction`
     *
     * Note: These text analytics features are also available as seperate functions. Please check other functions under `textAnalysis`.
     *
     * @param listOfDocuments Array of strings to be processed for text anaytics.
     * @param keywords Entity-level sentiment key
     * @returns `ICatalystZiaTextAnalytics`
     * @link https://www.zoho.com/catalyst/sdk/nodeJS-sdk/zia_compinst.html
     */
    getTextAnalytics(listOfDocuments, keywords) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, zia_text_analysis_1._getTextAnalytics)(this.requester, listOfDocuments, keywords);
        });
    }
}
exports.Zia = Zia;
