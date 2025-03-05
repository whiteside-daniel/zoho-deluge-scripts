# CRM Widgets

## CRM Widgets

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

Note: the first time I did this on my local computer I got an error that "Port 5000 is already in use." If this happens to you, you'll have to edit the index.js file in the 'server' folder. Open the open /server/index.js and change the variable port from 5000 to another open port (like 3000 or 8080). 

### Step 5 - Develop your Widget
Now you can update your /server or /app files, and see the live changes at your live URL. Just refresh your page in the browswer to see new changes. 

### Step 6 - Test the Widget Live in CRM
Now you're app is getting better, but you're ready to test it in CRM? Go to CRM -> Settings -> Developer Center -> Widgets -> Create New. 

Type - You need to decide which kind of widget you want to develop based on your specific business needs. See Part 4 of https://www.zoho.com/crm/developer/docs/widgets/ for more information about the types of CRM widgets. 

#### Configure Local Hosting for Testing
Hosting - set it to "External" and for the URL enter your local address (https://127.0.0.1:5000). This will only work if you are live with `zet run` on your local computer, and it will only work for YOU since the IP address 127.0.0.1 is actually a loop-back address. 

Later when you're done developing your widget we will change this setting. For now we will leave it as external, with the local IP address of your hosted app, and let the CRM and browswer route to your local computer to test the widget.

### Step 7 - Pack Your Widget
Once you're done developing / testing your widget, run the following:

`zet validate` - this will make sure your code is acceptable to pack and deploy as a CRM widget.

Then:

`zet pack` - after this is complete, you'll have a .zip file in /dist folder which contains all the files needed by your widget. Don't unzip this yet, as you will upload the entire .zip file into CRM.

### Step 8 - Upload your Widget
Go back to CRM -> Settings -> Developer Space -> Widgets and find the widget you just created. Change the hosting from "External" to "Zoho" and upload your zip file. If the main html file in your widget was in /app/widget.html then set "Index Page" to widget.html. Else, append the subfolder like this: /folder/rootIndex.html

## END

written by Daniel Whiteside, daniel.w@zohocorp.com or whiteside.danielj@gmail.com