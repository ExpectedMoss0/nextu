module.exports.insertRecord = function(db, data, callback){
	console.log(data);
	let collection = db.collection('users')

	collection.insertMany(data, (error, result) => {
		console.log('Resultado de insert: ' + result.toString())
	})
}

module.exports.deleteRecord = function(db, filter, callback){
	let collection = db.collection('users')

	try{
		collection.deleteMany(filter)
		console.log('Se elimino el registro correctamente');
	}catch(e){
		console.log('Se produjo un error: ' + e)
	}
}

module.exports.consult = function(db, filter, callback){
	let collection = db.collection('users')

	
}