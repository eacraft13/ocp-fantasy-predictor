var _     = require('lodash');
var async = require('async');
var jStat = require('jStat').jStat;

module.exports = function(leagueLeaders, callback) {
    var fantasyPointsFanDuel = _.map(leagueLeaders, function(ll) {
        return ll.FantasyPointsFanDuel;
    });

    var sequences = {};
    _.each(_.keys(leagueLeaders[0]), function(key) {
        sequences[key] = _.map(leagueLeaders, function(ll) {
            return ll[key];
        }); 
    });


    var corrFncs = _.chain(sequences)
        .map(function(val, key) {
            if (_.all(val, Number))
                return function(callback) {
                    callback(null, {
                        stat: key,
                        corrcoeff: jStat.corrcoeff(fantasyPointsFanDuel, val)
                    });
                };
        })
        .filter(function(val) {
            return val;
        })
        .value();


    //async.series(_.slice(corrFncs, 0, 4), function(err, results) {
    async.series(corrFncs, function(err, results) {
        callback(null, results);
    });
};
