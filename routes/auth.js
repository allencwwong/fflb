const express = require('express');
const router = express.Router();
const qs = require("qs");
const request = require("request");
const mongoose = require("mongoose");
const session = require("express-session");
var YahooFantasy = require("yahoo-fantasy");

const User = require("../models/user");

var clientId = process.env.YAHOO_CONSUMER_KEY;
var clientSecret = process.env.YAHOO_CONSUMER_SECRET;
var redirectUri = process.env.YAHOO_REDIRECT_URI;

const leagueIdList = [
                        [1137478,
                          'https://i1.wp.com/www.mercurynews.com/wp-content/uploads/2018/09/BNG-L-49ERS-0917-62.jpg?fit=620%2C9999px&ssl=1'],
                        [1414100,''],
                        [1234278,''],
                        [1419354,''],
                        [550059,'https://images1.laweekly.com/imager/playa-vista-was-going-to-be-a-utopian-plan/u/original/4378498/featur1-1.jpg'],
                        [1420767,''],
                        [759072,''],
                        [1260704,'https://ct.yimg.com/cy/1758/39385948033_d92a7f_192sq.jpg?ct=fantasy'],
                        [694357,'https://goo.gl/images/eeZKPt'],
                        [1424597,''],
                        [1420950,'https://ct.yimg.com/cy/1749/44299190492_4182c4_192sq.jpg'],
                        [422508,'https://s.yimg.com/cv/apiv2/default/fflb/LaMejorFantasia_Logo_FFsharkfantasy.jpg'],
                        [1426456,''],
                        [1434977,''],
                        [1430418,'https://ct.yimg.com/cy/1725/40708658216_b013ec_192sq.jpg'],
                        [1420248,''],
                        [1424926,''],
                        [1388913,''],
                        [1422051,''],
                        [1420770,''],
                        [193374,''],
                        [1042560,''],
                        [213090,'https://ct.yimg.com/cy/1729/39348856803_45baf4_192sq.jpg'],
                        [1438890,''],
                        [1423505,''],
                        [527118,'https://i.imgur.com/27hmnup.gif'],
                        [1319810,''],
                        [1422076,''],
                        [1431074,''],
                        [238601,''],
                        [1420273,''],
                        [1419598,''],
                        [547676,'https://ct.yimg.com/cy/1902/43167016524_8708be_192sq.jpg?ct=fantasy'],
                        [1059791,''],
                        [1320321,'https://ct.yimg.com/cy/1818/44194050572_8c4455_192sq.jpg?ct=fantasy'],
                        [266409,''],
                        [753669,'https://ct.yimg.com/cy/1786/28599254069_6bf684_192sq.jpg?ct=fantasy'],
                        [1428160,''],
                        [1245715,'https://ct.yimg.com/cy/1653/39239520943_fff063_192sq.jpg'],
                        [1083284,''],
                        [1423388,''],
                        [1343665,'https://ct.yimg.com/cy/1765/29888395209_ba7b84_192sq.jpg'],
                        [1423099,'https://joemontanasrightarm.files.wordpress.com/2012/09/smokinjaycutler.jpg'],
                        [1425059,''],
                        [913978,''],
                        [1421195,'']
                   ]


var yf = new YahooFantasy(
  process.env.YAHOO_CONSUMER_KEY,
  process.env.YAHOO_CONSUMER_SECRET
);



//  GET auth
router.get("/", function(req, res){
    var authorizationUrl = "https://api.login.yahoo.com/oauth2/request_auth";

    console.log(clientId,clientSecret,redirectUri)

    res.redirect(
        authorizationUrl +"?client_id=" +clientId +"&redirect_uri=" +redirectUri +"&response_type=code"
    );
});

router.get("/yahoo/callback", function(req, res) {
  var accessTokenUrl = "https://api.login.yahoo.com/oauth2/get_token";

  var options = {
    url: accessTokenUrl,
    headers: {
      Authorization:
        "Basic " + new Buffer(clientId + ":" + clientSecret).toString("base64")
    },
    rejectUnauthorized: false,
    json: true,
    form: {
      code: req.query.code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code"
    }
  };

  // 1. Exchange authorization code for access token.
  request.post(options, function(err, response, body) {
    var guid = body.xoauth_yahoo_guid;
    var accessToken = body.access_token;
    var refreshToken = body.refresh_token;
    var socialApiUrl =
      "https://social.yahooapis.com/v1/user/" + guid + "/profile?format=json";

    var options = {
      url: socialApiUrl,
      headers: { Authorization: "Bearer " + accessToken },
      rejectUnauthorized: false,
      json: true
    };

    // 2. Retrieve profile information about the current user.
    request.get(options, function(err, response, body) {
      // 3. Create a new user account or return an existing one.
      User.findOne({ guid: guid }, function(err, existingUser) {
        if (existingUser) {
          // redirect to leaderboard page
          console.log('found user',existingUser)

          req.session.user = existingUser;
          res.redirect("/login");
        //   maybe consider create function to update access key if login again if needed? --> existingUser.accessToken = accessToken;
        }else{

            yf.setUserToken(accessToken);

            yf.user.game_leagues(
              process.env.YAHOO_GAME_KEY,
              function(err, data) {
                if (err) console.log(err)
                  // handle error
                 console.log(data)
                  data.games.forEach(function(game){
                    // console.log(game);
                    game.leagues.forEach(function(league){
                      league.forEach(function(l){
                        console.log(l.league_id);

                            leagueIdList.forEach(function(leagueId){
                              if(leagueId[0] == l.league_id){

                                  // create new user account
                                  var user = new User({
                                    guid: guid,
                                    profileImage: body.profile.image.imageUrl,
                                    accessToken: accessToken,
                                    refreshToken: refreshToken,
                                    leagueId: l.league_id,
                                    leagueName: l.name,
                                    leagueLogo: leagueId[1],
                                    startDate: l.start_date
                                  });
                                  console.log(user);
                                  // save user info to db
                                  user.save(function(err) {
                                    console.log("create new user/commish");
                                    req.session.user = user;
                                    res.redirect('/login');
                                  });
                              }
                            })



                      })


                    })
                  })
               }
            );


        }

      }); // end of 3
    }); // end of 2
  }); // end of 1
}); // end of callback

module.exports = router;
