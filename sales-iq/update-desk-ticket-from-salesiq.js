//This script is a SalesIQ plug that updates a ticket that was just created by the codeless chatbot. The current integration between
//SalesIQ and Zoho Desk for generating a ticket doesn't allow the modification of most of the ticket fields. This script
//will help you update a ticket that was created by your chatbot with some more detailed field values. Here we will update
//the dueDate field, the classification field, and a few custom fields. Note the special structure that's required to modify 
//any custom fields. Also note that in this example we are changing the associated account with a ticket, which really means
//we are changing the account associated with the relevant contact.
//
//
//you need to provide an orgId, which can be found in Desk > Settings > API > Scroll all the way to bottom of page
orgID = "<Your_Org_ID>"

//you can check if a value exists in the chat context like this, without erroring out the code if it doesn't exist
if(session.containsKey("accountName"))
{
	propertyName = session.get("accountName").get("value");
}

try 
{
  //fetch the current ticket using ticketId and then grab the contactId associated with that ticket, all in one line
	contactId = zoho.desk.getRecordById(orgID,"Tickets",session.get("ticketId").get("value"),"zohodesk").get("contactId");
  
  //grab the desk accountId
	deskAccountId = session.get("accountName").get("value");
  
	//try to update the contact
	contactUpdateParams = Map();
	contactUpdateParams.put("accountId",deskAccountId);
	contactUpdateResponse = zoho.desk.update(orgID,"Contacts",contactId,contactUpdateParams,"zohodesk");
	info contactUpdateResponse;
  
	//set due date as 5 hours from current time
	dateTime = zoho.currenttime.addBusinessHour(5);
	dateTime_DATE = dateTime.getPrefix(" ").toString("yyyy-MM-dd");
	dateTime_TIME = dateTime.getSuffix(" ");
	dateTime_FORMATTED = dateTime_DATE + "T" + dateTime_TIME + "Z";
  
	//set up parameters for the updated ticket API call
	parameterMap = Map();
	parameterMap.put("dueDate",dateTime_FORMATTED);
	parameterMap.put("classification","SalesIQ");
	customFields = Map();
	customFields.put("cf_submitter_name",session.get("submitterName").get("value"));
	customFields.put("cf_affected_units",session.get("unitNumber").get("value"));
	customFields.put("cf_type","Issue");
	parameterMap.put("cf",customFields);
	ticketID = session.get("ticketId").get("value");
  
  //update the ticket
	updateResponse = zoho.desk.update(orgID,"Tickets",ticketID,parameterMap,"zohodesk");
  
  //this script returns the variable 'code' to the chatbot. You can have it return relevant info like this
	code = contactUpdateResponse.toString();
}
catch (e)
{
  //any other errors will be returned to the chatbot by assigning the errors to the variable 'code'
	code = e.toString() + " ";
}

//return statement to chatbot
stmt = Map();
stmt.put("code",code);
return stmt;
