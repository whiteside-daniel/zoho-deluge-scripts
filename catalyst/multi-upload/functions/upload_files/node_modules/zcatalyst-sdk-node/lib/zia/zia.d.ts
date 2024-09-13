/// <reference types="node" />
import { CatalystApp } from '../catalyst-app';
import { AuthorizedHttpClient } from '../utils/api-request';
import fs from 'fs';
import { ICatalystZiaObject, ICatalystZiaOCR, ICatalystZiaBarcode, ICatalystZiaModeration, ICatalystZiaFace, ICatalystZiaAutoML, ICatalystZiaFaceComparison, ICatalystZiaSentimentAnalysis, ICatalsytZiaKeywordExtraction, ICatalystZiaNERPrediction, ICatalystZiaTextAnalytics } from '../utils/pojo/zia';
import { Component } from '../utils/pojo/common';
export declare class Zia implements Component {
    requester: AuthorizedHttpClient;
    constructor(app: CatalystApp);
    getComponentName(): string;
    detectObject(file: fs.ReadStream): Promise<ICatalystZiaObject>;
    extractOpticalCharacters(file: fs.ReadStream, opts?: {
        language?: string;
        modelType?: string;
    }): Promise<ICatalystZiaOCR>;
    extractAadhaarCharacters(frontImg: fs.ReadStream, backImg: fs.ReadStream, language: string): Promise<ICatalystZiaOCR>;
    scanBarcode(image: fs.ReadStream, opts?: {
        format?: string;
    }): Promise<ICatalystZiaBarcode>;
    moderateImage(image: fs.ReadStream, opts?: {
        mode?: string;
    }): Promise<ICatalystZiaModeration>;
    analyseFace(image: fs.ReadStream, opts?: {
        mode?: string;
        emotion?: boolean;
        age?: boolean;
        gender?: boolean;
    }): Promise<ICatalystZiaFace>;
    /**
     * @param sourceImage read stream of the source image
     * @param queryImage read stream of the image to be compared
     * @returns `ICatalystZiaFaceComparison` the object that contains the match and confidence value
     * @link https://www.zoho.com/catalyst/sdk/nodeJS-sdk/zia_compinst.html
     */
    compareFace(sourceImage: fs.ReadStream, queryImage: fs.ReadStream): Promise<ICatalystZiaFaceComparison>;
    automl(modelId: string | number, data?: {
        [x: string]: any;
    }): Promise<ICatalystZiaAutoML>;
    /**
     * Get the sentiment analytics for the list of documents.
     * @param listOfDocuments Array of strings whose sentiment is to be analysed.
     * @param keywords Entity-level sentiment key
     * @returns `ICatalystZiaSentimentAnalysis`
     * @link https://www.zoho.com/catalyst/sdk/nodeJS-sdk/zia_compinst.html
     */
    getSentimentAnalysis(listOfDocuments: Array<string>, keywords?: Array<string>): Promise<ICatalystZiaSentimentAnalysis>;
    /**
     * Extracts the keywords from the list of documents provided.
     * @param listOfDocuments Array of strings, which has to processed for keyword extraction
     * @returns `ICatalsytZiaKeywordExtraction`
     * @link https://www.zoho.com/catalyst/sdk/nodeJS-sdk/zia_compinst.html
     */
    getKeywordExtraction(listOfDocuments: Array<string>): Promise<ICatalsytZiaKeywordExtraction>;
    /**
     * Performs NER (Named Entity Recognition) on the given list of documents.
     * @param listOfDocuments Array of strings to be processed for NER.
     * @returns `ICatalystZiaNERPrediction`
     * @link https://www.zoho.com/catalyst/sdk/nodeJS-sdk/zia_compinst.html
     */
    getNERPrediction(listOfDocuments: Array<string>): Promise<ICatalystZiaNERPrediction>;
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
    getTextAnalytics(listOfDocuments: Array<string>, keywords?: Array<string>): Promise<ICatalystZiaTextAnalytics>;
}
