const Score = require('../models/score');
const Team = require('../models/team');


exports.test = function (req, res) {
    var leagueList = [1137478,
        1414100,
        123427,
        141935,
        550059,
        142076,
        759072,
        126070,
        694357,
        142459,
        142095,
        142250,
        142645,
        143497,
        143041,
        142024,
        142492,
        138891,
        142205,
        142077,
        193374,
        104256,
        213090,
        143889,
        142350,
        527118,
        131981,
        142207,
        143107,
        238601,
        142027,
        141959,
        547676,
        105979,
        132032,
        266409,
        753669,
        142816,
        124571,
        108328,
        142338,
        134366,
        142309,
        142505,
        913978
    ]

    var addedTeam = [];
    var counter = 0;
    var week = process.env.GAME_WEEK || 1;

    Score.find({}, function (err, scores) {
        // loop thru every week of scores
        scores.map(function (score) {
            if (score.week == week) {

                console.log('============= WEEK ============');
                console.log(score.week);
                console.log('============= WEEK ============');
                score.leagues.forEach(function (league) {
                    // console.log(league.name);
                    // go thru matchups --> teams get team manager , guid , point , record? store in Team
                    league.scoreboard.matchups.forEach(function (match) {
                        match.teams.forEach(function (teamData) {
                            var guid = teamData.managers[0].guid;

                            // console.log(guid);
                            //promise
                            Team.find({guid:guid,leagueId:league.league_id}, function (err, team) {

                                if(team.length === 0){
                                        var team = new Team({
                                            guid: guid,
                                            teamKey: teamData.team_key,
                                            leagueId: league.league_id,
                                            leagueName: league.name,
                                            teamName: teamData.name,
                                            manager: teamData.managers[0].nickname,
                                            profileImg: teamData.team_logos[0].url,
                                            weeklyScore: {}
                                        })
                                        team.save(function(err){
                                            // console.log('add team',counter++)
                                        })
                                }
                                // if (week == 1) {
                                //     // console.log(leagueName);

                                //     //team.weeklyScore[week] = teamData.points.total;

                                //     if (!addedTeam.includes(guid)) {

                                //         var team = new Team({
                                //             guid: guid,
                                //             teamKey: teamData.team_key,
                                //             leagueId: league.league_id,
                                //             leagueName: league.name,
                                //             teamName: teamData.name,
                                //             manager: teamData.managers[0].nickname,
                                //             profileImg: teamData.team_logos[0].url,
                                //             weeklyScore: {}
                                //         })

                                //         addedTeam.push(guid);
                                //             team.save(function (err) {
                                //                 // console.log("add team for week1 only");

                                //             });
                                //         //save team info to db


                                //     }else{
                                //         var team = new Team({
                                //             guid: guid,
                                //             teamKey: teamData.team_key,
                                //             leagueId: league.league_id,
                                //             leagueName: league.name,
                                //             teamName: teamData.name,
                                //             manager: teamData.managers[0].nickname,
                                //             profileImg: teamData.team_logos[0].url,
                                //             weeklyScore: {}
                                //         })
                                //         // team.guid = guid;
                                //         // team.leagueId = league.league_id;
                                //         // team.teamKey = teamData.team_key;
                                //         team.save(function(err){
                                //             console.log(team);
                                //         });
                                //     }

                                // }
                            })
                        })
                    }) // end of matchups

                })
            }
        })
    }).then(function(){

        Team.find({},function(err,teams){
            console.log(teams[0]);
        })

    })

    res.send('updated 2')

};

// MH2QL4PLAXCA7UDHUCEQFVXVEY