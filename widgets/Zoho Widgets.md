# Zoho CRM Widgets

https://www.zoho.com/crm/developer/docs/widgets/

## Developing CRM Widgets

To set up a CRM widget you need to be proficient in JavaScript, and HTML - you could also use a framework like React but that won't be covered in this document.

### Step 1 - Install Zoho Extension Toolkit (ZET) Command Line Interface (CLI) tools
Make sure you have node and npm installed. You should probably update them too, but ZET will work with some older versions of node. 

for Mac: `sudo npm install -g zoho-extension-toolkit`

for Windows: `system npm install -g zoho-extension-toolkit`

### Step 2 - Navigate to your projects folder
Navigate to your projects folder where you'll save your widget files. You don't need to create a new subdirectory as ZET will do that for you when you initialize the project.

### Step 3 - Initialize the project with ZET

Mac/Windows: `zet init`

select CRM Widget and proceed with configuration settings. When complete the basic widget folder will be created with some subfolders and default files already included. 

Depending on the name you entered for your widget, the root folder will be named accordingly. Inside that widget folder you'll see subfolders:
|_ app              (contains the HTML and JS files for the front-end UI)
|_ server           (contains the JS and other files for the back-end server)
|_ node_modules     (contains the dependencies you install via npm, some preinstalled)
|_ dist             (this folder might not be there YET, contains build .zip file)

### Step 4 - Run your Widget Locally
To develop and test your widget initially, you'll probably want to serve the functionality on your own computer before deploying it to the CRM instance. To do this you'll use the following command:

`zet run`

When you do `zet run`, it will automatically build and deploy your widget live for you on your localhost (127.0.0.1:5000). This means you can go to a browser on your computer and navigate to https://127.0.0.1:5000 and see your app live. You may get a security warning the first time, and you should ignore/allow/dismiss that in order to see your widget.


### Step 5 - Develop your Widget
Now you can update your /server or /app files, and see the live changes at your live URL. Just refresh your page in the browswer to see new changes. 

#### Widget SDK (Software Developers Kit) - Tools for better CRM Widgets

I haven't gone into much detail about pulling data from CRM into your widget, but this is possible via the Widget SDK. Docs are here: https://www.zohocrm.dev/explore/widgets/v1.2. See this link for an extensive list of functions available to enhance your Zoho CRM widgets.

You could edit your widget.html file to add a script like this, which can grab data from CRM:
```
<script src="https://live.zwidgets.com/js-sdk/1.2/ZohoEmbededAppSDK.min.js"></script>
<script> 
    //Subscribe to the EmbeddedApp onPageLoad event before initializing
    ZOHO.embeddedApp.on( "PageLoad", function( data ){
        console.log( data );
        //Custom Business logic goes here
    })
    //Initializing the widget. 
    ZOHO.embeddedApp.init();
</script>
```
The first `<script>` tag loads the Zoho Widget SDK into your browswer, allowing the second script to access critical Zoho Functionality (as if it were a natural extension of JavaScript). 
### Step 6 - Test the Widget Live in CRM
Now you're app is getting better, but you're ready to test it in CRM? Go to CRM -> Settings -> Developer Center -> Widgets -> Create New. 

Type - You need to decide which kind of widget you want to develop based on your specific business needs. See Part 4 of https://www.zoho.com/crm/developer/docs/widgets/#types for more information about the types of CRM widgets. 

#### Widget Types
Dashboard, Web tab, Custom Button, Custom Related List, Wizard, Signal, Settings, Blueprint

#### Configure Local Hosting for Testing
Hosting - in the widget configuration dialogue, set the Hosting to "External" and for the URL enter your local address (https://127.0.0.1:5000/app/widget.html). This will only work if you are live with `zet run` on your local computer, and it will only work for YOU since the IP address 127.0.0.1 is actually a loop-back address. 

Later when you're done developing your widget we will change this setting. For now we will leave it as external, with the local IP address of your hosted app, and let the CRM and browswer route to your local computer to test the widget.

### Step 7 - Pack Your Widget
Once you're done developing / testing your widget, run the following:

`zet validate` - this will make sure your code is acceptable to pack and deploy as a CRM widget.

Then:

`zet pack` - after this is complete, you'll have a .zip file in /dist folder which contains all the files needed by your widget. Don't unzip this yet, as you will upload the entire .zip file into CRM.

### Step 8 - Upload your Widget
Go back to CRM -> Settings -> Developer Space -> Widgets and find the widget you just created. Change the hosting from "External" to "Zoho" and upload your zip file. If the main html file in your widget was in /app/widget.html then set "Index Page" to /widget.html. 

## Errors and Debugging

### SDK Not Loading

My Script is not loading data from CRM
```
ZOHO.embeddedApp.on( "PageLoad", function( data ){
    console.log( data );
    // DATA IS NEVER LOGGED TO THE CONSOLE!
}) 
ZOHO.embeddedApp.init();
```
In this case, you need to check a couple of things. First, make sure you have `<script src="https://live.zwidgets.com/js-sdk/1.2/ZohoEmbededAppSDK.min.js"></script>` linked correctly in your widget html file. Second, make sure your Hosting URL is configured correctly. If you use anything other than https://127.0.0.1:5000/app/widget.html for local testing/development - be careful. 

### Port 5000 Already in Use
Sometimes when I do CRM widgets on my local machine, I get an error that "Port 5000 is already in use." If this happens to you, the best option is to shutdown the other service that's operating on port 5000. Otherwise you'll have to edit the index.js file in the 'server' folder. Open the open /server/index.js and change the variable port from 5000 to another open port (like 3000 or 8080). 

## END

written by Daniel Whiteside - Zoho Developer / Project Manager - whiteside.danielj@gmail.com
