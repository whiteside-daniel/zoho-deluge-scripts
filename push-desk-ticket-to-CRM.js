//requires a Ticket ID to start the function
//When you setup the Automation > Workflow you can map a ticket ID to this function
//Then, everytime this function is triggered by creating or editing a ticket - a Ticket ID will be
//fed into this function automatically

formattedURL = "https://desk.zoho.com/api/v1/tickets/" + ticketId.toString();
//info formattedURL;
//info for Deluge code is the same as console.log, for debugging 

//API call to Zoho Desk to get the ticket information, returned in a JSON object
ticketResponse = invokeurl
[
	url :formattedURL
	type :GET
	connection: <Your_Oauth_Connection_Name>
];

//get some critical information from the ticket and format it in a new JSON object
//for the next API call to Zoho CRM
CrmFieldMap = Map();
CrmFieldMap.put("Name",ticketResponse.get("subject"));
CrmFieldMap.put("Ticket_Due_Date",toDateTime(ticketResponse.get("dueDate"),"yyyy-MM-dd HH:mm:ss"));
CrmFieldMap.put("Ticket_Description",ticketResponse.get("description"));
emptyMap = Map();

//lines 18-23 create a JSON object like this
// {
//    "Name" : "New Ticket",
//    "Ticket_Due_Date" : "2023-05-04 16:30:00",
//    "Ticket_Description" : "this ticket was created as a test ticket, see Daniel for more information"
// }
//
// For this API call, the key is the name of the field in the CRM modul where you'll push the data
// and the value is pulled from the Desk ticket object we requested in line 10-15
// like this:   {
//                  "CRM_Field_Name" : "Desk Ticket Value"
//              }

//Create a new record in Zoho CRM inside the <Custom_Module>
//<Your_Custom_Module_Name> is the name of your new custom module where the ticket will go

createCrmRecordResponse = zoho.crm.createRecord(<Your_Custom_Module_Name>,CrmFieldMap,emptyMap,"allmodules");
