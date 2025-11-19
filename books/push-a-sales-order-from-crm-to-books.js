//This script will take a Sales Order created in Zoho CRM, determine the "parent" account to which a Sales Order should 
//be billed to, and make a Sales Order in Zoho Books with the "parent" account as the primary contact. 
//Reason - The default integration between Books and CRM only allows the sync of a few modules, of which Sales Orders 
//are not included. This script will augment the ordinary integration and allow pushing a CRM Sales Order to a Books Sales Order.

//Limitations - 1) Each "Parent Account" must have a unique name. 2) Once a SO has been pushed from CRM to Books, there
//is no way to modify the Books SO from CRM. This is a one-way push of information from Zoho CRM (Sales Orders) to 
//Zoho Books (Sales Orders).

//Prerequisite 1 - CRM Accounts Module Setup
//You need to go into Zoho CRM > Settings > Modules and Fields > Accounts and add a "Checkbox" field named 
// "Is_a_Parent_Account" - this field will let CRM know if this particular account is a parent account. You also need to add
//a "Lookup" field named "Parent Account." For accounts which are NOT parent accounts (aka child account), you will indicate
//in the Account record which Account is the parent Account.
//
//                        --Accounts Configuration in Zoho CRM--
//
//       - Parent Account                  (if account is a parent, bill normally)
//               |_ Child Account          (if account is a child account, send the Sales Order to parent account in Zoho Books)
//

//Prerequisite 2 - Create custom CRM Accounts View
//You need to go to the Accounts module in Zoho CRM, and in the top left click the dropdown for Accounts views. There are some
//default views like "All Accounts" and "New Accounts This Week." You need to create a New Custom View called "Parent Accounts"
//with a filter criteria of "Is a Parent Account" IS Selected and then SAVE that view.

//Prerequisite 3 - Zoho CRM/Books Sync
//You must go to Zoho Books > Settings > Integrations and activate an integration between books and Zoho CRM. You must have 
//contacts synced between Zoho CRM (Accounts) > Zoho Books (Contacts). Make sure at Step 4, "Select the View to be Synced"
//you have selected "Parent Accounts." Then set up the sync for products/line items between Zoho CRM (Products) > Zoho Books (Items).

//Prerequisite 4 - Zoho Oauth
//You must go to Zoho Books > Settings > Developer Space > Connections and create/activate a Zoho Oauth connection with the 
//following permissions: 
//   ZohoBooks.salesorders.CREATE 
//   ZohoBooks.contacts.Read
//   ZohoBooks.settings.Read
//Remember the name of your connection, it will be insert inside double quotes wherever you see <Your_Oauth_Connection>



//to begin this script - you MUST pass in a variable called salesOrderId - this ID should be
//the record ID for the CRM Sales Order you wish to push to Zoho Books.

//establish your Zoho Books orgId
//go to Zoho Books > Settings > Organization Profile
booksOrgId = "<Books_Org_ID>";
oauthConnectionName = "<Your_Oauth_Connection_Name>";
try 
{
	//get the CRM version of the sales order - a JSON object is returned
	crmSalesOrderResponse = zoho.crm.getRecordById("Sales_Orders",salesOrderId);
	//get the associated Account to that Sales Order
	accountInfo = crmSalesOrderResponse.get("Account_Name");
	crmAccountName = accountInfo.getJson("name");
	crmAccountId = accountInfo.getJson("id");
	//try to find parent account
	salesOrderAccountResponse = zoho.crm.getRecordById("Accounts",crmAccountId);
	isAccountParent = salesOrderAccountResponse.get("Is_a_Parent_Account");
	//If this account is the parent account, pass that Account ID forward
	if(isAccountParent)
	{
		parentAccountId = crmAccountId;
	}
	//if this account is NOT the parent account, find the parent account
	//and then pass that Account ID forward
	else
	{
		parentAccountId = salesOrderAccountResponse.get("Parent_Account").getJson("id");
	}
	//find the Zoho Books Contacts record that is associated with the Zoho CRM Account
	headers_data = Map();
	headers_data.put("zcrm_account_id",parentAccountId);
	//API search Zoho Books
	contactResponse = invokeurl
	[
		url :"https://www.zohoapis.com/books/v3/contacts?organization_id=" + booksOrgId
		type :GET
		parameters:headers_data
		connection: oauthConnectionName
	];
	//get the Zoho Books Contact ID from the response object
	booksContactId = contactResponse.get("contacts").get(0).get("contact_id");
	//gran all relevant CRM Sales Order Fields
	booksCustomerId = booksContactId;
	booksSalesOrderDate = today.toString("yyyy-MM-dd");
	//handle Line Items from the Sales Order
	booksLineItems = list();
  //grab the list of products included in the Sales Order
	crmLineItems = crmSalesOrderResponse.get("Product_Details");
  //for each line item...
	for each  product in crmLineItems
	{
    //get the Product Name
		crmProductName = product.getJson("product").getJson("name");
		productSearchParameters = Map();
		productSearchParameters.put("name",crmProductName);
    //Search Books for a corresponding Item (Same as as Product in CRM)
		booksProductResponse = invokeurl
		[
			url :"https://www.zohoapis.com/books/v3/items?organization_id=" + booksOrgId
			type :GET
			parameters:productSearchParameters
			connection: oauthConnectionName
		];
    //assemble the line item list
		lineItemMap = map();
		lineItemMap.put("item_id", booksProductResponse.get("items").get(0).getJson("item_id"));
		lineItemMap.put("rate", product.get("rate"));
		lineItemMap.put("name", booksProductResponse.get("items").get(0).get("name"));
		lineItemMap.put("quantity", product.get("quantity"));
		lineItemMap.put("description", product.get("product_description));
		booksLineItems.add(lineItemMap);
	}
	//get ready to create the sales order
	salesOrderCreateParameters = map();
  //assemble API call parameters
	salesOrderCreateParameters.put("customer_id", booksCustomerId);
	salesOrderCreateParameters.put("date", booksSalesOrderDate);
	salesOrderCreateParameters.put("line_items", booksLineItems);
	//create a new sales order in Books with API request
	createNewSalesOrderResponse = invokeurl[
		url: "https://www.zohoapis.com/books/v3/salesorders?organization_id="+booksOrgId
		type: POST
		content-type: "application/json"
		parameters: salesOrderCreateParameters.toString()
		connection: oauthConnectionName
	];
}
catch (e)
{
	info "error: " + e;
}
