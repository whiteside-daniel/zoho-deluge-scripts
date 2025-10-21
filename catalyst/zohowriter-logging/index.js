const catalyst = require('zcatalyst-sdk-node');
const express = require('express');
const expressApp = express();

expressApp.use(express.json());

expressApp.get('/writerlog/', (req, res) => {
	const app = catalyst.initialize(req);
	res.json({message: 'working!'});
});

expressApp.post('/writerlog/', (req, res) => {
	const app = catalyst.initialize(req);
	const messageData = req.body.data;
	const emailAddress = req.body.email_address;
	const crmId = req.body.crm_id;
	const mergeEventObj = req.body.merge_event_object;
	//Create a JSON object with the rows to be inserted 
	let rowData = { data: messageData , email_address: emailAddress, crm_id: crmId, merge_event_object: mergeEventObj};
	//Use the table meta object to insert the row which returns a promise 
	let datastore = app.datastore(); 
	let table = datastore.table('writer_data_logs'); 
	let insertPromise = table.insertRow(rowData); 
	insertPromise.then((row) => {
	console.log(row); });
	res.json({message: 'success!'});
});

module.exports = expressApp;