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
exports.Folder = void 0;
const validator_1 = require("../utils/validator");
const constants_1 = __importDefault(require("../utils/constants"));
const error_1 = require("../utils/error");
const form_data_1 = __importDefault(require("../utils/form-data"));
const { CREDENTIAL_USER, REQ_METHOD, COMPONENT } = constants_1.default;
class Folder {
    constructor(fileInstance, folderDetails) {
        this._folderDetails = folderDetails;
        this.requester = fileInstance.requester;
    }
    getComponentName() {
        return COMPONENT.filestore;
    }
    update(folderDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonNullObject)(folderDetails, 'folder_object', true);
                (0, validator_1.isNonEmptyString)(folderDetails.folder_name, 'folder_name in folder_object', true);
            }, error_1.CatalystFilestoreError);
            const postData = {
                folder_name: folderDetails.folder_name
            };
            const request = {
                method: REQ_METHOD.put,
                path: `/folder/${this._folderDetails.id}`,
                data: postData,
                type: "json" /* JSON */,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            return resp.data.data;
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                method: REQ_METHOD.delete,
                path: `/folder/${this._folderDetails.id}`,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            if (resp.data.data) {
                return true;
            }
            return false;
        });
    }
    getFileDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyStringOrNumber)(id, 'file_id', true);
            }, error_1.CatalystFilestoreError);
            const request = {
                method: REQ_METHOD.get,
                path: `/folder/${this._folderDetails.id}/file/${id}`,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.user
            };
            const resp = yield this.requester.send(request);
            return resp.data.data;
        });
    }
    deleteFile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyStringOrNumber)(id, 'file_id', true);
            }, error_1.CatalystFilestoreError);
            const request = {
                method: REQ_METHOD.delete,
                path: `/folder/${this._folderDetails.id}/file/${id}`,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.user
            };
            const resp = yield this.requester.send(request);
            const json = resp.data;
            if (json.data) {
                return true;
            }
            return false;
        });
    }
    uploadFile(fileDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonNullObject)(fileDetails, 'file_object', true);
                (0, validator_1.isNonEmptyString)(fileDetails.name, 'name in file_object', true);
            }, error_1.CatalystFilestoreError);
            const formData = new form_data_1.default();
            formData.append('code', fileDetails.code);
            formData.append('file_name', fileDetails.name);
            const request = {
                method: REQ_METHOD.post,
                path: `/folder/${this._folderDetails.id}/file`,
                data: formData,
                type: "file" /* FILE */,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.user
            };
            const resp = yield this.requester.send(request);
            return resp.data.data;
        });
    }
    getDownloadRequest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyStringOrNumber)(id, 'file_id', true);
            }, error_1.CatalystFilestoreError);
            return {
                method: REQ_METHOD.get,
                path: `/folder/${this._folderDetails.id}/file/${id}/download`,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.user
            };
        });
    }
    downloadFile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield this.getDownloadRequest(id);
            request.expecting = "buffer" /* BUFFER */;
            const resp = yield this.requester.send(request);
            return resp.data;
        });
    }
    getFileStream(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield this.getDownloadRequest(id);
            request.expecting = "raw" /* RAW */;
            const resp = yield this.requester.send(request);
            return resp.data;
        });
    }
    toString() {
        return JSON.stringify(this._folderDetails);
    }
    toJSON() {
        return this._folderDetails;
    }
}
exports.Folder = Folder;
