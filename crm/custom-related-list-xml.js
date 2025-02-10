//this deluge function will find all Deals which are related to an account, 
//and display them in a custom related list.Custom Related Lists are built 
//with a deluge function that returns XML. The CRM engine renders the XML 
//in the UI as if it were a related list like any other. The Related List
//is generated whenever you scroll far enough down the record that 
//part of the page begins to load... it's at this moment CRM will call the
//function which renders the XML for the custom related list. Special thanks
//to Zach Zivnuska for diggin up this code from the depths of some Zoho 
//developer's basement file cabinet.

//Step 1. Go to the Accounts module and visit any account. On the left tab, 
//click "Add Related List" and then choose the "Function" option
//
//Step 2. Create a new function and paste the code below into the function editor
string createXMLCustomRelatedList(String accountId)
{
    try 
    {
        accountResponse = zoho.crm.getRecordById("Accounts",accountId);
        accountName = accountResponse.get("Account_Name");
        accountOwner = accountResponse.get("Owner").get("name");
        dealsResponse = zoho.crm.getRelatedRecords("Deals","Accounts",accountId);
        responseXML = "<record>";
        rowCount = 1;
        for each  ele in dealsResponse
        {
            status = ele.get("Stage");
            cdate = ele.get("Amount");
            dealId = ele.get("id");
            dealName = ele.get("Deal_Name");
            responseXML = responseXML + "<row no=\"" + rowCount + "\">";
            responseXML = responseXML + "<FL val='Deal' link='true' url='https://crm.zoho.com/crm/org841022399/tab/Potentials/" + dealId + "'>" + dealName + "</FL>";
            responseXML = responseXML + "<FL val='Owner'>" + accountOwner + "</FL>";
            responseXML = responseXML + "<FL val='Stage'>" + status + "</FL>";
            //responseXML = responseXML + "<FL val='Another Column'>" + column_value + "</FL>";
            responseXML = responseXML + "</row>";
            rowCount = rowCount + 1;
        }
        responseXML = responseXML + "</record>";
    }
    catch (err)
    {
        responseXML = "<error><message>No records found.</message></error>";
    }
    return responseXML;
}
//
//Step 3. in line 24, change the orgID from the sample value 841022399 to your own org ID
//You can find that org ID in your URL or in your CRM settings
//Step 4. Map the Account ID to your input variable "accountId" and save the function
