const Score = require('../models/score');
const Team = require('../models/team');
const User = require('../models/user');
const Whs = require('../models/whs');

exports.test = function (req, res) {



    Team.find({}, function (err, teams) {
        teams.forEach(function (team) {
            console.log(Object.keys(team.weeklyScore))
            if (Object.keys(team.weeklyScore).length < 3) {
                console.log(team.guid, team.leagueId)
            }
        })
    })

    // check each league size

    var teamList = {}
    //console.log(weeklyScoresList)
    Team.find({}, function (err, teams) {
        teams.forEach(function (team) {
            // console.log(team.leagueId)
            if (team.leagueId == 193374) {
                //console.log(team);
            }
            if (!teamList[team.leagueId]) {
                teamList[team.leagueId] = 1
            } else {
                teamList[team.leagueId] += 1
            }
        })
        console.log(teamList)

    })

    var list = [];
    User.find({}, function (err, users) {
        users.forEach(function (user) {

            if (list.includes(user.leagueName)) {
                //console.log(user)
            }
            list.push(user.leagueName);
        })
    })






}