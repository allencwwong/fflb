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

var WEEK = process.env.GAME_WEEK || 5;

// helper

function updateLeagueScores(user) {
    var leagueId = user.leagueId;
    var leagueKey = '380.l.' + leagueId;
    //var week = 1;

    console.log('lkey', leagueKey);

    // get league team indiv scores

    yf['league']['scoreboard'](
        leagueKey, WEEK,
        function cb(err, data) {

            console.log(WEEK);
            Score.findOne({
                    week: WEEK
                })
                .exec()
                .then(function (score) {
                    if (score) {
                        console.log('check lid:', leagueId);
                        if (score.storedLeagues.includes(leagueId)) {
                            // getTeamStanding(leagueKey);
                            console.log('id logged')
                        } else {
                            //add league to db
                            console.log('not on list')
                            // league not on list add to list push to league array
                            score.leagues.push(data);
                            score.storedLeagues.push(leagueId);

                            //save user info to db
                            score.save(function (err) {
                                console.log('added league info');
                                // updateTeamData(user);
                            }).then(function (score) {
                                console.log('updated score for', score.storedLeagues.length);
                            })

                        }
                    }

                })
        }
    ) // end of get score
}


exports.test = function (req, res) {

    User.find({})
        .exec()
        .then(function (users) {

            users.forEach(function (user) {


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
                    if (accessToken) {

                        yf.setUserToken(accessToken);
                        var isScore = false;
                        updateLeagueScores(user);

                    } else {
                        console.log('couldnt get new accessToken')
                    }


                    //end of post request
                })

            }) // end of users each

            res.redirect('/')
        })
    // end of user find
};