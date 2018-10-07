const mongoose = require('mongoose');

// score schema
let scorechema = new mongoose.Schema({
  storedLeagues: [],
  week: Number,
  leagues: Array
});

var Score =  module.exports = mongoose.model('Score',scorechema);



