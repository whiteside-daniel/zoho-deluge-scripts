'use strict';
const { isValidApp, isNonEmptyString, wrapValidatorsWithPromise } = require('../utils/validator');
const CatalystAppInternals = require('../catalyst-app').CatalystAppInternals;
const AuthorizedHttpClient = require('../utils/api-request').AuthorizedHttpClient;
const { API_VERSION, PRODUCT_NAME } = require('../utils/constants').default;
const CatalystGQLError = require('../utils/error').CatalystGQLError;
class GQL extends CatalystAppInternals {
    constructor(app) {
        isValidApp(app, true);
        super(app.internal);
        // super.switchUser(USER.admin);
        this.requester = new AuthorizedHttpClient(this);
    }
    executeGQL(gql) {
        return wrapValidatorsWithPromise(() => {
            isNonEmptyString(gql, 'gql_query', true);
        }, CatalystGQLError).then(() => {
            const postData = {
                query: gql
            };
            const request = {
                method: 'POST',
                path: `/${PRODUCT_NAME}/${API_VERSION}/project/${this.projectId}/gql/execute`,
                data: postData,
                type: 'json'
            };
            return this.requester.send(request).then((resp) => {
                return resp.data.data;
            });
        });
    }
}
exports.GQL = GQL;
