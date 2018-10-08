const mongoose = require('mongoose');

// whs schema
let whschema = new mongoose.Schema({
  team: {},
  score: Number,
  week: Number
});

var Whs = module.exports = mongoose.model('Whs', whschema);