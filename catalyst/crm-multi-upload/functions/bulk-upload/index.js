//CONFIG AND IMPORT... CONFIG AND IMPORT...
'use strict';
//get os for discovering tmp directory
//const os = require('os');
const path = require('path');
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

//AdmZip
const AdmZip = require('adm-zip');




//APP CONSTANTS...APP CONTSANTS... APP CONSTANTS
const { apiMapping, config } = require('./config');

//set a delay time for API limitations, in miliseconds(ms)
const delayTime = 150;
//port number, DO NOT CHANGE THIS
const port = 8080;
//access token URL, be very careful here and check ./.env for environment variables
const accessTokenURL = `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.REFRESH_TOKEN}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`;

//
//FUNCTIONS...FUNCTIONS...FUNCTIONS
//
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
    });
};
//this needs to be the last app.use statement in this code
app.use(ErrorHandler);


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
    });
}

//unZip a zip file
async function unzipFile(fileObj) {
	try {
		const zip = fileObj.buffer ? new AdmZip(fileObj.buffer) : new AdmZip(fileObj.path);
		const zipEntries = zip.getEntries();
		const csvFiles = zipEntries.filter(entry => !entry.isDirectory && path.extname(entry.entryName)==config.withPacing.filters.directoryContents.fileExtension);
		// Check if we have exactly 2 CSV files
		if (csvFiles.length !== 2) {
		  throw new Error(`Expected 2 CSV files, but found ${csvFiles.length}`);
		}
		// Extract CSV contents
		const csvData = csvFiles.map(entry => ({
			filename: entry.entryName,
			filetype: (entry.entryName.endsWith('pacing_schedule.csv') ? 'pacing': 'lineitems'),
			content: entry.getData().toString(config.withPacing.filters.directoryContents.encoding)
		}));

		return {
			success: true,
			files: csvData
		};
	}
	catch(err) {
		console.error(err);
		return {
			success: false,
			error: `${err}`
		};
	}
}

function parseCsvToJson(csvString) {
  const lines = csvString.split(/\r?\n/).filter(line => line.trim());
  const headers = parseCsvLine(lines[0]);
  
  return lines.slice(1).map(line => {
    const values = parseCsvLine(line);
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index] || '';
      return obj;
    }, {});
  });
}

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote (two quotes in a row)
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      // Regular character
      current += char;
    }
  }
  
  // Push the last field
  result.push(current.trim());
  
  return result;
}

async function uploadPacing(pacingJson, authHeader) {
	return new Promise((resolve, reject) => {
		let crmList = [];
		for(let i=0; i < pacingJson.length; i++) {
			let crmJson = {};
			const pacingPlan = pacingJson[i];
			const colHeaders = Object.keys(pacingPlan);
			colHeaders.forEach(colHeader => {
				const mappingLookup = apiMapping.pacingSchedule.filter(sch => sch.csvColName == colHeader);
				if(mappingLookup.length > 0) {
					//console.log(`found a match in the mapping: ${JSON.stringify(mappingLookup[0])}`);
					const apiName = mappingLookup[0].zohoApiName;
					const zFieldType = mappingLookup[0].zFieldType;
					if(apiName != null) {
						let fieldValue;
						switch(zFieldType) {
							case Number:
								//console.log(`parsing int`);
								fieldValue = parseInt(pacingJson[i][colHeader]);
								break;
							case 'Currency':
								fieldValue = parseFloat(pacingJson[i][colHeader]);
								break;
							default:
								fieldValue = pacingJson[i][colHeader];
								break;
						}
						crmJson[apiName] = fieldValue;
						
					} 
				}
			});
			crmList.push(crmJson);
		}
		postToZCRM(crmList, 'Custom_Pacing_Plans', authHeader);
	});
}

async function uploadLineitems(lineitemJson, authHeader, flightType) {
	return new Promise((resolve, reject) => {
		console.log(`flight type: ${flightType}`);
		let crmList = [];
		for(let i=0; i < lineitemJson.length; i++) {
			let crmJson = {};
			const lineItems = lineitemJson[i];
			const colHeaders = Object.keys(lineItems);
			colHeaders.forEach(colHeader => { 
				console.log(`seaching for ${colHeader}`);
				let mappingLookup = apiMapping.lineItems[flightType].map.filter(sch => sch.csvColName === colHeader);
				if(mappingLookup.length == 1) {
					//console.log(`found a match in the mapping: ${JSON.stringify(mappingLookup[0])}`);
					const apiName = mappingLookup[0].zohoApiName;
					const zFieldType = mappingLookup[0].zFieldType;
					if(apiName != null) {
						const rawValue = lineitemJson[i][colHeader];
						let fieldValue;
						switch(zFieldType) {
							case 'Number':  //String comparison
								fieldValue = parseInt(rawValue);
								if(isNaN(fieldValue)) {
									console.warn(`Invalid number for ${colHeader}: "${rawValue}"`);
									return;
								}
								break;
							case 'Currency':
								fieldValue = parseFloat(rawValue);
								if(isNaN(fieldValue)) {
									console.warn(`Invalid currency for ${colHeader}: "${rawValue}"`);
									return;
								}
								break;
							case 'Date':  //String comparison
								const newDate = new Date(rawValue);
								if(isNaN(newDate.getTime())) {
									console.warn(`Invalid date for ${colHeader}: "${rawValue}"`);
									return;
								}
								fieldValue = newDate.toISOString().split('T')[0];
								break;
							default:
								fieldValue = rawValue;
								break;
						}
						console.log(`inserting { ${apiName} : ${fieldValue} }`);
						crmJson[apiName] = fieldValue;
					} 
				}
				 else {
					 console.error('ambiguity finding fields!');
				 }
			});
			crmList.push(crmJson);
		}
		if(config.application.zohoTestMode) {
			console.log(`fake POST`);
			console.log(crmList);
		}
		else {
			postToZCRM(crmList, 'Line_Items', authHeader)
			.then(postResponse => {
				resolve(postResponse);
			})
			.catch(err => {
				reject(err);
			});
		} 
	});
}

async function postToZCRM(crmJson, moduleName, authHeader) {
	return new Promise((resolve, reject) => {
		//PREPARE POST REQUEST
		const url = `https://www.zohoapis.com/crm/v8/${moduleName}`;
		console.log(`sending POST to ${url}`);
		console.log(crmJson);
		//console.log(`trying with: ${crmJson.length}`);
		const axiosParams = {headers: {
			'Content-Type':'application/json',
			'Authorization': authHeader
		}};
		axios.post(url, {data: crmJson} , axiosParams)
		.then(data => {
			if(data.status == 201) {
				//console.log(data.data.data);
				logFileMessage(`201 - Records Added to ZohoCRM: ${moduleName}`);
				resolve({status: 201, code: 'success - records created'});
				
			} else {
				logFileMessage(`500 - ERROR - Records failed to add to ZohoCRM: ${moduleName}`);
				reject({status: 500, code: 'something went wrong with POST request'});
			}
		})
		.catch(err => {
			const errorData = err.response.data.data;
			logFileMessage(`POST ERROR - something went wrong. ${JSON.stringify(err.response.data.data)}`);
			reject(err.response.data.data);
		});
	});
}

//PROCESS ARRAY
//async function which processes an entire array by "waiting" for each of the elements one-by-one
//otherwise JS would try to run each iteration of the loop multi-thread and would easily burn out the API limits
async function processArray(array, authHeader, flightType, withPacing) {
    return new Promise((resolve, reject) => {
        let promiseArray = [];
        if(withPacing) {
			for(const item of array) {
				promiseArray.push(processZipFile(item, authHeader, flightType));
			}
		} else {
			for(const item of array) {
				promiseArray.push(processCsvFile(item, authHeader, flightType));
			}
		}
        setTimeout(() => {
            Promise.all(promiseArray)
            .then(() => {
                resolve('processed');
            })
            .catch(err => {
				reject(err);
			});
            
        }, 1000);
    });
}

//PROCESS FILE
//async function which processes elements of an array
async function processZipFile(file, authHeader, flightType) {
  // Simulating an asynchronous operation
  return new Promise(resolve => {
    setTimeout(() => {
        //what to do with each file
		//console.log(file);
		//check file type for pdf
		const fileType = file.mimetype;
		const fileName = file.originalname;
		console.log(`${fileType} - ${fileName}`);
		console.log(`${config.withPacing}`);
		if(fileType === config.withPacing.filters.mimeFileType) {
			console.log(`filter passed - ${fileType}`);
			const filePath = file.path;
			//YOUR PROCESSING LOGIC HERE
			unzipFile(file)
			.then(unzippedFileData => {
				if(unzippedFileData.success) {
					//NOW YOU HAVE UNZIPPED AND HAVE 2 CLEAN CSV FILES
					const pacingData = unzippedFileData.files.filter(item => item.filetype == 'pacing');
					const pacingJson = parseCsvToJson(pacingData[0].content);
					//console.log(pacingJson);
					uploadPacing(pacingJson, authHeader)
					.then(uploadResponse => {
						//console.log(uploadResponse);
					})
					.catch(err => {
						console.log(err);
					});
					const lineitemData = unzippedFileData.files.filter(item => item.filetype == 'lineitems');
					const lineitemJson = parseCsvToJson(lineitemData[0].content);
					console.log('sending line item JSON for upload. Flight type: ' + flightType); 
					//console.log(lineitemJson);
					uploadLineitems(lineitemJson, authHeader, flightType)
					.then(uploadResponse => {
						//console.log(uploadResponse);
					})
					.catch(err => {
						console.error(err);
					});
				}
			})
			.catch(err => {
				console.error(err);
			});
		  }
		else{
			logFileMessage('FAILURE - ' + fileName + ' not a zip')
			.then(() => {
				console.log("wrong filetype");
			})
			.catch();
		}
      resolve();
    }, delayTime);
  });
}
//
//
async function processCsvFile(file, authHeader, flightType) {
  // Simulating an asynchronous operation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        //what to do with each file
		console.log(file);
		const fileType = file.mimetype;
		const fileName = file.originalname;
		console.log(`${fileType} - ${fileName}`);
		if(fileType === config.withoutPacing.filters.mimeFileType) {
			console.log(`filter passed - ${fileType}`);
			const filePath = file.path;
			const fileName = file.filename;
			//YOUR PROCESSING LOGIC HERE
			console.log(file);
			try {
				const csvString = fs.readFileSync(filePath, 'utf8');
				const lineItemJson = parseCsvToJson(csvString);
				console.log(lineItemJson);
				uploadLineitems(lineItemJson, authHeader, flightType)
				.then(uploadResponse => {
					console.log('success');
				})
				.catch(err => {
					reject(err);
				});
			} catch (error) {
			  console.error('Error reading file:', error.message);
			}
		  }
		else{
			logFileMessage('FILE TYPE ERROR - ' + fileName + ' not a csv')
			.then(() => {
				console.log("wrong filetype");
			})
			.catch();
		}
      resolve();
    }, delayTime);
  });
}





//POST REQUEST... POST REQUEST... POST REQUEST going to server/upload
app.post('/upload' , upload.array('pdf-files'), async function(req, res) {
    console.log('trying to upload');
	//flightTypes are:        standard || referral_partner || agency_markup
	const flightType = req.body.flightType;
	console.log(`with pacing: ${req.body.pacingPlan}`);
	const withPacing = (req.body.pacingPlan == 'yes' ? true : false);
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
			console.log(`access token: ${accessToken}`);
            const authHeader = `Zoho-oauthtoken ${accessToken}`;
            processArray(files, authHeader, flightType, withPacing)
            .then(() => {
                openClose()
                .then(() => {
                    setTimeout(() => {
						return res.sendFile('/tmp/bulk-upload-log.txt'); 
					}, 2000);
                })
                .catch(err => {
					console.log(err);
				});

            })
            .catch(err => console.log(err));
        })
        .catch(function (error) {
			console.log(error);console.log('error254');
		});
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