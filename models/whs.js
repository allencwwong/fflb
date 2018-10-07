const mongoose = require('mongoose');

// whs schema
let whschema = new mongoose.Schema({
  guid:String,
  score:Number,
  league:String,
  week: Number
});

var Whs =  module.exports = mongoose.model('Whs',whschema);



