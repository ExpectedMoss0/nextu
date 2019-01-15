const MongoClient = require('mongodb').MongoClient

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'nextu';

MongoClient.connect(url, function(err, client){
	console.log("Connected successfully to server");

	const db = client.db(dbName);

	let data = {
		userId:~~(Math.random() * 50),
		email:'japisnura@live.com.mx',
		password: '12345',
		name:'Francisco Javier',
		lastName:'Nunez Ramirez'
	}

	console.log(data);
	let collection = db.collection('users')

	try{
		collection.insertOne(data)
		console.log('Usuario registrado');
	}catch(e){
		console.log('ERROR: ' + e);
	}
});