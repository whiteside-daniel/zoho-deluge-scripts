'use strict';

//get os for discovering tmp directory
//const os = require('os');
//let tmpDir = os.tmpdir();
//console.log(tmpDir);

//express setup
const express = require('express');
const app = express();
app.use(express.json());

//multer for grabbing the files from the HTML form
const multer = require('multer');
const upload = multer();
//const upload = multer({ dest : '/tmp/' });

//axios for API calls
const axios = require('axios');

//app constants
const port = 8080;
const accessTokenURL = 'https://accounts.zoho.com/oauth/v2/token?refresh_token=****&client_secret=****&grant_type=refresh_token'

//POST requests going to server/upload
app.post('/upload' , upload.array('pdf-files') , (req, res) => {
	let fileCount = 0;
	let employeeMatch = 0;
	const files = req.files;
	if(!files) {return res.status(200).json({"code" : "the server is working but no files were detected. Please go back and try again" });}	
	//iterate through each file, filter then upload correct files
	const filesSubmitted = files.length;
	files.forEach( file => {	
		//console.log(file);
		//check file type for pdf
		const fileType = file.mimetype;
		if(fileType === 'application/pdf') {
			fileCount = fileCount + 1;
			//parse pdf file name
			const fileName = file.originalname;
			const fileNameParts = fileName.split("-");
			const employeeID = fileNameParts[0];
			console.log("trying to upload " + fileNameParts);

			//get access token here
			axios.post(accessTokenURL, {headers: {'Content-Type' : 'application/json' }})
			  .then(function (response) {
			    const accessToken = response.data.access_token;
			    //console.log(response.data.access_token);
			    //then make your actual API call here
			    //checking if employee ID exists in zPeople
			    const peopleURL = `https://people.zoho.com/people/api/forms/employee/getRecords?SearchColumn=EMPLOYEEID&SearchValue=${employeeID}`;
			    const realPeopleURL = encodeURI(peopleURL);
			    console.log("trying URL " + realPeopleURL);
			    const authHeader = `Zoho-oauthtoken ${accessToken}`;
			    axios.get(peopleURL ,{headers: {'Authorization' : authHeader }})
				.then(response => {
					console.log("employees found: " + response.data.response.result.length);
					const result = response.data.response.result;
					result.forEach(ele => {
					  const employee = ele[Object.keys(ele)[0]][0];
					  const zpEmployeeId = employee.EmployeeID;
					  //console.log(employee)
					  if(zpEmployeeId === employeeID){
					    //found an employee match, now add the file
					    console.log("EMPLOYEE ID MATCH: " + zpEmployeeId);
					    console.log(ele);
					    const filePostURL = `https://people.zoho.com/people/api/files/uploadFileMultipart`;
					    const fileParams = {
						uploadfile : file,
						fileName : fileName.toString(),
						fileType: 'pdf',
						fileType : '0',
						employeeId : zpEmployeeId,
						notifyToall : 'true'
					    };
					    console.log("trying to POST now: ")
					    console.log(fileParams);
					    employeeMatch = employeeMatch + 1;
					    axios.post(filePostURL, fileParams , { headers: {'Authorization' : authHeader , 'Content-Type' : 'multipart/form-data'}})
						.then(response => {console.log("success: " + response)})
						.catch(err => console.log(err));
					  }
					});
				})
				.catch(err => console.log("problem sending data to Zoho People " + err));
			  })
			  .catch(function (error) {
			    console.log("something went wrong... " + error);
			  });

		} 
		else{ console.log('not a pdf'); }
	});
	return res.status(200).json({"code" : "success" , "files-submitted" : filesSubmitted, "files-pdf-format-accepted" : fileCount });
});

app.listen(port , () =>{
	console.log("server listening on: " + port);
});

module.exports = app;
