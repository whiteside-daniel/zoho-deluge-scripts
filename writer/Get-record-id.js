//THIS SCRIPT WILL GET THE RECORD ID OF THE RECORD THAT TRIGGERED THE MAIL MERGE FUNCTION 
//INTENDED AS A ZOHO WRITER CUSTOM DELUGE FUNCTION
response = mergeEventObj.get("response");
mergeddoc_info = response.get("mergedDocInfo");
for each mergeddoc in mergeddoc_info
{
    merge_data = mergeddoc.get("data");
    crm_record_id = merge_data.getJSON("id");  // This is the CRM record ID
}