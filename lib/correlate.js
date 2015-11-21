var _     = require('lodash');
var async = require('async');
var jStat = require('jStat').jStat;

module.exports = function(playerGameStats, callback) {
    var sequences = {};
    _.each(_.keys(playerGameStats[0]), function(key) {
        sequences[key] = _.map(playerGameStats, function(p) {
            return p[key];
        }); 
    });


    var corrFncs = _.chain(sequences)
        .map(function(val, key) {
            return function(callback) {
                callback(null, {
                    stat: key,
                    corrcoeff: jStat.corrcoeff(sequences.FantasyPointsFanDuel, val)
                });
            };
        })
        .filter(function(val) {
            return val;
        })
        .value();


    async.series(corrFncs, function(err, results) {
        callback(null, results);
    });
};
