//this Deluge function takes an array of Contact IDs and looks up Deals related to those Contacts
string standalone.COQLTest(List idArray)
{
	whereClause = '';
    //format the query string
	for each x in idArray
    {
		if(idArray.indexOf(x) == 0) {
			whereClause = 'Contact_Name='+x;
		}
		else {
			whereClause = "Contact_Name=" + x + " OR (" + whereClause + ")";
		}
    }
    queryString = "select Contact_Name.First_Name, Contact_Name.Last_Name, Amount from Deals where "+whereClause;
    //create the API parameters
    queryMap = Map();
    queryMap.put("select_query",queryString);
    //call the API
    response = invokeurl
    [
        url :"https://www.zohoapis.com/crm/v7/coql"
        type :POST
        parameters:queryMap.toString()
        connection:"coqlconnection"
    ];
    //see the response
    info response;
    //return
    return "ok";
}