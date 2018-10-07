const request = require('request');
const YahooFantasy = require('yahoo-fantasy');

const clientId = process.env.YAHOO_CONSUMER_KEY;
const clientSecret = process.env.YAHOO_CONSUMER_SECRET;
const redirectUri = process.env.YAHOO_REDIRECT_URI;

const User = require('../models/user');
const Score = require('../models/score');
const Team = require('../models/team');

// you can get an application key/secret by creating a new application on Yahoo!
var yf = new YahooFantasy(
    process.env.YAHOO_CONSUMER_KEY,
    process.env.YAHOO_CONSUMER_SECRET
);

var currAccessToken,currTokenOwner;

let WEEK = process.env.GAME_WEEK;

// helper


//run this function within the other function
function updateTeamData(user,accessToken){
    // console.log('update team data')
  var leagueName,leagueId,leagueKey;
var commishLeagueId = user.leagueId;
var addedTeam = [];
var counter = 0;

  Score.find({},function(err,scores){
    // loop thru every week of scores
    scores.map(function(score){
        if(score.week <= process.env.GAME_WEEK){

            console.log('============= WEEK ============');
            console.log(score.week);
            console.log('============= WEEK ============');
          score.leagues.forEach(function(league){
            if(commishLeagueId == league.league_id){
            leagueId = league.league_id;
            leagueKey = '380.l.'+leagueId;

            leagueName = league.name;
            // go thru matchups --> teams get team manager , guid , point , record? store in Team
            league.scoreboard.matchups.forEach(function(match){
              match.teams.forEach(function(teamData){
                var guid = teamData.managers[0].guid;
                var week = teamData.points.week;
                // console.log(guid);
                //promise
              Team.find({},function(err,teams){

                if(WEEK == 1){
                    // console.log(leagueName);

                    var team = new Team({
                        guid: guid,
                        teamKey: teamData.team_key,
                        leagueId: leagueId,
                        leagueName: leagueName,
                        teamName: teamData.name,
                        manager: teamData.managers[0].nickname,
                        profileImg: teamData.team_logos[0].url,
                        weeklyScore: {},
                        standing: {}
                    })

                    //team.weeklyScore[week] = teamData.points.total;

                    if(!addedTeam.includes(guid)){
                        addedTeam.push(guid);
                      //save team info to db
                      team.save(function (err) {
                          console.log("add team for week1 only");

                      });
                  }


                }else if(WEEK > 1){
                    // maybe function to collect missing teams that didnt get inserted in WEEK 1??

                    //change if team name change update if did
                //     if(!team.teamName || team.teamName != teamData.name){
                //       team.teamName = teamData.name;
                //       team.updateOne({teamName:team.teamName},{teamName:teamData.name},function (err) {
                //         console.log("udpdate new team name");
                //   });

                                 // if(commishLeagueId == league.league_id){
                    //     var uleagueKey = '380.l.'+user.leagueId;
                    //     getTeamStanding(uleagueKey,accessToken);
                    // }

                // }
                  }

                })

              })

            }) // end of matchups
            }// end of lid check
          })
        }
        })
  });

}

function getTeamStanding(leagueKey,accessToken){
    //console.log('lk:',leagueKey);
    //console.log('get standing');
        // add standing
        yf.setUserToken(accessToken);
        yf.league.standings(
            leagueKey,
            function(err, data) {
                // console.log(data);
            // handle error
            if (err) console.log(err)
            // do your thing
            var standings = data.standings;
            standings.forEach(function(standing){
                Team.findOne({guid:standing.managers[0].guid},function(err,team){
                    if(team){
                        team.standing = standing.standings;
                        team.save(function(err){
                                // console.log(standing.standings);
                                //console.log('update standing');
                        })
                    }
                })
            })
            }
        );
    // end of add standing
}


exports.test = function (req, res) {

    User.find({})
        .exec()
        .then(function(users){

            users.forEach(function(user){


           //  get new token
           var accessTokenUrl = 'https://api.login.yahoo.com/oauth2/get_token';

           var options = {
               url: accessTokenUrl,
               headers: {
                   Authorization: 'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64')
               },
               rejectUnauthorized: false,
               json: true,
               form: {
                   refresh_token: user.refreshToken,
                   redirect_uri: redirectUri,
                   grant_type: 'refresh_token'
               }
           };

        // 1. Exchange authorization code for access token.
           request.post(options, function (err, res, body) {

            var guid = body.xoauth_yahoo_guid;
            var accessToken = body.access_token;

            currAccessToken = accessToken;
            currTokenOwner = guid;

            // check if access token working
            if(accessToken){

                yf.setUserToken(accessToken);



                updateTeamData(user,accessToken);

                }else{
                    console.log('couldnt get new accessToken')
                }


                //end of post request
            })

            }) // end of users each

        // end of user find
        })

        // add team data
        res.send('updated 2')

};