//Description: This scsript copies attachments associated with an Account and creates a duplicate associated with a Contact
//You should configure your function so it passes in an accountId to begin with.
//Prerequisite: you must have an Oauth connetion setup for CRM with scope ZohoCRM.Modules.ALL
//
//get an Account object/objects - this will be the original SOURCE module of the attachments which need to be transferred
accountResponse = zoho.crm.getRecordById("Accounts",accountId);
customList = list();
customList.add(accountResponse);
//you can add multiple accounts to this list by doing another customList.add(<Account_Object>) statement


//for each Account, iterate this loop
for each  record in customList
{
    	//get the Account ID
	id = record.get("id");
	
    	//find related attachments with this Account
	relatedAttachments = zoho.crm.getRelatedRecords("Attachments","Accounts",id.toLong());
	
    	//get the first Contact assocaited with this Account
	relatedContact = zoho.crm.getRelatedRecords("Contacts","Accounts",id.toLong(),1,1);
	
    	//get the record ID and name of this Contact
	contactId = relatedContact.get(0).getJson("id");
	contactName = relatedContact.get(0).getJson("Stud_Name");
	
    	//for each attachment associated with the current Account, iterate this loop
	for each  rec in relatedAttachments
	{
        	//get the file name and record ID of the attachment
		fileName = rec.get("File_Name");
		fileRecordId = rec.get("id");
		
        	//generate a formatted URL for the api call
		formattedUrl = "https://zohoapis.com/crm/v3/accounts/" + id + "/attachments/" + fileRecordId;
		invokeParams = Map();
		invokeParams.put("fields_attachment_id",fileRecordId);
		
        	//execute API call to download the attachment
		downloadResponse = invokeurl
		[
			url :formattedUrl
			type :GET
			parameters:invokeParams
			connection: "my-connection-name"
		];
		
        	//upload this attachment back to the target module, in this case "Contacts"
		uploadResponse = zoho.crm.attachFile("Contacts",contactId,downloadResponse, "allmodules");
	}
}
//if you get a return error, you may need to uncomment this return statement
// return "";
