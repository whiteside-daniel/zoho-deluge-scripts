string button.getDealTotal(String leadID)
{
queryMap = Map();
queryString = "select SUM(Amount) from Deals where Associated_Lead =" + leadID;
queryMap.put("select_query",queryString);
response = invokeurl
[
	url :"https://www.zohoapis.com/crm/v7/coql"
	type :POST
	parameters:queryMap.toString()
	connection:"coqlconnection"
];
sumOfDeals = response.get('data').get(0).get("SUM(Amount)");
updateParams = {"Pending_Deal_Total":sumOfDeals};
updateResponse = zoho.crm.updateRecord("Leads",leadID,updateParams);
return "";
}
