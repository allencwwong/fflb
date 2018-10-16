const Score = require('../models/score');
const Team = require('../models/team');
const User = require('../models/user');
const Whs = require('../models/whs');

exports.test = function (req, res) {

    var WEEK = process.env.GAME_WEEK || 1;

    var highScore = 0;
    var weeklyHighScore = {};
    var weeklyHighScoreList = [];

    Team.find({}, function (err, teams) {
        return teams;
    }).then(function (teams) {

        // save whs
        Whs.find({
            week: WEEK
        }, function (err, whs) {


            console.log('loop', WEEK)
            teams.forEach(function (team) {
                console.log(team.guid, ' score', team.weeklyScore[WEEK])
                if (parseFloat(team.weeklyScore[WEEK]) > highScore) {
                    highScore = parseFloat(team.weeklyScore[WEEK]);
                    // weeklyHighScore.guid = team.guid;
                    // weeklyHighScore.league = team.leagueName;
                    weeklyHighScore.team = team,
                        weeklyHighScore.score = team.weeklyScore[WEEK];
                    weeklyHighScore.week = WEEK;
                }
                // console.log(highScore, " wk:", WEEK);
            }) // end of each team

            //weeklyHighScoreList.push(weeklyHighScore);
            // weeklyHighScore = {};
            // highScore = 0;

            if (whs.length === 0) {
                var whs = new Whs({
                    team: weeklyHighScore.team,
                    score: weeklyHighScore.score,
                    week: weeklyHighScore.week

                })

                whs.save(function (err) {
                    console.log(whs, ' == updated whs wk:', WEEK);
                });
            }

        })
        // next and reset


    })

    User.find({}, function (err, users) {
        users.forEach(function (user) {
            console.log(user.commish)
            if (!user.commish) {
                user.standings.forEach(function (standing) {
                    if (standing.managers[0].is_commissioner) {
                        user.commish = standing.managers[0].nickname;
                        user.save(function (err) {
                            // console.log(standing.managers[0].nickname);
                        });
                    }
                })
            }
            user.standings.forEach(function (standing) {
                var guid = standing.managers[0].guid;
                Team.updateOne({
                    guid: guid,
                    leagueId: user.leagueId
                }, {
                    standing: standing.standings
                }, function (err) {
                    console.log('update standing');
                })
            })
        })
    })



    // Team.find({},function(err,teams){
    //     teams.forEach(function(team){
    //         console.log(Object.keys(team.weeklyScore))
    //         if(Object.keys(team.weeklyScore).length < 3){
    //             console.log(team.guid,team.leagueId)
    //         }
    //     })
    // })

    //check each league size

    // var teamList = {}
    // //console.log(weeklyScoresList)
    // Team.find({},function(err,teams){
    //     teams.forEach(function(team){
    // // console.log(team.leagueId)
    //         if(team.leagueId == 193374){
    //             //console.log(team);
    //         }
    //         if(!teamList[team.leagueId]){
    //             teamList[team.leagueId] = 1
    //        }else{
    //         teamList[team.leagueId] += 1
    //        }
    //     })
    //     console.log(teamList)

    // })

    // var list = [];
    // User.find({},function(err,users){
    //     users.forEach(function(user){

    //         if(list.includes(user.leagueName)){
    //             //console.log(user)
    //         }
    //         list.push(user.leagueName);
    //     })
    // })






}