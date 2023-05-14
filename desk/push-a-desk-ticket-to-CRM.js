//requires a Ticket ID to start the function
//When you setup the Automation > Workflow you can map a ticket ID to this function
//Then, everytime this function is triggered by creating or editing a ticket - a Ticket ID will be
//fed into this function automatically

formattedURL = "https://desk.zoho.com/api/v1/tickets/" + ticketId.toString();
//info formattedURL;
//info for Deluge code is the same as console.log, for debugging 

//Step 1 - API call to Zoho Desk to get the ticket information, returned in a JSON object
ticketResponse = invokeurl
[
	url :formattedURL
	type :GET
	connection: "<Your_Oauth_Connection_Name>"
];
//info ticketResponse;

// Step 2 - get some critical information from the ticket and format it in a new JSON object
// you can add any fields that you like, but they have to exist in the desk ticket AND the 
// new custom module in CRM 
CrmFieldMap = Map();
CrmFieldMap.put("Name",ticketResponse.get("subject"));
CrmFieldMap.put("Ticket_Due_Date",toDateTime(ticketResponse.get("dueDate"),"yyyy-MM-dd HH:mm:ss"));
CrmFieldMap.put("Ticket_Description",ticketResponse.get("description"));
emptyMap = Map();

//info CrmFieldMap;

/* 

lines 18-23 create a JSON object like this
{
	"Name" : "New Ticket",
	"Ticket_Due_Date" : "2023-05-04 16:30:00",
	"Ticket_Description" : "this ticket was created as a test ticket, see Daniel for more information"
}


For this API call, the key is the name of the field in the CRM/Destination module where you'll push the data
and the value is pulled from the Desk Ticket/Source object (we requested the source object in line 10-15) 
in a key-pair structure like this:
{
	"CRM_Destination_Field_Name" : "Desk Ticket/Source Value"
}

*/


//Step 3 - Create a new record in Zoho CRM inside the <Custom_Module> you created with appropriate field names
//<Your_Custom_Module_Name> is the name of your new custom module where the ticket will go

createCrmRecordResponse = zoho.crm.createRecord("<Your_Custom_Module_Name>",CrmFieldMap,emptyMap,"<Your_Oauth_Connection_Name>");
