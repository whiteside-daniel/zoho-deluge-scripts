//as of June 2024... ~3 min to delete 10,000 records
//
//make a double for loop to run 100 times per CF call
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
		//delete 100 records at a time... this is the max for this API
		recordDelete = invokeurl
			[
				url :"https://www.zohoapis.com/crm/v3/Module_Name?ids=" + formattedIdList
				type :DELETE
				connection:"crmmodules"
			];
	}
}
