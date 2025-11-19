//this function takes form data from Zoho Creator and updates Zoho Inventory accordingly. Use case: Inventory management where Zoho Creator is used as a way for field techs to remotely create Inventory adjustments. Techs will sometimes pull an asset from a field location, or take an asset in for repair or service. Based on the type of action they are taking, a specific type of inventory adjustment should be made. Additionally - this function was so tricky and Creator logging is so poor, I've added Zoho Catalyst logging to track the function throughout its execution. You can use this framework to log your own tricky deluge functions
logData = Map();
logMessage = Map();
logMessage.put("email_address",zoho.loginuserid);
logMessage.put("org_id","myOrgId1234567890");
logData.put("function_start",now.toString());
logData.put("distribution_type",input.Distribution_Type);
// logMessage.put("crm_id", null);
// logMessage.put("merge_event_object", null);
//Get Access Token
try 
{
	OAuth = OAuth[ID != 0];
	accessToken = OAuth.Access_Token;
	//Fetch All Sites
	apiHeaderMapOne = Map();
	apiHeaderMapOne.put("Authorization"," Zoho-oauthtoken " + accessToken);
	apiParams = Map();
	apiParams.put("Page","page_token");
	siteInfoList = List();
	crmSitesApiResponse = invokeurl
	[
		url :"https://www.zohoapis.com/crm/v7/Sites/search?criteria=((Name:equals:" + input.Site_Number + "))"
		type :GET
		parameters:apiParams
		headers:apiHeaderMapOne
	];
	crmSites = crmSitesApiResponse.get("data");
	// info "CRM Sites: " + crmSites;
	for each  crmSite in crmSites
	{
		siteId = crmSite.get("id");
		info "SiteId: " + siteId;
		siteName = crmSite.get("Name");
		address = crmSite.get("Mon_Street");
		siteInfo = "Site: " + siteName + " || " + address;
		siteInfoList.add(siteInfo);
	}
	logData.put("sites_found",siteInfoList);
	page_no = 1;
	per_page = 50;
	allInvUsers = zoho.inventory.getRecords("Users","651599999",{"page":page_no.toString(),"per_page":per_page.toString()});
	allUsers = allInvUsers.get("users");
	for each  invUser in allUsers
	{
		if(invUser.get("email") == zoho.loginuserid)
		{
			invUserId = invUser.get("user_id");
		}
	}
	//Fetch All Warehouses
	page_no = 1;
	per_page = 50;
	inventoryWarehousesApiResponse = zoho.inventory.getRecords("Warehouses","65199999",{"page":page_no.toString(),"per_page":per_page.toString()});
	// info inventoryWarehousesApiResponse;
	warehouses = inventoryWarehousesApiResponse.get("warehouses");
	warehouseMap = Map();
	for each  warehouse in warehouses
	{
		warehouseName = warehouse.get("warehouse_name");
		warehouseId = warehouse.get("warehouse_id");
		warehouseMap.put(warehouseName,warehouseId);
	}
	logData.put("warehouses_found",warehouseMap);
	//Fetch All Items
	page_no = 1;
	per_page = 400;
	inventoryItemsApiResponse = zoho.inventory.getRecords("items","65199999",{"page":page_no.toString(),"per_page":per_page.toString()});
	// info inventoryItemsApiResponse;
	items = inventoryItemsApiResponse.get("items");
	//Create item map from existing items to iterate through
	itemMap = Map();
	for each  item in items
	{
		itemStatus = item.get("status");
		itemId = item.get("item_id").toNumber();
		itemBarcode = item.get("cf_barcode");
		itemTotal = item.get("stock_on_hand");
		if(itemStatus == "active" && itemBarcode != null)
		{
			itemMap.put(itemBarcode,itemId);
		}
	}
	logData.put("items_found",itemMap);
	logData.put("subform_rows_found",input.Inventory_Items_to_Scan);
	//Iterate through subrow
	lineItemOutList = List();
	lineItemInList = List();
	logData.put("moving_out_from_value",input.Moving_Out_From);
	logData.put("moving_into_value",input.Moving_Into);
	for each  subRow in input.Inventory_Items_to_Scan
	{
		rowBarcode = subRow.Barcode;
		if(rowBarcode.isEmpty())
		{
			continue;
		}
		rowText = subRow.Inventory_Item;
		if(!rowText.isEmpty())
		{
			rowName = rowText.getPrefix(" |");
		}
		else
		{
			rowName = "";
			continue;
		}
		rowQuantity = subRow.Quantity;
		currentItemId = itemMap.get(rowBarcode);
		info "MI " + input.Moving_Into;
		info "MO " + input.Moving_Out_From;
		// 	info input.Moving_Out_From;
		//If the Moving Out From field in the form isn't blank then there needs to be a negative transfer for that item
		if(input.Moving_Out_From != null && input.Moving_Out_From != "")
		{
			//get warehouse_id and validate 
			warehouseOutId = warehouseMap.get(input.Moving_Out_From);
			if(warehouseOutId != null && warehouseOutId != "" && !warehouseOutId.isEmpty())
			{
				//Line Item Out Map - For items moving out of inventory
				lineItemOutMap = Map();
				lineItemOutMap.put("item_id",currentItemId);
				lineItemOutMap.put("name",rowName);
				lineItemOutMap.put("quantity_adjusted",rowQuantity * -1);
				lineItemOutMap.put("unit","qty");
				lineItemOutMap.put("is_combo_product",false);
				lineItemOutMap.put("adjustment_account_id",889007000009999003);
				lineItemOutMap.put("adjustment_account_name","Cost of Goods Sold");
				lineItemOutMap.put("warehouse_id",warehouseOutId.toNumber());
				lineItemOutList.add(lineItemOutMap);
			}
			else
			{
				logData.put("warehouse_out_error","Warehouse not found: " + input.Moving_Out_From);
			}
		}
		logData.put("line_item_out_list",lineItemOutList);
		if(input.Moving_Into != null && input.Moving_Into != "")
		{
			warehouseInId = warehouseMap.get(input.Moving_Into);
			if(warehouseInId != null && warehouseInId != "" && !warehouseInId.isEmpty())
			{
				////Line Item In Map - For items moving out of inventory
				lineItemInMap = Map();
				lineItemInMap.put("item_id",currentItemId);
				lineItemInMap.put("name",rowName);
				lineItemInMap.put("quantity_adjusted",rowQuantity);
				lineItemInMap.put("unit","qty");
				lineItemInMap.put("is_combo_product",false);
				lineItemInMap.put("adjustment_account_id",889007000000099993);
				lineItemInMap.put("adjustment_account_name","Cost of Goods Sold");
				lineItemInMap.put("warehouse_id",warehouseInId.toNumber());
				lineItemInList.add(lineItemInMap);
			}
			else
			{
				logData.put("warehouse_in_error","Warehouse not found: " + input.Moving_Into);
			}
		}
		logData.put("line_item_in_list",lineItemInList);
	}
	userMap = Map();
	userMap.put("customfield_id",889007000003879991);
	userMap.put("value",invUserId);
	if(siteId != null)
	{
		siteMap = Map();
		siteMap.put("value",siteId);
		siteMap.put("api_name","cf_site");
		siteMap.put("value_formatted",siteName);
	}
	customFieldsList = List();
	customFieldsList.add(userMap);
	if(siteId != null)
	{
		customFieldsList.add(siteMap);
	}
	currentDateTime = zoho.currentdate;
	neededDateTimeString = currentDateTime.toString("yyyy-MM-dd");
	//Adjust Inventory Values Moving Out
	adjustmentsMap = Map();
	adjustmentsMap.put("date",neededDateTimeString);
	adjustmentsMap.put("reason","Inventory Tracking");
	adjustmentsMap.put("adjustment_type","quantity");
	adjustmentsMap.put("line_items",lineItemOutList);
	adjustmentsMap.put("custom_fields",customFieldsList);
	adjustmentsMapString = adjustmentsMap.toString();
	info "adjStr: " + adjustmentsMapString;
	w = input.Distribution_Type != "Recover";
	x = input.Distribution_Type == "To Be Repaired" || input.Distribution_Type == "Asset Conversion";
	y = input.Moving_Out_From == null || input.Moving_Out_From == "";
	z = lineItemOutList.size() > 0;
	if(w && z && !(x && y))
	{
		try 
		{
			updateInvAdjRec = zoho.inventory.createRecord("inventoryadjustments","651560330",adjustmentsMap);
			code = updateInvAdjRec.get("code");
			respMessage = updateInvAdjRec.get("message");
			logData.put("out_adjustment",{"code":code,"message":respMessage});
		}
		catch (e)
		{
			logData.put("output_adjustment_error",e);
		}
	}
	else
	{
		logData.put("output_adjustment_skipped",true);
	}
	//Adjust Inventory Values Moving Into
	adjustmentsMap = Map();
	adjustmentsMap.put("date",neededDateTimeString);
	adjustmentsMap.put("reason","Inventory Tracking");
	adjustmentsMap.put("adjustment_type","quantity");
	info "Line Item In List: " + lineItemInList;
	adjustmentsMap.put("line_items",lineItemInList);
	adjustmentsMap.put("custom_fields",customFieldsList);
	adjustmentsMapString = adjustmentsMap.toString();
	info "adjStr: " + adjustmentsMapString;
	apiHeaderMapOne = Map();
	apiHeaderMapOne.put("Authorization"," Zoho-oauthtoken " + accessToken);
	apiHeaderMapOne.put("Content-Type","application/json");
	w = input.Distribution_Type != "Deliver";
	x = input.Distribution_Type == "To Be Repaired" || input.Distribution_Type == "Asset Conversion";
	y = input.Moving_Into == null || input.Moving_Into == "";
	z = lineItemInList.size() > 0;
	if(w && z && !(x && y))
	{
		updateInvAdjRec = zoho.inventory.createRecord("inventoryadjustments","651560330",adjustmentsMap);
		code = updateInvAdjRec.get("code");
		respMessage = updateInvAdjRec.get("message");
		logData.put("in_adjustment",{"code":code,"message":respMessage});
	}
	else
	{
		logData.put("in_adjustment_skipped",true);
	}
	logData.put("script_end",zoho.currenttime.toString());
	logData.put("status","success");
}
catch (e)
{
	logData.put("status","error");
	logData.put("error_message",e.toString());
	logData.put("error_time",now.toString());
}
logMessage.put("data",logData.toString());
try 
{
	logResponse = invokeurl
	[
		url :"https://unique-subdomain.development.catalystserverless.com/server/writer_log/writerlog/"
		type :POST
		parameters:logMessage.toString()
		content-type:"application/json"
	];
	info logResponse;
}
catch (e)
{
	info "logging error: " + e;
}
