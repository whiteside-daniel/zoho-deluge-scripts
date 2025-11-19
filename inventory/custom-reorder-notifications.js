//This is a Zoho Deluge function intended to provide custom restock notifications for items that are low stock in a particular warehouse. The way Zoho Inventory currently offers restock notifications is for the global quantity, but if stock is low at one warehouse you won't be notified. THis script fixes that.
//You need to have custom fields on your items called ABC Restock Quantity, DEF Restock Quaitity... and so on. Paste the warehouse Ids and the restock custom field IDs below.
//When stock of a given item at warehouse ABC drops below the threshold set by ABC Restock Quantity - you'll get a notification
//You won't get notified if a Purchase Order or Transfer order has been submitted for that item/warehouse combo in the last 4 days
//You also need a connection called "zohoinventory" with scopes to read/write from Items, POs, Warehouses, and Transfer Orders

//SETTING TEST MODE == TRUE WILL NOT SEND THE EMAIL AND ONLY LOG OUTPUTS OF THE FUNCTION
testMode = false;
//APP VARIABLES
daysToCheck = 42;
//6 weeks
organizationId = organization.get("organization_id");
connectionString = "zohoinventory";
warehouseList = list();
warehouseList.add({"id":"889007000002572020","name":"ABC","customFieldId":"889007000005584003","notify":"daniel@gmail.com"});
warehouseList.add({"id":"889007000003173025","name":"DEF","customFieldId":"889007000005584033","notify":{"daniel@gmail.com","jim@internet.com"}});
warehouseList.add({"id":"889007000003173001","name":"GHI","customFieldId":"889007000005584021","notify":"daniel@gmail.com"});
warehouseList.add({"id":"889007000003163922","name":"JKL","customFieldId":"889007000005584015","notify":"jim@internet.com"});
warehouseList.add({"id":"889007000003163898","name":"MNO","customFieldId":"889007000005584009","notify":"jim@internet.com"});
warehouseList.add({"id":"889007000002572184","name":"TUV","customFieldId":"889007000005584027","notify":"jim@internet.com"});
response = Map();
response.put("functionTriggered",now);

//This script should check the quantity available of all items at each warehouse. For any item which is below the threshold of a reorder quanitity, add that item detail to a list. When the check is complete - send an email with items which are low stock. 
//CHECK FOR WAREHOUSE TRANSFER OR PURCHASE ORDER HAS BEEN SUBMITTED
// //WH TRANSFER
transferUrl = "https://www.zohoapis.com/inventory/v1/transferorders?per_page=200&organization_id=" + organizationId;
whtResponse = invokeurl
[
	url :transferUrl
	type :GET
	connection:"zohoinventory"
];
whtData = whtResponse.get("transfer_orders");
whtList = list();
for each  wh in whtData
{
	//info wh;
	whtId = wh.get("transfer_order_id");
	whtDate = wh.get("date").toDate();
	whtInTransit = wh.get("is_intransit_order");
	if(whtDate > today.subDay(daysToCheck) && whtInTransit == true)
	{
		resp = zoho.inventory.getRecordsByID("transferorders",organizationId,whtId,"zohoinventory");
		items = resp.get("transfer_order").get("line_items");
		itemList = list();
		for each  item in items
		{
			itemId = item.get("item_id");
			itemList.add({"item_id":itemId});
		}
		whtList.add({"id":resp.get("transfer_order").get("transfer_order_id"),"items":itemList,"from_warehouse":resp.get("transfer_order").get("from_warehouse_id"),"to_warehouse":resp.get("transfer_order").get("to_warehouse_id"),"date":whtDate});
	}
}
//PO
poStatuses = {"issued","partially_received"};
poUrl = "https://www.zohoapis.com/inventory/v1/purchaseorders?organization_id=" + organizationId;
poResponse = invokeurl
[
	url :poUrl
	type :GET
	connection:"zohoinventory"
];
//info poResponse;
poData = poResponse.get("purchaseorders");
poList = list();
for each  po in poData
{
	//info po;
	poId = po.get("purchaseorder_id");
	poDate = po.get("date").toDate();
	//info({"date": poDate, "id": poId});
	poStatus = po.get("status");
	if(poDate > today.subDay(daysToCheck) && poDate <= today && poStatuses.contains(poStatus))
	{
		resp = zoho.inventory.getRecordsByID("purchaseorders",organizationId,poId,"zohoinventory");
		//info resp;
		items = resp.get("purchaseorder").get("line_items");
		itemList = list();
		for each  item in items
		{
			itemId = item.get("item_id");
			whId = item.get("warehouse_id");
			itemList.add({"item_id":itemId,"warehouse_id":whId});
		}
		poList.add({"id":poId,"date":poDate,"items":itemList});
	}
}
// //STEP 2 - COMPILE LIST OF ALL ITEMS
itemsResponse = invokeurl
[
	url :"https://www.zohoapis.com/inventory/v1/items"
	type :GET
	connection:"zohoinventory"
];
//info itemsResponse;
items = itemsResponse.get("items");
reorderList = list();
for each  item in items
{
	itemResponse = Map();
	reorderWarehouses = list();
	sendEmail = false;
	itemId = item.get("item_id");
	itemSku = item.get("sku");
	isComboProduct = item.getJSON("is_combo_product");
	itemResponse.put("id",itemId);
	itemResponse.put("sku",itemSku);
	if(!isComboProduct)
	{
		itemDetailURL = "https://www.zohoapis.com/inventory/v1/items/" + itemId;
		itemDetailResponse = invokeurl
		[
			url :itemDetailURL
			type :GET
			connection:"zohoinventory"
		];
		itemName = itemDetailResponse.get("item").get("name");
		customFieldsData = itemDetailResponse.get("item").get("custom_fields");
		itemWarehouseData = itemDetailResponse.get("item").get("warehouses");
		for each  warehouse in itemWarehouseData
		{
			itemWarehouseId = warehouse.get("warehouse_id");
			qtyInStock = warehouse.get("warehouse_stock_on_hand");
			// Find this specific warehouse in our list
			foundWarehouse = false;
			whName = "";
			whNotify = "";
			customFieldId = "";
			for each  whl in warehouseList
			{
				if(whl.get("id") == itemWarehouseId)
				{
					foundWarehouse = true;
					whName = whl.get("name");
					whNotify = whl.get("notify");
					customFieldId = whl.get("customFieldId");
				}
			}
			// Only process if we found a match
			if(foundWarehouse)
			{
				reorderThreshold = 0;
				reorder = false;
				// Find custom field value
				for each  cfd in customFieldsData
				{
					if(cfd.get("field_id") == customFieldId)
					{
						reorderThreshold = toNumber(cfd.get("value_formatted"));
						if(qtyInStock <= reorderThreshold)
						{
							reorder = true;
							sendEmail = true;
						}
					}
				}
				// Add warehouse data once
				reorderWarehouses.add({"warehouse":whName,"below_threshold":reorder,"reorder_threshold":reorderThreshold,"qty_in_stock":qtyInStock,"notify":whNotify,"reorder":reorder});
			}
		}
		itemResponse.put("warehouses",reorderWarehouses);
		// Check if any warehouse needs reordering
		for each  wh in reorderWarehouses
		{
			if(wh.get("reorder"))
			{
				itemResponse.put("reorder",true);
			}
		}
		reorderList.add(itemResponse);
	}
}
info reorderList;
//STEP 3 - NOW CHECK IF ANY ITEMS HAVE PO OR TO
//DATA IN reorderList - if warehouses not empty then quantity below stock
try 
{
	info "Checking for existing POs and Transfers...";
	finalReorderList = list();
	for each  item in reorderList
	{
		itemId = item.get("id");
		itemWarehouses = item.get("warehouses");
		itemReorderCheck = item.get("reorder");
		// Only process items that have warehouses below threshold
		if(itemWarehouses.size() > 0 && itemReorderCheck == true)
		{
			// Create a modified warehouse list for this item
			modifiedWarehouses = list();
			itemStillNeedsReorder = false;
			for each  itwh in itemWarehouses
			{
				warehouseName = itwh.get("warehouse");
				needsReorder = itwh.get("reorder");
				warehouseStillNeedsReorder = needsReorder;
				if(needsReorder)
				{
					// Find the warehouse ID for this warehouse name
					warehouseId = "";
					for each  wh in warehouseList
					{
						if(wh.get("name") == warehouseName)
						{
							warehouseId = wh.get("id");
							break;
						}
					}
					// Check if this item has a recent transfer TO this warehouse
					for each  wht in whtList
					{
						if(wht.get("to_warehouse") == warehouseId)
						{
							whtItems = wht.get("items");
							for each  whtItem in whtItems
							{
								if(whtItem.get("item_id") == itemId)
								{
									info "Found WHT for item " + itemId + " to warehouse " + warehouseName;
									warehouseStillNeedsReorder = false;
									break;
								}
							}
						}
					}
					// If no transfer found, check for purchase orders
					if(warehouseStillNeedsReorder)
					{
						for each  po in poList
						{
							poItems = po.get("items");
							for each  poItem in poItems
							{
								if(poItem.get("item_id") == itemId && poItem.get("warehouse_id") == warehouseId)
								{
									info "Found PO for item " + itemId + " for warehouse " + warehouseName;
									warehouseStillNeedsReorder = false;
									break;
								}
							}
							if(!warehouseStillNeedsReorder)
							{
								break;
							}
						}
					}
				}
				// Update the warehouse reorder status
				modifiedWarehouse = Map();
				modifiedWarehouse.put("warehouse",itwh.get("warehouse"));
				modifiedWarehouse.put("below_threshold",itwh.get("below_threshold"));
				modifiedWarehouse.put("reorder_threshold",itwh.get("reorder_threshold"));
				modifiedWarehouse.put("qty_in_stock",itwh.get("qty_in_stock"));
				modifiedWarehouse.put("notify",itwh.get("notify"));
				modifiedWarehouse.put("reorder",warehouseStillNeedsReorder);
				modifiedWarehouse.put("covered_by_recent_order",!warehouseStillNeedsReorder && needsReorder);
				modifiedWarehouses.add(modifiedWarehouse);
				// If any warehouse still needs reorder, flag the item
				if(warehouseStillNeedsReorder)
				{
					itemStillNeedsReorder = true;
				}
			}
			// Update the item with modified warehouse information
			item.put("warehouses",modifiedWarehouses);
			item.put("reorder",itemStillNeedsReorder);
			// Only add to final list if item still needs reordering
			if(itemStillNeedsReorder)
			{
				finalReorderList.add(item);
				info "Item " + itemId + " still needs reordering";
			}
		}
	}
	info "Total items requiring reorder: " + finalReorderList.size();
	// STEP 4 - SEND NOTIFICATION EMAILS
	if(finalReorderList.size() > 0)
	{
		// Group items by notification email
		notificationGroups = Map();
		for each  item in finalReorderList
		{
			// Get item details for email
			itemDetailURL = "https://www.zohoapis.com/inventory/v1/items/" + item.get("id");
			itemDetailResponse = invokeurl
			[
				url :itemDetailURL
				type :GET
				connection:"zohoinventory"
			];
			itemName = itemDetailResponse.get("item").get("name");
			itemWarehouses = item.get("warehouses");
			for each  wh in itemWarehouses
			{
				if(wh.get("reorder") == true)
				{
					notifyEmails = wh.get("notify");
					// Handle both single email (string) and multiple emails (list)
					emailList = notifyEmails;
					// Process each email in the list
					for each  notifyEmail in emailList
					{
						// Check if email already exists in map
						if(!notificationGroups.containKey(notifyEmail))
						{
							// Create new list for this email
							emailItemsList = list();
							notificationGroups.put(notifyEmail,emailItemsList);
						}
						// Get the existing list
						existingList = notificationGroups.get(notifyEmail);
						// Create item info
						itemInfo = Map();
						itemInfo.put("item_id",item.get("id"));
						itemInfo.put("sku",item.get("sku"));
						itemInfo.put("item_name",itemName);
						itemInfo.put("warehouse",wh.get("warehouse"));
						itemInfo.put("qty_in_stock",wh.get("qty_in_stock"));
						itemInfo.put("reorder_threshold",wh.get("reorder_threshold"));
						// Add to list
						existingList.add(itemInfo);
						// Put the updated list back
						notificationGroups.put(notifyEmail,existingList);
					}
				}
			}
		}
		// Send emails to each notification group
		for each  email in notificationGroups.keys()
		{
			items = notificationGroups.get(email);
			// Build email content
			emailBody = "<h3>Low Stock Alert - " + today + "</h3>";
			emailBody = emailBody + "<p>The following items are below reorder threshold:</p>";
			emailBody = emailBody + "<table border='1' cellpadding='5'>";
			emailBody = emailBody + "<tr><th>Item Name</th><th>Barcode</th><th>Warehouse</th><th>Current Stock</th><th>Reorder Threshold</th></tr>";
			for each  item in items
			{
				emailBody = emailBody + "<tr>";
				emailBody = emailBody + "<td>" + item.get("item_name") + "</td>";
				emailBody = emailBody + "<td>" + item.get("sku") + "</td>";
				emailBody = emailBody + "<td>" + item.get("warehouse") + "</td>";
				emailBody = emailBody + "<td>" + item.get("qty_in_stock") + "</td>";
				emailBody = emailBody + "<td>" + item.get("reorder_threshold") + "</td>";
				emailBody = emailBody + "</tr>";
			}
			emailBody = emailBody + "</table>";
			// Send email - uncomment when ready
			if(testMode)
			{
				info "Email would be sent to: " + email;
			}
			else
			{
				sendmail
				[
					from :zoho.adminuserid
					to :email
					subject :"Low Stock Alert - " + today
					message :emailBody
				]
				info "Email was sent to: " + email;
			}
			info emailBody;
		}
	}
	else
	{
		info "No items need reordering after checking recent POs and Transfers";
	}
	response.put("items_requiring_reorder",finalReorderList);
	response.put("total_items_to_reorder",finalReorderList.size());
}
catch (e)
{
	info "Error in Step 3: " + e;
	response.put("error",e.toString());
}
response.put("completed",now);

