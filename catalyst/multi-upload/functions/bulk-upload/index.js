//CONFIG AND IMPORT... CONFIG AND IMPORT...
'use strict';
//get os for discovering tmp directory
//const os = require('os');
//let tmpDir = os.tmpdir();
//console.log(tmpDir);
//
//dotenv for environment variables
const dotenv = require('dotenv').config();
//
//express setup for accepting POST/GET server requests
const express = require('express');
const app = express();
app.use(express.json());
//
//multer for grabbing the files from the HTML form
const multer = require('multer');
//multer options
const upload = multer({ dest : '/tmp/' , limits: { files : 	400 , fileSize: 1024*1024} });

//fs and form-data for turning the file into a readable stream
const fs = require('fs');
const FormData = require('form-data');

//axios for API calls
const axios = require('axios');




//APP CONSTANTS...APP CONTSANTS... APP CONSTANTS

//separator character to parse the pdf filenames, default is n-dash
const parsingString = "-";
//set a delay time for API limitations, in miliseconds(ms). 100ms is recommended for zPeople database
const delayTime = 100;
//port number, DO NOT CHANGE THIS
const port = 8080;
//access token URL, be very careful here and check ./.env for environment variables
const accessTokenURL = `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`;




//
//FUNCTIONS...FUNCTIONS...FUNCTIONS
//

//Error handler for multer plugin error when file is too large etc (line 19)
const ErrorHandler = (err, req, res, next) => {
    console.log("Middleware Error Hadnling");
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    })
}
//this needs to be the last app.use statement in this code
app.use(ErrorHandler);


//OPEN AND CLOSE A FILE... BUSYWORK
async function openClose() {
    return new Promise((resolve, reject) => {
        const fileHandle = fs.open('/tmp/bulk-upload-log.txt', 'r', (err, fd) => {
            console.log('opened');
            fs.close(fd, (err) => {
                resolve();
            });
        });
        
    });
}


//LOG MESSAGES - log filedata to the log file
async function logFileMessage(message) {
    return new Promise((resolve, reject) => {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message}\n`;
        fs.appendFile('/tmp/bulk-upload-log.txt', logEntry, (err) => {
            if(err) throw err;
            console.log('data appended successfully.');
            resolve('appended');
        });
    })
}


//PROCESS ARRAY
//async function which processes an entire array by "waiting" for each of the elements one-by-one
//otherwise JS would try to run each iteration of the loop multi-thread and would easily burn out the API limits
async function processArray(array, authHeader) {
//    fs.open('/tmp/bulk-upload-log.txt', 'w', (err, f) => {
//        console.log('opened');
//    });
//    for (const item of array) {
//        await processFile(item, authHeader);
//    }
    return new Promise((resolve, reject) => {
        let promiseArray = [];
        for(const item of array) {
            promiseArray.push(processFile(item, authHeader));
        }
        setTimeout(() => {
            Promise.all(promiseArray)
            .then(() => {
                resolve('processed');
            })
            .catch();
            
        }, 1000);
    });
}

//PROCESS FILE
//async function which processes elements of an array
async function processFile(file, authHeader) {
  // Simulating an asynchronous operation
  return new Promise(resolve => {
    setTimeout(() => {
        //what to do with each file
		//console.log(file);
		//check file type for pdf
		const fileType = file.mimetype;
		const fileName = file.originalname;
		//console.log(newFile);
		if(fileType === 'application/pdf') {
			//console.log(file);
			const filePath = file.path;
			//parse pdf file name
			const fileNameParts = fileName.split(parsingString);
			const employeeID = fileNameParts[0];
            const employeeSSN = fileNameParts[1];
            const employeeLastName = fileNameParts[2];
            const employeeFirstName = fileNameParts[3];
			console.log("trying to upload " + fileNameParts);
			//then make your actual API call here
			//checking if employee ID exists in zPeople (or CRM)
			//const criteria = `External_ID:equals:${employeeID}`;
			const peopleURL = `https://people.zoho.com/people/api/forms/employee/getRecords?searchParams={searchField: 'Alpha_ID',searchOperator:'Is',searchText:'${employeeID}'}AND{searchField: 'Last_Name',searchOperator:'Is',searchText:'${employeeLastName}'}AND{searchField: 'First_Name',searchOperator:'Is',searchText:'${employeeFirstName}'}`;
			const realPeopleURL = encodeURI(peopleURL);
			console.log("trying URL " + realPeopleURL);
			//GET request to People
			axios.get(realPeopleURL ,{headers: {'Authorization' : authHeader }})
			.then(getResponse => {
                //console.log(getResponse);
                const responseStatus = getResponse.data.response.status;
                if(responseStatus == 1){
                    logFileMessage('FAILURE - ' + fileName + ' No employee record found matching that description in Zoho People database')
                    .then(() => {
                        console.log(getResponse.data.response.errors);
                        if(getResponse.data.response.errors.code == 7024) {
                            //console.log('No employee record found matching that description in Zoho People database');
                        }
                    })
                    .catch();
                }
                else{
                    const peopleJSON = getResponse.data.response.result[0];
                    const peopleId = Object.keys(peopleJSON)[0];
                    //get some more required info from the employee record
                    if(peopleId != null){
                        console.log(peopleId);
                        //console.log(peopleJSON);
                        const roleID = peopleJSON[peopleId][0]["Role.ID"];
                        //console.log(roleID);
    //                    const getFileCategoriesURL = https://people.zoho.com/people/api/files/getCategories`;
    //                    axios.get(getFileCategoriesURL ,{headers: {'Authorization' : authHeader }})
    //			         .then(getResponse => {console.log(getResponse.data.response.result)})
    //                     .catch(error => {console.log(error);})
                        const categoryID = "835993000000270241";
                        //now we have People ID of Employee, time to upload and attach file
                        const uploadURL = `https://people.zoho.com/people/api/files/uploadFileMultipart?fileName=${fileName}&fileType=0&employeeId=${peopleId}&catId=835993000000270241`;
                        let requestBody = new FormData();
                        const newPathString = `/tmp/${fileName}`;
                        fs.rename(filePath, newPathString, (cb) => {
                            //console.log(cb);
                            requestBody.append('uploadfile' , fs.createReadStream(newPathString));
                            //console.log(requestBody);
                            //upload file POST request... finally
                            axios.post(uploadURL, requestBody, {headers: {'Authorization' : authHeader }})
                            .then(uploadResp => {
                                const message1 = `PASS - ${fileName} was uploaded successfully`
                                logFileMessage(message1)
                                .then(() => {
                                    openClose()
                                    .then(() => console.log('logged'))
                                    .catch();
                                })
                                .catch();
                                //make another POST call to update the associated Contact record
                            })
                            .catch(err => {
                                logFileMessage('FAILURE - ' + fileName + ' API failed upload request')
                                .then(() => {
                                    console.log(err.response);
                                    console.log('error122');
                                })
                                .catch();
                                
                                
                            });
                        });	
                    }
                }
			})
			.catch(err => console.log("problem sending data to Zoho People " + err));
		  }
		  else{
              logFileMessage('FAILURE - ' + fileName + ' not a pdf')
              .then(() => {
                  console.log("not a pdf");
              })
              .catch();
			}
      resolve();
    }, delayTime);
  });
}
//
//
//POST REQUEST... POST REQUEST... POST REQUEST going to server/upload
app.post('/upload' , upload.array('pdf-files'), async function(req, res) {
    console.log('trying to upload');
	const files = req.files;
	if(files.length == 0) {
        await logFileMessage('THE SERVER IS WORKING BUT NO FILES WERE DETECTED');
        return res.sendFile('/tmp/bulk-upload-log.txt');
    }
	else {
        //iterate through each file, filter then upload correct files
        const filesSubmitted = files.length;
        axios.post(accessTokenURL, {headers: {'Content-Type' : 'application/json' }})
        .then((postResponse) => {
            const accessToken = postResponse.data.access_token;
            const authHeader = `Zoho-oauthtoken ${accessToken}`;
            processArray(files, authHeader)
            .then(() => {
                openClose()
                .then(() => {
                    setTimeout(() => {
                        return res.sendFile('/tmp/bulk-upload-log.txt');
                    }, 6000);
                    
                })
                .catch();

            })
            .catch(err => console.log(err));
        })
        .catch(function (error) {console.log(error);console.log('error142')});
    }
});

//GET REQUEST... GET REQUEST... GET REQUEST
app.get('/logFile', (req, res) => {
    res.download('/tmp/bulk-upload-log.txt');
});

app.listen(port , () =>{
	console.log("server listening on: " + port);
});

module.exports = app;
