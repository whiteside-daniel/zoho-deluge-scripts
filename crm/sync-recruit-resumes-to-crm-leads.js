//Description: this function copies resumes that were uploaded (pdf) to Zoho Recruit into a Candidates record.
//You should configure a Workflow rule that is triggered when a lead is created and then pass a leadID into a custom function
//Prerequisite - you should setup an Oauth connection with scopes ZohoCRM.Modules.All, ZohoCRM.files.CREATE, ZohoRecruit.modules.ALL
//
//Step 1 - get the lead record details first
leadResponse = zoho.crm.getRecordById("Leads", leadID);
//get some details which we will search recruit for a match
firstName = leadResponse.get("First_Name");
lastName = leadResponse.get("Last_Name");
email = leadResponse.get("Email");
//setup search params
searchParams = "(Email:equals:"+ email +")";
info searchParams;
try{
	//search for candidates in Recruit that match the unique identifiers
	candidateResponse = invokeurl[
		url: "https://recruit.zoho.com/recruit/v2/Candidates/search?criteria=" + searchParams
		type: GET 
		connection: "my-connection-name"
	];
	//get some critical data from recruit record
	recruitMatch = candidateResponse.get("data").get(0);
	recruitID = recruitMatch.get("id");
	//check if the recruit record has any attachments
	attachmentPresent = recruitMatch.get("Is_Attachment_Present");
	//if there is an attachment, do the following
	if(attachmentPresent) {
		//list all of the attachments for this candidate
		attachListUrl = "https://recruit.zoho.com/recruit/v2/Candidates/"+ recruitID +"/Attachments";
		attachmentResponse = invokeurl[
			url: attachListUrl
			type: GET
			connection: "my-connection-name"
		];
		//info attachmentResponse;
		attachedDocuments = attachmentResponse.get("data");
		//for each attachment, try to upload to CRM
		uploadData = list();
		for each document in attachedDocuments {
			attachmentID = document.get("id");
			getAttachmentsUrl = "https://recruit.zoho.com/recruit/v2/Candidates/"+ recruitID +"/Attachments/" + attachmentID;
			attachmentDownload = invokeurl[
				url: getAttachmentsUrl
				type: GET 
				connection: "my-connection-name"
			];
			//format the attachments for the CRM Attachments API
			params = map();
			params.put("file" , attachmentDownload);
			uploadData.add(params);
			//uploadData.add(params);
			uploadAttachmentUrl = "https://www.zohoapis.com/crm/v7/Leads/"+ leadID +"/Attachments";
			uploadAttachmentResponse = invokeurl[
				url: uploadAttachmentUrl
				type: POST 
				connection: "my-connection-name"
				parameters: params
				content-type: "multipart/form-data"
			];
			info uploadAttachmentResponse;
		}
	}
	else{
		info "this record had no attachments: " + firstName + lastName + email;
	}
}
catch(e){ info e; }
