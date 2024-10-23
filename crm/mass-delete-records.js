//as of June 2024... ~3 min to delete 10,000 records
//Description: This funtion iterates through up to 10,000 records in a module and deletes them.
//You should configure it as a standalone and use it wiseley
//
//
//Step 1 - make a double for loop to run 100 times per CF call
repeatList = [1,2,3,4,5,6,7,8,9,10];
secondRepeat = [1,2,3,4,5,6,7,8,9,10];
for each rep in secondRepeat {
	for each num in repeatList {
		blankMap = map();
		//get 100 records at a time
		recordsList = zoho.crm.getRecords("Module_Name",1,100,blankMap,"connection-name");
		idList = list();
		for each  record in recordsList
		{
			id = record.get("id");
			idList.add(id);

		}
		formattedIdList = idList.toString();
		//delete 100 records at a time... this is the maximum for this API so we will repeat it 100x
		recordDelete = invokeurl
			[
				url :"https://www.zohoapis.com/crm/v3/Module_Name?ids=" + formattedIdList
				type :DELETE
				connection:"crmmodules"
			];
	}
}
