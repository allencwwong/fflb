const mongoose = require('mongoose');

// team schema
let teamSchema = new mongoose.Schema({
  guid: String,
  teamKey: String,
  leagueId: String,
  leagueName: String,
  teamName: String,
  manager: String,
  profileImg: String,
  totalScore: String,
  weeklyScore: Object,
  rank:Number,
  standing: Object
});

var Team=  module.exports = mongoose.model('Team',teamSchema);