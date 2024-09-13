export class GQL {
    constructor(app: any);
    requester: AuthorizedHttpClient;
    executeGQL(gql: any): Promise<any>;
}
import AuthorizedHttpClient_1 = require("../utils/api-request");
import AuthorizedHttpClient = AuthorizedHttpClient_1.AuthorizedHttpClient;
