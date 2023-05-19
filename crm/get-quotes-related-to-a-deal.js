//this script, written in Deluge, takes as an input a Deal record ID and returns
//the most recent quote associated with that Deal

//remember dealId must be defined or passed into the function
quoteResponse = zoho.crm.getRelatedRecords("Quotes","Deals",dealId);

//set up a baseline for comparing quotes based on their dates of creation
idOfNewestQuote = 0;
timeOfNewestQuote = "01-01-1970 00:01".toDateTime("MM-dd-yyyy mm:hh");

//iterate through the list of quotes returned from zoho.crm.getRelatedRecords
//even if there are no quotes in the quoteResponse, you will get a list with zero elements
for each  quote in quoteResponse
{
	if(quote.getJson("Created_Time").toDateTime() > timeOfNewestQuote)
	{
		idOfNewestQuote = quote.getJson("id");
		timeOfNewestQuote = quote.getJson("Created_Time");
	}
}

//depending on how your code and trigger is configured, 
//you may need to comment/uncomment the return statement below
if(idOfNewestQuote != 0) {
  return {"id" : idOfNewestQuote, "createdTime": timeOfNewestQuote };
} 
else {
  return "no quotes associated with this deal";
}
