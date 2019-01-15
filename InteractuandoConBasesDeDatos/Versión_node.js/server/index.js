const http = require('http'),
	  path = require('path'),
	  RoutingEvents = require('./eventsRoutes.js'),
	  express = require('express'),
	  bodyParser = require('body-parser'),
	  MongoClient = require('mongodb').MongoClient,
	  mongoose = require('mongoose');

const PORT = 8082;
const app = express();

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'nextu';

let db;
MongoClient.connect(url, function(err, client){
	console.log("Connected successfully to server");
	db = client.db(dbName);
});

mongoose.connect('mongodb://localhost/nextu');

app.use(express.static('client'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use('/events', RoutingEvents);

app.post('/login', function(req, res){
	let email = req.body.user,
		password = req.body.pass;

	let filter = {email:email, password:password}
	let collection = db.collection('users')

	collection.findOne(filter, function(err, docs){
		if(docs != null){
			if(docs.email == email && docs.password == password){
				res.end('Validado');
			}else res.end('Incorrecto');
		}else res.end('Incorrecto');
	})
})

const Server = http.createServer(app);

Server.listen(PORT, function(){
	console.log('Server is listening on port: ' + PORT);
})