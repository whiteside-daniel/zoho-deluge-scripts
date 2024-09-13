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
exports.Filestore = void 0;
const validator_1 = require("../utils/validator");
const constants_1 = __importDefault(require("../utils/constants"));
const folder_1 = require("./folder");
const api_request_1 = require("../utils/api-request");
const error_1 = require("../utils/error");
const { REQ_METHOD, CREDENTIAL_USER, COMPONENT } = constants_1.default;
class Filestore {
    constructor(app) {
        (0, validator_1.isValidApp)(app, true);
        this.requester = new api_request_1.AuthorizedHttpClient(app, this);
    }
    getComponentName() {
        return COMPONENT.filestore;
    }
    createFolder(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyString)(name, 'folder_name', true);
            }, error_1.CatalystFilestoreError);
            const postData = {
                folder_name: name
            };
            const request = {
                method: REQ_METHOD.post,
                path: `/folder`,
                data: postData,
                type: "json" /* JSON */,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.admin
            };
            const resp = yield this.requester.send(request);
            const json = resp.data.data;
            return new folder_1.Folder(this, json);
        });
    }
    getAllFolders() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                method: REQ_METHOD.get,
                path: `/folder`,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.user
            };
            const resp = yield this.requester.send(request);
            const jsonArr = resp.data.data;
            const folderArr = [];
            jsonArr.forEach((folder) => {
                folderArr.push(new folder_1.Folder(this, folder));
            });
            return folderArr;
        });
    }
    getFolderDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyStringOrNumber)(id, 'folder_id', true);
            }, error_1.CatalystFilestoreError);
            const request = {
                method: REQ_METHOD.get,
                path: `/folder/${id}`,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.user
            };
            const resp = yield this.requester.send(request);
            const json = resp.data.data;
            return new folder_1.Folder(this, json);
        });
    }
    folder(id) {
        if (!(0, validator_1.isNonEmptyStringOrNumber)(id)) {
            throw new error_1.CatalystFilestoreError('invalid-argument', 'Value provided for folder_id must be a non empty String or Number.', id);
        }
        return new folder_1.Folder(this, { id: id + '' });
    }
}
exports.Filestore = Filestore;
