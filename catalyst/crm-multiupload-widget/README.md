# CRM Widget and Catalyst Function as Client Script Command

This project can be used as a template for a widget embedded in Zoho CRM where the server functions are performed by Zoho Catalyst. This widget extends the ordinary ZohoCRM upload functionality so that the "Unit Price" and "Price" fields of the csv data are imported to different CRM fields based on user selections in the widget. 

Use Case: business has an external tool for processing business logic for marketing campaigns. In order to import into CRM correctly, the Price and Unit Price fields of the data need to get imported as Gross pricing in some cases and Net pricing in other cases. This widget allows the user to select the import mapping, choose a csv or zip file, and then upload to CRM. The widget is embedded as a Client Script Command.
## Setup

For the backend of this project. 