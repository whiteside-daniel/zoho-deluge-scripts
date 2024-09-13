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
exports.Datastore = void 0;
const validator_1 = require("../utils/validator");
const constants_1 = __importDefault(require("../utils/constants"));
const table_1 = require("./table");
const api_request_1 = require("../utils/api-request");
const error_1 = require("../utils/error");
const { CREDENTIAL_USER, REQ_METHOD, COMPONENT } = constants_1.default;
class Datastore {
    constructor(app) {
        (0, validator_1.isValidApp)(app, true);
        this.requester = new api_request_1.AuthorizedHttpClient(app, this);
    }
    getComponentName() {
        return COMPONENT.datastore;
    }
    getAllTables() {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {
                method: REQ_METHOD.get,
                path: `/table`,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.user
            };
            const resp = yield this.requester.send(request);
            const jsonArr = resp.data.data;
            const tableArr = [];
            jsonArr.forEach((table) => {
                tableArr.push(new table_1.Table(this, table));
            });
            return tableArr;
        });
    }
    getTableDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, validator_1.wrapValidatorsWithPromise)(() => {
                (0, validator_1.isNonEmptyStringOrNumber)(id, 'table_id', true);
            }, error_1.CatalystDatastoreError);
            const request = {
                method: REQ_METHOD.get,
                path: `/table/${id}`,
                catalyst: true,
                track: true,
                user: CREDENTIAL_USER.user
            };
            const resp = yield this.requester.send(request);
            const json = resp.data.data;
            return new table_1.Table(this, json);
        });
    }
    table(id) {
        if (!(0, validator_1.isNonEmptyStringOrNumber)(id)) {
            throw new error_1.CatalystDatastoreError('invalid-argument', 'Value provided for table_id/table_name must be a non empty String or Number.', id);
        }
        if (!parseInt(id + '')) {
            return new table_1.Table(this, { table_name: id + '' });
        }
        return new table_1.Table(this, { table_id: id + '' });
    }
}
exports.Datastore = Datastore;
