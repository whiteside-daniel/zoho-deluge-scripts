//This script takes an input zip code that a user typed into the chatbot
//and sends a request to Zoho CRM for any Account records in that zip code
//returning an "Options List" data type to the chatbot

//session.get helps you get session variables
//Session variables are reset everytime a new chat starts
zip = session.get("zipCode").get("value");

//info session;

//set criteria string in the format (Column_Name:operator:Field_Name)
criteriaString = "(Shipping_Code:equals:" + zip + ")";

//Search accounts with this criteria, zoho.crm.searchRecords returns a List() object
crmResponse = zoho.crm.searchRecords("Accounts",criteriaString);

//setup before loop
optionList = List();
i = 1;

//for each property in the criteria zip code that is a current client,
//add the property to the options list
for each  property in crmResponse
{
	if(property.get("STATUS") == "Current Client")
	{
		propertyName = property.get("Account_Name") + " - " + property.get("Full_Shipping_Address");
		optionList.add({"id":i.toString(),"text":propertyName});
		i = i + 1;
	}
}

//format the response correctly, chatbot is expecting an object like this:
//      {"properties": [List of Properties] }
//you can configure what your chatbot expects to be returned when you select Add Plug
//in the codeless bot builder
response = Map();
response.put("properties",optionList);

//return list of properties which are in the zip code that the user typed in the chatbot
return response;
