//get the contact field value
const contactField = ZDK.Page.getField('Call_to');
const contactFieldValue = contactField.getValue();

//fieldValue will include recordID and contact name, like this: {id: '6103677000000494608', name: 'Test'}
//so we need to parse it
contactId = contactFieldValue.id;
contactName = contactFieldValue.name;
// console.log(contactId + contactName);

// //now make API request to find related Account?
// //WAIT! hang on there buddy
// //FIRST YOU NEED AN ACCESS TOKEN
const resp = ZDK.HTTP.request({
 url: 'https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.3e107cd202a59443f94b86a2b17e43a8.c5fa2f4460e89b90465aba12881a535a&client_id=1000.WG6S32VVBN3V6X6EK8VWMW1XQVA4IG&client_secret=ffcc8c5116be36b248f73531e415e022a11b3a6296&grant_type=refresh_token',
 method: 'POST',
 headers: {
   'Content-Type': 'application/json'
 }
});
const getResponse = resp.getResponse();
// console.log(getResponse);
// //get the access token
accessToken = JSON.parse(getResponse)["access_token"];
// console.log(accessToken);
const authHeaders = `Zoho-oauthtoken ${accessToken}`;
const formattedURL = `https://www.zohoapis.com/crm/v6/Contacts/${contactId}`;
console.log(formattedURL);
//now try to get the account data
const contactResp = ZDK.HTTP.request({
 url: formattedURL,
 method: 'GET',
 headers: {
   'Authorization': authHeaders
 }
});
const contactResponse = JSON.parse(contactResp.getResponse());
// console.log(contactResponse);
const accountId = contactResponse.data[0].Account_Name.id;
const accountName = contactResponse.data[0].Account_Name.name;
var lookup_field = ZDK.Page.getField('Account');
lookup_field.setValue({id: accountId , name: accountName });
//
//
//END OF SCRIPT
