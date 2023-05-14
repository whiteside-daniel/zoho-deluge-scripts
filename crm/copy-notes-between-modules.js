//this script will copy notes from Accounts to Contacts
//start with a contactID
contactResponse = zoho.crm.getRecordById("Contacts", contactId);
account = zoho.crm.getRecordById("Accounts", contactResponse.get("Account_Name").getJson("id"));
try 
{
	//get Account ID
	accountId = account.get("id");
	
	//generate URL string for GET request
	formattedUrlNotes = "https://www.zohoapis.com/crm/v2/Accounts/" + accountId.toString() + "/Notes";
	
	//get Notes from Accounts
	notesResponse = invokeurl
	[
		url :formattedUrlNotes
		type :GET
		connection:"allmodules"
	];
	
	//extract the real data from the JSON object
	noteData = notesResponse.get("data");
	
	//take each note and upload them back to Contacts
	for each  note in noteData
	{
		//establish key-value pairs for the API parameters
		noteMap = Map();
		noteMap.put("Note_Title",note.get("Note_Title"));
		noteMap.put("Note_Content",note.get("Note_Content"));
		noteMap.put("Parent_Id",contactId);
		noteMap.put("se_module","Contacts");
		dataList = list();
		dataList.add(noteMap);
		uploadNotesParams = Map();
		uploadNotesParams.put("data",dataList);
		//info uploadNotesParams;
		
		//gegnerate formatted URL for API call
		uploadNotesFormattedUrl = "https://www.zohoapis.com/crm/v2/Contacts/" + contactId.toString() + "/Notes";
		//info uploadNotesFormattedUrl;
		try 
		{
			//API call using invokeurl[]
			uploadResponse = invokeurl
			[
				url :uploadNotesFormattedUrl
				type :POST
				parameters:uploadNotesParams.toString()
				connection: <Oauth_Connection_Name>
			];
			//info uploadResponse;
		}
		catch (e)
		{
			info e;
		}
	}
}
catch (e)
{
	return e;
}
//if you get a return error you made need to uncomment the return statement
//return "";
