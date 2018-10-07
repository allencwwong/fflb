const Score = require('../models/score');
const Team = require('../models/team');
const User = require('../models/user');
const Whs = require('../models/whs');

exports.test = function (req, res) {

    var WEEK = process.env.GAME_WEEK || 4;

    var highScore = 0;
    var weeklyHighScore = {};
    var weeklyHighScoreList = [];

    Team.find({}, function(err,teams) {
        return teams;
    }).then(function(teams){

                    // save whs
                    Whs.find({week:WEEK},function(err, whs){


                        for(var currWeek = 1; currWeek <= WEEK; currWeek++) {
                            console.log('loop', WEEK)
                            teams.forEach(function(team) {
                              //  console.log(team.guid)
                                if (parseFloat(team.weeklyScore[currWeek]) > highScore) {
                                    highScore = parseFloat(team.weeklyScore[currWeek]);
                                    weeklyHighScore.guid = team.guid;
                                    weeklyHighScore.league = team.leagueName;
                                    weeklyHighScore.score = team.weeklyScore[currWeek];
                                    weeklyHighScore.week = currWeek;
                                }
                                // console.log(highScore," wk:",currWeek);
                            }) // end of each team

                            weeklyHighScoreList.push(weeklyHighScore);
                            weeklyHighScore = {};
                            highScore = 0;
                        } // loop x week

                        // var lastScore = (weeklyHighScoreList.length-1;
                        console.log(weeklyHighScoreList);
                        console.log('whs save')

                        if(whs.length === 0){
                            console.log(whs);
                                var whs = new Whs({
                                    guid:weeklyHighScoreList[WEEK-1].guid,
                                    league:weeklyHighScoreList[WEEK-1].league,
                                    score:weeklyHighScoreList[WEEK-1].score,
                                    week:weeklyHighScoreList[WEEK-1].week

                                })

                                whs.save(function (err) {
                                    console.log(whs, ' == updated whs wk:', WEEK);
                                });
                        }

                    })
                    // next and reset


    })

    User.find({},function(err,users){
        users.forEach(function(user){
            console.log(user.commish)
            if(!user.commish){
                user.standings.forEach(function(standing){
                    if(standing.managers[0].is_commissioner){
                        user.commish = standing.managers[0].nickname;
                        user.save(function(err){
                            console.log(standing.managers[0].nickname);
                        });
                    }
                })
            }
            user.standings.forEach(function(standing){
                var guid = standing.managers[0].guid;
                Team.updateOne({guid:guid,leagueId:user.leagueId},{standing:standing.standings},function(err){
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