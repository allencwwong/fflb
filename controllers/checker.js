const Score = require('../models/score');
const Team = require('../models/team');
const User = require('../models/user');
const Whs = require('../models/whs');

exports.test = function (req, res) {


    // check each league size

    Team.find({}, function (err, teams) {
        teams.forEach(function (team) {
            console.log(Object.keys(team.weeklyScore))
            if (Object.keys(team.weeklyScore).length < 3) {
                console.log(team.guid, team.leagueId)
            }
        })
    })

    Team.find({}, function (err, teams) {
        var guids = [];
        var guidsDup = {}

        teams.forEach(function (team) {
            if (guids.includes(team.guid)) {
                if (guidsDup[team.guid]) {
                    guidsDup[team.guid]['count'] += 1;
                } else {
                    guidsDup[team.guid] = {};
                    guidsDup[team.guid]['count'] = 1;
                    guidsDup[team.guid]['lid'] = team.leagueName;
                    guidsDup[team.guid]['name'] = team.manager;
                }
            } else {
                guids.push(team.guid)
            }
        })
        console.log(guidsDup);
    })

    // var teamList = {}
    // //console.log(weeklyScoresList)
    // Team.find({}, function (err, teams) {
    //     teams.forEach(function (team) {
    //         // console.log(team.leagueId)
    //         if (team.leagueId == 193374) {
    //             //console.log(team);
    //         }
    //         if (!teamList[team.leagueId]) {
    //             teamList[team.leagueId] = 1
    //         } else {
    //             teamList[team.leagueId] += 1
    //         }
    //     })
    //     console.log(teamList)

    // })

    // var list = [];
    // User.find({}, function (err, users) {
    //     users.forEach(function (user) {

    //         if (list.includes(user.leagueName)) {
    //             //console.log(user)
    //         }
    //         list.push(user.leagueName);
    //     })
    // })






}