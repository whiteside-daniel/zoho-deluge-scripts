//this script will allow you to search through records within a Zoho Desk Module with custom field values.
//The syntax for searching on custom fields is unlike searching records with other Zoho products like CRM.

//Step 1 - first you must specify your orgId. You can find your orgId in Zoho Desk by going to 
//settings > API > scroll all the way down to the bottom of the page.
orgId = "<Your_Org_ID>";

//Step 2 - create a JSON object/Map with for the custom field search
criteriaMap = Map();

//no matter the name of your custom field, you have to use the key "customField1"
criteriaMap.put("customField1","<Custom_Field_Name>:<Custom_Field_Value>");

//search across another custom field
//this will only return records where the propertyId = 140984578458
criteriaMap.put("customField2", "propertyId:140984578458");

//execute the search
//see docs for this function - https://www.zoho.com/deluge/help/desk/search-records.html
deskResponse = zoho.desk.searchRecords(orgId,"Accounts",criteriaMap,0,1,"<Your_Oauth_Connection_Name>");

//now display your data like this
info deskResponse;
