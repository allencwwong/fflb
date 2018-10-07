const Score = require('../models/score');
const Team = require('../models/team');
const Whs = require('../models/whs');

var WEEK =  process.env.GAME_WEEK || 4;

exports.test = function (req, res) {

    var weeklyScore = {};


    Score.find({},function(err,scores){
        return scores;
    }).then(function(scores){

       // loop thru every week of scores
       scores.map(function(score){
        if(score.week <= WEEK){
            console.log('============= WEEK ============');
            console.log(score.week);
            console.log('============= WEEK ============');
            var counter = 0;
          score.leagues.forEach(function(league){
            //   var counter = 0;
              var leagueId = league.league_id;
              // go thru matchups --> teams get team manager , guid , point , record? store in Team
            league.scoreboard.matchups.forEach(function(match){
              match.teams.forEach(function(teamData){

                  var guid = teamData.managers[0].guid;
                  var week = teamData.points.week;
                  var points = teamData.points.total;


                //   if(score.week == week){
                    weeklyScore[score.week] = points;
                    console.log(week);
                      console.log(weeklyScore);
                        console.log(counter++);

                      Team.updateOne({leagueId:leagueId,guid:guid},{weeklyScore},function(err){
                        //   counter++;
                    });

                //  }
              })
            })

    })
}
}) // end of score map


}); // end of score find


}
