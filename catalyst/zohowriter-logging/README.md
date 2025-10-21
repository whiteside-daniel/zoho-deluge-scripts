# Zoho Writer Logs via Catalyst Function

Configure Zoho Writer with advanced logging. Zoho writer cam implement custom Deluge scripts, but those scripts are difficult to manage and see logs. 

## Configure your Catalyst Project

You need to setup a catalyst Datastore (SQLish database) with the following additional columns (primary key ID and other default columns auto generated): 

CREATE TABLE writer_data_logs (
    data Text,
    email_address VARCHAR(255),
    crm_id VARCHAR(255),
    merge_event_object Text
);

## Deploy this function in your Catalyst environment
Initialize a serverless function called "writer_log" and then copy the `index.js` and `package.json` files into the local directory. Then run
`npm install` from that directory. Then run
`catalyst deploy` to deploy the function into Catalyst cloud
Note down your Catalyst URL, you'll need that in the next step

## Update your Writer custom function
Include the following lines of code, and adding any logging you wish by using logData.put()
```
//AT THE TOP OF THE DELUGE SCRIPT

logData = Map();

//
//CORE LOGIC GOES HERE
//
//YOUR CUSTOM ERROR LOGGING HERE

logData.put("key", value);

//
//
//CORE LOGIC CONTINUES
//
//

logMessage = Map();
logMessage.put("data",logData.toString());
logMessage.put("email_address", zoho.loginuserid);
logMessage.put("merge_event_object", mergeEventObj);
logResponse = invokeurl
[
	url :"https://xxyyzz.catalystserverless.com/server/[function_name]/writerlog/"
	type :POST
	parameters:logMessage.toString()
	content-type:"application/json"
];
```