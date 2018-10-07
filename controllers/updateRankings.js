const Team = require('../models/team');
const Whs = require('../models/whs');
const User = require('../models/user');

const request = require('request');
const YahooFantasy = require('yahoo-fantasy');

const clientId = process.env.YAHOO_CONSUMER_KEY;
const clientSecret = process.env.YAHOO_CONSUMER_SECRET;
const redirectUri = process.env.YAHOO_REDIRECT_URI;

// you can get an application key/secret by creating a new application on Yahoo!
var yf = new YahooFantasy(
    process.env.YAHOO_CONSUMER_KEY,
    process.env.YAHOO_CONSUMER_SECRET
);

exports.test = function (req, res) {


//   weeks.forEach(function(week){

      User.find({},function(err,users){

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

        var leagueKey = '380.l.'+user.leagueId;
        var addedTeam = [];

        // check if access token working
        if(accessToken){

            yf.setUserToken(accessToken);
            yf.league.standings(
                leagueKey,
                function(err, data) {
                    // console.log(data);
                // handle error
                if (err) console.log(err)

                // save league total score
                user.standings = data.standings;
                user.save(function(err){
                    if(err) console.log(err)
                    return user;
                })

                //console.log(counter);
                }
            );
        // end of add standing

            }else{
                console.log('couldnt get new accessToken')
            }


            //end of post request
        })

        }) // end of users each

    // end of user find
    }).then(function(users){


        // console.log(users[0].standings);
        users.forEach(function(user){
            if(user.standings){
                var lts = 0;
                user.standings.forEach(function(standing){
                    // console.log(standing);
                    // console.log(standing.points_for);
                    lts+= parseFloat(standing.standings.points_for);
                })
                user.leagueTotalScore = lts;
                user.save();
            }
        })


    })


        res.send('update 3');
//   }) // end of each
}
