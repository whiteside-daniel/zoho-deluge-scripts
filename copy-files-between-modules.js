// Specify the source and destination modules
sourceModule = "<Source_Module_Name>";
destinationModule = "<Destination_Module_Name>";

// Specify the IDs of the source records to copy attachments from
recordIds = list();

//add something to the list of record IDs
recordIds.add("<Record_Id>");
recordIds.add("<Record_Id>");

// Loop through each record ID and copy the attachments
for each recordId in recordIds
{
    // Get the list of attachments for the source record
    attachments = zoho.crm.getAttachments(sourceModule, recordId);

    // Loop through each attachment and copy it to the destination record
    for each attachment in attachments
    {
        // Copy the attachment to the destination record
        zoho.crm.copyFile(sourceModule, recordId, attachment, destinationModule, recordId);
    }
}
