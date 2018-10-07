const Team = require('../models/team');
const Whs = require('../models/whs');
const User = require('../models/user');


exports.test = function (req, res) {

  var weeks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];


  weeks.forEach(function(week){

    // calc weekly high score
      var highScore;

      Team.find({})
           .exec()
           .then(function(teams){
      //       console.log('outside teams')
      //  if(teams){
      //   console.log('inside teams')

        var leaguesTotalScore = {};
        teams.forEach(function(team){

          if(!leaguesTotalScore[team.leagueId]){
            leaguesTotalScore[team.leagueId] = 0;

            if(team.standing){

              var score = parseFloat(team.standing.points_for);
              // console.log(score);
              leaguesTotalScore[team.leagueId] = score;
            }
          }else{
            if(team.standing){
              var score = parseFloat(team.standing.points_for);
              // console.log(score);
              leaguesTotalScore[team.leagueId] += score;
              console.log('update');
            }
          }

        })

        console.log(leaguesTotalScore)


        var leaguesTotalScoreId = Object.keys(leaguesTotalScore);

        // console.log(leaguesTotalScoreId)

        leaguesTotalScoreId.forEach(function(leagueId){
          User.findOne({leagueId:leagueId},function(err,user){
            console.log(err);
            user.leagueTotalScore = leaguesTotalScore[leagueId].toFixed(2);

              user.save(function (err) {
                console.log("add ltc");
            });

          })

        })


        //  var whScore = 0;
        //  var whsGuid = '';

        // teams.forEach(function(team){

        //    if(team.weeklyScore[week]){
        //     //  console.log('week score good week#',week);
        //      var teamWeeklyScore = parseFloat(team.weeklyScore[week])
        //        if(parseFloat(teamWeeklyScore.toFixed(2))> whScore){
        //          whScore = parseFloat(teamWeeklyScore.toFixed(2));
        //          whsGuid = team.guid;
        //        }
        //    }
        //  }) // end of teams forEach

        //  if(whScore > 0){
        //    highScore = {
        //      guid: whsGuid,
        //      score: whScore
        //    }
        //  }
      //  }
     }).then(function(){

      // Whs.findOne({week:week},function(err,whs){

      //   if(err) console.log(err);
      //   if(highScore && !whs){

      //     var whs = new Whs({
      //       week: week,
      //       guid: highScore.guid,
      //       score: highScore.score
      //     })
      //     whs.save(function(err){
      //         console.log('updated whs wk:',week);
      //     });
      //   }
      // })

     }) // end of then
     }) // end of whs calc
res.send('update 3')
    }