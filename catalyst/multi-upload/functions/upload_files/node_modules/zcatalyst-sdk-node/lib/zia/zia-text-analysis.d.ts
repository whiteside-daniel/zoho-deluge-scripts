import { AuthorizedHttpClient } from '../utils/api-request';
import { ICatalsytZiaKeywordExtraction, ICatalystZiaNERPrediction, ICatalystZiaSentimentAnalysis, ICatalystZiaTextAnalytics } from '../utils/pojo/zia';
export declare function _getSentimentAnalysis(requester: AuthorizedHttpClient, listOfDocuments: Array<string>, keywords?: Array<string>): Promise<ICatalystZiaSentimentAnalysis>;
export declare function _getKeywordExtraction(requester: AuthorizedHttpClient, listOfDocuments: Array<string>): Promise<ICatalsytZiaKeywordExtraction>;
export declare function _getNERPrediction(requester: AuthorizedHttpClient, listOfDocuments: Array<string>): Promise<ICatalystZiaNERPrediction>;
export declare function _getTextAnalytics(requester: AuthorizedHttpClient, listOfDocuments: Array<string>, keywords?: Array<string>): Promise<ICatalystZiaTextAnalytics>;
