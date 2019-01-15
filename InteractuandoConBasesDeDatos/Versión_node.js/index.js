const MongoClient = require('mongodb').MongoClient
const operaciones = require('./CRUD.js')

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'nextu';

//var url = 'mongodb://localhost/nextu'

MongoClient.connect(url, function(err, client){
	console.log("Connected successfully to server");

	const database = client.db(dbName);

	let filter = {nombre:'Felipe'}

	operaciones.deleteRecord(database, filter, (error, result) =>{
		if(error)console.log('Error eliminando los registros: ' + error)
	})
});