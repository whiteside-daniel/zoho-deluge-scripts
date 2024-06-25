//This custom Deluge function will take a Contact Name and Account ID and generate a Zoho Desk Ticket automatically.
//Reason - Zoho SalesIQ default ticket creation option requires a contact's email address to generate a ticket without
//throwing an error. This script will allow you to use a custom function to create that ticket with a name instead
//of an email.

//Prerequisite - you will need an Zoho Oauth connection with permission for Zohodesk.tickets.create

//You will need to obtain your orgId in Zoho Desk and put it here
orgId = "<Your_Org_ID>";
//put the name of your Zoho Oauth Connection here
// you need an Oauth connection from SalesIQ to Zoho Desk
//Scope: ZohoDesk.Tickets.Create
oAuthConnection = "<Your_Oauth_Connection>"

//get the account name to add to the ticket subject
propertyName = zoho.desk.getRecordById(orgId,"Accounts",session.get("propertyName").get("value"),"zohodesk").get("accountName");

//contact map should have either lastName or email to avoid throwing an error
contactMap = Map();
contactMap.put("lastName",session.get("customerName").get("value"));

//Required fields to create a desk ticket are "contact" (JSON Object), "subject" (String), and "departmentId" (String)
ticketData = Map();
ticketData.put("contact",contactMap);
ticketData.put("subject","Missed Collection - " + propertyName);
ticketData.put("departmentId","620772000000006907");

//try to generate a ticket, or return the error if something went wrong
try 
{
	createTicket = zoho.desk.create(orgId,"tickets",ticketData,"zohodesk");
	ticketId = createTicket.get("id");
	ticketNumber = createTicket.get("ticketNumber");
	code = "success";
	info createTicket;
}
catch (err)
{
	ticketId = 0;
	ticketNumber = 0;
	code = err.toString();
}

//return any return code generated and the ticket number and ticket ID
//ticket number is a short number for customer reference
//ticket ID is the zoho internal record ID and should not be shared to the customer
return {"code":code,"ticketNumber":ticketNumber.toString(),"ticketId":ticketId.toString()};
