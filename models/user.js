const mongoose = require('mongoose');

// user schema
let userSchema = new mongoose.Schema({
  guid: String,
  profileImage: String,
  accessToken: String,
  refreshToken: String,
  leagueId: String,
  leagueName: String,
  leagueTotalScore: Number,
  leagueLogo: String,
  commish: String,
  startDate: String,
  standings: {}
});

var User=  module.exports = mongoose.model('User',userSchema);



