//This script will use Deluge to find the most recently created record
//variable names look <Like_This>
//you'll need to insert your own real values for these variables


//STEP 1 - setup query parameters

//create a JSON map
query_map = Map(); 

//define the sort criteria
query_map.put("sort_order", "desc"); //sort order can be asc or desc

//define which column/field name you'd like to sort by
query_map.put("sort_by", "<Field_Name>"); 

//STEP 2 - search the module for records using the criteria you just set
              
//use deluge to find the most recent record
mostRecentRecord = zoho.crm.getRecords("<Module_Name>", 1, 1, query_map, "<Oauth_Connection_Name>");

//mostRecent is returned as as "list" even though there will only be one item in the list
//get the first item in the list
record = mostRecentRecord.get(0);
//record is now set as a JSON-type record object - formatted as a String


//STEP 3 - use the record you found to get data, modify record, etc

//you can go on to do anything with this record, like get values or update the record
recordId = record.getJson("id");
updateValueKeyPairs = map();
updateValueKeyPairs.put("<Field_Name>", "<Field_Value>");    //example updateValueKeyPairs.put("Account Status", "Active")
updateResponseObject = zoho.crm.updateRecord("<Module_Name>", updateValueKeyPairs, "<Oauth_Connection_Name>");
