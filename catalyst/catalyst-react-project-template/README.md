    Sample React application in AppSail

Catalyst AppSail is a Platform-as-a-Service(PaaS) feature of Catalyst that helps you host your Standalone applications in Catalyst. You can find the help documentation for Catalyst AppSail [here](https://docs.catalyst.zoho.com/en/serverless/help/appsail/introduction/).

You can use Catalyst AppSail to host your React application in Catalyst. Please find the instructions on how to host a Sample React application in Catalyst using Catalyst AppSail below:

**Pre-requisites:**

1. Create a Catalyst project in the Catalyst Console. You can find help documentation for creating a Catalyst Project [here](https://docs.catalyst.zoho.com/en/getting-started/catalyst-projects/#create-a-catalyst-project). Kindly follow the instructions mentioned in the above help document to create a project in your catalyst console.
2. Install Catalyst CLI on your local machine. To access your Catalyst project in your local machine you need to install our Catalyst CLI by using the below command in your terminal.

In the case of MacOS or Linux, run the below with the **sudo**

``sudo npm install -g zcatalyst-cli@latest``

In the case of Windows, run the below command in your Command prompt Administrator mode.

``npm install -g zcatalyst-cli@latest``

You can find the help documentation for installing Catalyst CLI [here](https://docs.catalyst.zoho.com/en/getting-started/installing-catalyst-cli/). The above command will install Catalyst CLI on your local machine. Now run the command ``catalyst -v``to check whether the CLI has been installed properly. If installed properly, the above command should list the version number which has been installed.

3. Now, run the below command to log in to the Catalyst CLI. You can find the help documentation for Catalyst login [here](https://docs.catalyst.zoho.com/en/cli/v1/login/login-from-cli/).

``catalyst login``

**Steps for application setup:**

//If you face any file permission-related errors while running the below commands in Windows, run the commands in your command prompt Administrator mode.

1. Create a new folder on your local machine. Navigate to the created folder and Initialize a Catalyst project by running the below command

``catalyst init``

Select your project and then press Enter without selecting any options. A file named **catalyst.json** will be created. (Let's call it as your project directory)

2. Create a new folder named React in the project directory where your catalyst.json file is present. Initialize an AppSail service by navigating to your React folder by running the below command

``catalyst appsail:add``

//CLI output for reference:

```
Do you want to initialize an AppSail service in this directory? Yes
=> Configure AppSail service
Please provide the build path of your AppSail service:  {Your project directory}/React
Please provide the name for your AppSail service:  React
Please choose a stack for your AppSail:  NodeJS 18
ℹ catalyst.json file has been successfully updated with functions details.
✔ AppSail service successfully linked
```

3. From the Appsail directory({Your project directory}/React/), initialize a new React app by using the below command. Enter the defaults.

``npx create-react-app client``

A folder named **client** will be created. Run the command npm run dev inside the client folder to check whether the project is getting served in localhost without any errors. Once your project is running error-free, you can proceed to step 4.

4. From the Appsail directory({Your project directory}/React/), Create a folder named **server**. Navigate to your server folder and then run the below commands to initialize a node server endpoint.

``npm init``

Enter the defaults. This will create a package.json file in the server folder.

5. Run the below commands to install the required node modules.

``npm install express``

``npm install path``

node_modules folder will be created under the server folder.

6. Create a new file named **index.js** and paste the below contents. This will act as a proxy server to serve your compiled react client files.

You should listen to the port configured by Catalyst via the environment variable 'X_ZOHO_CATALYST_LISTEN_PORT;

```
'use strict'
const express = require('express')
const path = require('path')
const app = express()
const appDir = path.join(__dirname, '../client')
const port = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000;
 
app.get('/', function (req, res) {
  res.sendFile(path.join(appDir, 'index.html'))
})
 
app.use(express.static(appDir));
 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
}); 
```

7. Create a folder named **scripts** in the AppSail directory. Create a file named **filesHelper.js** inside the scripts folder. This file can be used to copy the files from the server and client to the Appsail build path. Copy the below code and paste it into filesHelper.js

```const
const Path = require('path');
const { promisify } = require('util');

const readdir = promisify(Fs.readdir);
const stat = promisify(Fs.stat);
const copyFile = promisify(Fs.copyFile);
const mkdir = promisify(Fs.mkdir)
const unlink = promisify(Fs.unlink)
const rmdir = promisify(Fs.rmdir)

if (process.argv.length < 4) {
  console.error('Usage: node copyAndDelete.js [-c|-d] <sourcePath> <destinationPath>');
  process.exit(1);
}
const operation = process.argv[2];
if (operation !== '-c' && operation !== '-d') {
  console.error('Invalid operation. Use -c for copy or -d for delete.');
  process.exit(1);
}

if (operation === '-c') {
const sourcePath = Path.resolve(process.argv[3]);
const destinationPath = Path.resolve(process.argv[4]);
  copyFolders(sourcePath, destinationPath)
    .then(() => {
      console.log('Copy completed successfully.');
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
    });
} else if (operation === '-d') {
  const sourcePath = Path.resolve(process.argv[3]);
  deleteFolder(sourcePath)
    .then(() => {
      console.log('Delete completed successfully.');
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
    });
}

async function copyFolders(source, destination) {
  try {
    await mkdir(destination, { recursive: true });
    const files = await readdir(source);
    for (const file of files) {
      const sourceFilePath = Path.join(source, file);
      const destFilePath = Path.join(destination, file);
      const fileStat = await stat(sourceFilePath);

      if (fileStat.isDirectory()) {
        await copyFolders(sourceFilePath, destFilePath);
      } else {
        await copyFile(sourceFilePath, destFilePath);
      }
    }
  } catch (err) {
    throw err;
  }
}

async function deleteFolder(destinationPath) {
  try {
    const files = await readdir(destinationPath);

    for (const file of files) {
      const filePath = Path.join(destinationPath, file);
      const fileStat = await stat(filePath);
      if (fileStat.isDirectory()) {
        await deleteFolder(filePath);
      } else {
        await unlink(filePath);
      }
    }
    await rmdir(destinationPath);
  } catch (err) {
    throw err;
  }
}
```

8. Navigate to app-config.json in your AppSail directory and update the buildPath and scripts like the config below

```{
    "command": "node ./server/index.js",
    "buildPath": "/Users/catalyst-solutions/Documents/AppsailSolutions/React/build",
    "stack": "node18”,
    "env_variables": {},
    "memory": 256,
        "scripts": {
            "preserve": "cd client && npm run build && cd .. && node ./scripts/filesHelper.js -c ./server/ ./build/server/  && node ./scripts/filesHelper.js -c ./client/build/ ./build/client/",
            "postserve": "node ./scripts/filesHelper.js -d ./build/server &&  node ./scripts/filesHelper.js -d ./build/client",
            "predeploy": "cd client && npm run build && cd .. && node ./scripts/filesHelper.js -c ./server/ ./build/server/  && node ./scripts/filesHelper.js -c ./client/build/ ./build/client/",
            "postdeploy": "node ./scripts/filesHelper.js -d ./build/server &&  node ./scripts/filesHelper.js -d ./build/client"
        }
}
```

9. Navigate back to the project directory and run the below command in order to test your application in local.

``catalyst serve``

A folder named build will be created and all the compiled files of the react client and the server folder will be copied to the build folder and then served in localhost. Your appsail service will be served in localhost:3001

10. Once you have tested your appsail locally, you can then deploy your AppSail service to the development environment by running the command below

``catalyst deploy``

A folder named build will be created and all the compiled files of the react client and the server folder will be copied to the build folder and then the build folder is deployed to the Console. Only the files inside the build folder will be deployed and you need to maintain your source code files in Github for later use.
