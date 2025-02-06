/* eslint-disable @typescript-eslint/no-explicit-any */
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormData = void 0;
const form_data_1 = __importDefault(require("../utils/form-data"));
//TODO: complete validating the email object
function getFormData(mailObj) {
    const mailObjKeys = Object.keys(mailObj);
    const formData = new form_data_1.default();
    mailObjKeys.forEach((mailObjKey) => {
        const mailValue = mailObj[mailObjKey];
        if (Array.isArray(mailValue)) {
            mailObjKey === 'attachments'
                ? mailValue.forEach((attachment) => {
                    formData.append(mailObjKey, attachment);
                })
                : formData.append(mailObjKey, mailValue.join(','));
        }
        else {
            formData.append(mailObjKey, mailValue);
        }
    });
    return formData;
}
exports.getFormData = getFormData;
