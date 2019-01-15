const mongoose = require('mongoose')

const Schema = mongoose.Schema

let EventSchema = new Schema({
  ownerEmail: {type:String, required:true},
  title: {type:String, required:true},
  start: {type:String, required:true},
  end: {type:String, required:false},
  fullDay: {type:Boolean, required:false}
})

let EventModel = mongoose.model('events', EventSchema)

module.exports = EventModel