const express = require('express');
const router = express.Router();
const session = require("express-session");

const User = require('../models/user');
const Score = require('../models/score');
const Team = require('../models/team');
const Whs = require('../models/whs');

const updateScore_controller = require("../controllers/updateScore");
const updateWeekly_controller = require("../controllers/updateWeekly");
const qdb_controller = require("../controllers/qdb");
const createTeam_controller = require("../controllers/createTeam1");
const updateRankings_controller = require("../controllers/updateRankings");
const checker_controller = require("../controllers/checker");


// yahoo oauth
router.use('/auth', require('./auth'))

router.get('/coming', function (req, res, next) {
  res.render('coming');
})

/* GET home page. */
// router.get('/teams', function (req, res, next) {

//   // res.redirect('/coming');

//   Team.find({})
//     .exec(function (err, teams) {

//       if (teams) {

//         // // sort team by points_for  high to low
//         var byScore = teams.slice(0);

//         byScore.sort(function (a, b) {
//           if (a.standing && b.standing) {
//             return b.standing.points_for - a.standing.points_for
//           }
//         })

//         res.render('teams', {
//           teams: byScore
//         });


//       } else {
//         res.render('no data x_X');
//       }
//     })

// });

router.get("/", function (req, res) {

  var byLsTotalScore;

  // sort team total score high to low
  User.find({}, function (err, users) {

    return users


  }).then(function (users) {

    byLsTotalScore = users.slice(0);

    // sort lts from high to low

    byLsTotalScore.sort(function (a, b) {
      return b.leagueTotalScore - a.leagueTotalScore;
    })

    res.render('leagues', {
      leagues: byLsTotalScore
    });

  })
})

// router.get('/weeklyhighscores',function(req,res){
//   // sort team total score high to low
//   User.find({}, function (err, users) {

//     // get whs record
//     Whs.find({}, function (err, whss) {
//       var whsRecords = [];

//       whss.forEach(function (whs) {
//         teams.forEach(function (team) {
//           if (team.guid == whs.guid) {
//             var record = {
//               whs: whs,
//               team: team
//             }
//             whsRecords.push(record);
//           }
//         })
//       })

//       res.render('whs', {
//         whss: whsRecords
//       });

//     })
//   })
// })

router.get('/api/v1/whs/', function (req, res) {
  // sort team total score high to low
  Whs.find({}, function (err, whss) {
    res.send(whss);
  })


})

router.get('/api/v1/teams/:searchby&:key', function (req, res) {
  var searchBy = req.params.searchby;
  var key = req.params.key;
  var qParam = {};
  if (searchBy === 'all') {
    qParam = {};
  } else {
    qParam[searchBy] = key;
    console.log(searchBy, ' ', key);
  }
  Team.find(qParam, function (err, teams) {
    res.send(teams);
  })
})

router.get('/league/:leagueid', function (req, res) {
  var leagueId = req.params.leagueid;
  Team.find({
    leagueId: leagueId
  }, function (err, teams) {
    console.log(teams);
    teams.sort(function (a, b) {
      return a.standing.rank - b.standing.rank;
    })
    res.send(teams);
  })
})

// GET login
router.get('/login', function (req, res) {
  if (req.session.user) {
    return res.render('login', {
      user: req.session.user
    })
  }
  res.redirect('/')
});

// GET logout
router.get('/logout', function (req, res) {
  delete req.session.user;
  res.redirect("/");
});

// add to score db
router.get('/test', updateScore_controller.test);
// run once only during init - add to team db
router.get('/createteam', createTeam_controller.test);
// add to user db with rankings
router.get('/updaterankings', updateRankings_controller.test);
// add to team db with weekly score
router.get('/weekly', updateWeekly_controller.test);
// get weekly high score add to whs db
router.get('/qdb', qdb_controller.test);

router.get('/checker', checker_controller.test);

module.exports = router;