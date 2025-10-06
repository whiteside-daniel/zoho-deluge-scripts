const config = {
    application: {
        zohoTestMode: false
    },
	withPacing: {
		filters: {
			mimeFileType: 'application/zip',
			directory: true,
			directoryContents: {
				fileExtension: '.csv',
				encoding: 'utf8'
			}
		}
	},
	withoutPacing: {
		filters: {
			mimeFileType: 'text/csv',
			directory: false,
			directoryContents: {
				fileExtension: '.csv',
				encoding: 'utf8'
			}
		}
	}
};

const apiMapping = {
	lineItems: {
		standard: {
            map: [
                {
                    csvColName: 'Export Timestamp',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'Line Item Type',
                    zohoApiName: 'Bravo_Line_Item_Type',
                    zFieldType: null
                },
                {
                    csvColName: 'Client Type',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'IO ID',
                    zohoApiName: 'Related_Insertion_Order',
                    zFieldType: null
                },
                {
                    csvColName: 'Purchase Order Number',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'Channel',
                    zohoApiName: 'Channel',
                    zFieldType: null
                },
                {
                    csvColName: 'Tactic',
                    zohoApiName: 'Tactics',
                    zFieldType: null
                },
                {
                    csvColName: 'Start Date',
                    zohoApiName: 'Start_Date',
                    zFieldType: 'Date'
                },
                {
                    csvColName: 'End Date',
                    zohoApiName: 'End_Date',
                    zFieldType: 'Date'
                },
                {
                    csvColName: 'Price',
                    zohoApiName: 'Price',
                    zFieldType: 'Currency'
                },
                {
                    csvColName: 'Targeting Details',
                    zohoApiName: 'Targeting_Details',
                    zFieldType: null
                },
                {
                    csvColName: 'Audience',
                    zohoApiName: 'Audience',
                    zFieldType: null
                },
                {
                    csvColName: 'Geo',
                    zohoApiName: 'Geo',
                    zFieldType: null
                },
                {
                    csvColName: 'Unit Price Type',
                    zohoApiName: 'Unit_Price_Type',
                    zFieldType: null
                },
                {
                    csvColName: 'Unit Price',
                    zohoApiName: 'Unit_Price',
                    zFieldType: 'Currency'
                },
                {
                    csvColName: 'Estimated Units',
                    zohoApiName: 'Estimated_Units',
                    zFieldType: 'Number'
                },
                {
                    csvColName: 'Agency Markup Rate',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'Gross Price',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'Gross Unit Price',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'Estimated Unit Cost',
                    zohoApiName: null,
                    zFieldType: 'Currency'
                },
                {
                    csvColName: 'Ad Size',
                    zohoApiName: 'Ad_Size',
                    zFieldType: null
                },
                {
                    csvColName: 'Campaign Number',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'Bravo Media Strategy Id',
                    zohoApiName: 'Bravo_Media_Strategy_ID',
                    zFieldType: null
                },
                {
                    csvColName: 'Bravo Line Item Id',
                    zohoApiName: 'Bravo_Line_Item_ID',
                    zFieldType: null
                },
                {
                    csvColName: 'Bravo Changeset Id',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'Pacing Type',
                    zohoApiName: 'Pacing_Type',
                    zFieldType: null
                }
            ],
            staticFields: [
                {
                    'Field_Name' : 'Value'
                }
            ]
        },
		referral_partner: {
            map: [
                {
                    csvColName: 'Export Timestamp',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'Line Item Type',
                    zohoApiName: 'Bravo_Line_Item_Type',
                    zFieldType: null
                },
                {
                    csvColName: 'Client Type',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'IO ID',
                    zohoApiName: 'Related_Insertion_Order',
                    zFieldType: null
                },
                {
                    csvColName: 'Purchase Order Number',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'Channel',
                    zohoApiName: 'Channel',
                    zFieldType: null
                },
                {
                    csvColName: 'Tactic',
                    zohoApiName: 'Tactics',
                    zFieldType: null
                },
                {
                    csvColName: 'Start Date',
                    zohoApiName: 'Start_Date',
                    zFieldType: 'Date'
                },
                {
                    csvColName: 'End Date',
                    zohoApiName: 'End_Date',
                    zFieldType: 'Date'
                },
                {
                    csvColName: 'Price',
                    zohoApiName: 'Gross_Budget',
                    zFieldType: 'Currency'
                },
                {
                    csvColName: 'Targeting Details',
                    zohoApiName: 'Targeting_Details',
                    zFieldType: null
                },
                {
                    csvColName: 'Audience',
                    zohoApiName: 'Audience',
                    zFieldType: null
                },
                {
                    csvColName: 'Geo',
                    zohoApiName: 'Geo',
                    zFieldType: null
                },
                {
                    csvColName: 'Unit Price Type',
                    zohoApiName: 'Unit_Price_Type',
                    zFieldType: null
                },
                {
                    csvColName: 'Unit Price',
                    zohoApiName: 'Gross_Unit_Price',
                    zFieldType: 'Currency'
                },
                {
                    csvColName: 'Estimated Units',
                    zohoApiName: 'Estimated_Units',
                    zFieldType: 'Number'
                },
                {
                    csvColName: 'Agency Markup Rate',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'Gross Price',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'Gross Unit Price',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'Estimated Unit Cost',
                    zohoApiName: null,
                    zFieldType: 'Currency'
                },
                {
                    csvColName: 'Ad Size',
                    zohoApiName: 'Ad_Size',
                    zFieldType: null
                },
                {
                    csvColName: 'Campaign Number',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'Bravo Media Strategy Id',
                    zohoApiName: 'Bravo_Media_Strategy_ID',
                    zFieldType: null
                },
                {
                    csvColName: 'Bravo Line Item Id',
                    zohoApiName: 'Bravo_Line_Item_ID',
                    zFieldType: null
                },
                {
                    csvColName: 'Bravo Changeset Id',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'Pacing Type',
                    zohoApiName: 'Pacing_Type',
                    zFieldType: null
                }
            ],
            staticFields: [
                {
                    "Field_Name" : 'Value'
                }
            ]
            
        },
		agency_markup: {
            map: [
                {
                    csvColName: 'Export Timestamp',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'Line Item Type',
                    zohoApiName: 'Bravo_Line_Item_Type',
                    zFieldType: null
                },
                {
                    csvColName: 'Client Type',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'IO ID',
                    zohoApiName: 'Related_Insertion_Order',
                    zFieldType: null
                },
                {
                    csvColName: 'Purchase Order Number',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'Channel',
                    zohoApiName: 'Channel',
                    zFieldType: null
                },
                {
                    csvColName: 'Tactic',
                    zohoApiName: 'Tactics',
                    zFieldType: null
                },
                {
                    csvColName: 'Start Date',
                    zohoApiName: 'Start_Date',
                    zFieldType: null
                },
                {
                    csvColName: 'End Date',
                    zohoApiName: 'End_Date',
                    zFieldType: null
                },
                {
                    csvColName: 'Price',
                    zohoApiName: 'Price',
                    zFieldType: null
                },
                {
                    csvColName: 'Targeting Details',
                    zohoApiName: 'Targeting_Details',
                    zFieldType: null
                },
                {
                    csvColName: 'Audience',
                    zohoApiName: 'Audience',
                    zFieldType: null
                },
                {
                    csvColName: 'Geo',
                    zohoApiName: 'Geo',
                    zFieldType: null
                },
                {
                    csvColName: 'Unit Price Type',
                    zohoApiName: 'Unit_Price_Type',
                    zFieldType: null
                },
                {
                    csvColName: 'Unit Price',
                    zohoApiName: 'Unit_Price',
                    zFieldType: 'Currency'
                },
                {
                    csvColName: 'Estimated Units',
                    zohoApiName: 'Estimated_Units',
                    zFieldType: Number
                },
                {
                    csvColName: 'Agency Markup Rate',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'Gross Price',
                    zohoApiName: 'Gross_Budget',
                    zFieldType: 'Currency'
                },
                {
                    csvColName: 'Gross Unit Price',
                    zohoApiName: 'Gross_Unit_Price',
                    zFieldType: 'Currency'
                },
                {
                    csvColName: 'Estimated Unit Cost',
                    zohoApiName: null,
                    zFieldType: 'Currency'
                },
                {
                    csvColName: 'Ad Size',
                    zohoApiName: 'Ad_Size',
                    zFieldType: null
                },
                {
                    csvColName: 'Campaign Number',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'Bravo Media Strategy Id',
                    zohoApiName: 'Bravo_Media_Strategy_ID',
                    zFieldType: null
                },
                {
                    csvColName: 'Bravo Line Item Id',
                    zohoApiName: 'Bravo_Line_Item_ID',
                    zFieldType: null
                },
                {
                    csvColName: 'Bravo Changeset Id',
                    zohoApiName: null,
                    zFieldType: null
                },
                {
                    csvColName: 'Pacing Type',
                    zohoApiName: 'Pacing_Type',
                    zFieldType: null
                }
            ],
            staticFields: [
                {
                'Field_Name' : 'Value'
                }
            ]
        }
	},
	pacingSchedule: [
		{
			csvColName: 'Bravo Media Strategy Id',
			zohoApiName: null
		},
		{
			csvColName: 'Bravo Line Item Id',
			zohoApiName: 'Bravo_Line_Item_ID'
		},
		{
			csvColName: 'IO ID',
			zohoApiName: 'Associated_Insertion_Order'
		},
		{
			csvColName: 'Start Date',
			zohoApiName: 'Start_Date'
		},
		{
			csvColName: 'End Date',
			zohoApiName: 'End_Date'
		},
		{
			csvColName: 'Price',
			zohoApiName: 'Amount'
		}
	]
};

module.exports = {
    apiMapping,
    config
};