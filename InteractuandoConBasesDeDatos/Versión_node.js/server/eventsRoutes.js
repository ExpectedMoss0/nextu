const Router = require('express').Router();
const Events = require('./eventsModel.js')

// Obtener todos los eventos
Router.get('/all', function(req, res){
	Events.find({}).exec(function(err, docs){
		if(err){
			res.status(500);
			res.json(err);
		}else{
			let fixedDocsStructure = []
			docs.forEach(function(currentValue){
				let event = {
					id:currentValue._id,
					title:currentValue.title,
					start:currentValue.start,
					end:currentValue.end
				}
				fixedDocsStructure.push(event);
			})
			res.json(fixedDocsStructure);
		}
	})
});

// Obtener un evento por su id
Router.post('/delete/:id', function(req, res){
	let id = req.params.id;
	Events.deleteOne({_id:id}).exec(function(err, doc){
		if(err){
			res.status(500);
			res.json(err);
		}
		res.json(doc);
	});
});

Router.post('/new', function(req, res){
	let event = {
		ownerEmail:'japisnura@live.com.mx',
		title:req.body.title,
		start:req.body.start,
		end:req.body.end
	}

	Events.create(event, function(err, doc){
		if(err){
			res.status(500);
			res.json(err);
		}
		res.json(doc);
	});
});

Router.post('/update/:id', function(req, res){
	let id = req.params.id,
		start = req.body.start,
		end = req.body.end;

	Events.update({_id:id}, {$set:{'start':start, 'end':end}}).exec(function(err, doc){
		if(err){
			res.status(500);
			res.json(err);
		}
		res.json(doc);
	});
});

module.exports = Router;