const Score = require('../models/score');
const Team = require('../models/team');
const Whs = require('../models/whs');
const User = require('../models/user');

// var WEEK = process.env.GAME_WEEK || 1;

exports.test = function (req, res) {

  var weeklyScore = {};
  var counter = 0;


  // User.find({}, function (err, users) {
  //   return users;
  // }).then(function (users) {
  //   users.forEach(function (user) {
  //     var leagueId = user.leagueId;
  //     user.standings.forEach(function (standing) {
  //       var guid = standing.managers[0].guid;
  //       console.log('guid: ', guid, ' id', leagueId);
  //       Team.updateOne({
  //         guid: guid,
  //         leagueId: leagueId
  //       }, {
  //         standing: standing.standings
  //       }, function (err) {
  //         if (err) console.log(err);
  //         console.log('update standing')
  //       })

  //     })
  //   })
  // })


  Score.find({}, function (err, scores) {
    return scores;
  }).then(function (scores) {

    Team.find({}, function (err, teams) {
      return teams;
    }).then(function (teams) {
      teams.forEach(function (team) {

      })
    })

    // loop thru every week of scores
    scores.map(function (score) {

      console.log('============= WEEK ============');
      console.log(score.week);
      console.log('============= WEEK ============');
      score.leagues.forEach(function (league) {
        //   var counter = 0;
        var leagueId = league.league_id;
        // go thru matchups --> teams get team manager , guid , point , record? store in Team
        league.scoreboard.matchups.forEach(function (match) {
          match.teams.forEach(function (teamData) {

            var guid = teamData.managers[0].guid;
            var week = teamData.points.week;
            var points = teamData.points.total;

            if (weeklyScore[leagueId]) {
              if (weeklyScore[leagueId][guid]) {
                weeklyScore[leagueId][guid][match.week] = points;
                counter++;
              } else {
                weeklyScore[leagueId][guid] = {};
                weeklyScore[leagueId][guid][match.week] = points;
                counter++;
              }
            } else {
              weeklyScore[leagueId] = {};
              weeklyScore[leagueId][guid] = {};
              weeklyScore[leagueId][guid][match.week] = points;
              counter++;
            }

          })
        })

      })
      // console.log(counter);

    })
    // console.log(weeklyScore);


    var whsLeagueIds = Object.keys(weeklyScore);

    // console.log(whsLeagueIds[0]);

    whsLeagueIds.forEach(function (id) {
      var leagueGuids = Object.keys(weeklyScore[id]);
      // console.log(leagueGuids);
      leagueGuids.forEach(function (guid) {
        Team.updateOne({
          guid: guid,
          leagueId: id
        }, {
          weeklyScore: weeklyScore[id][guid]
        }, function (err) {
          if (err) console.log(err);
        })
      })
    })

  }); // end of score find


}