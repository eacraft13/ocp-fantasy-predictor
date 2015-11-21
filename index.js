#!/usr/bin/env node

var _         = require('lodash');
var correlate = require('./lib/correlate');
var program   = require('commander');
var r         = require('rethinkdb');
var rOptions  = require('./config/rethinkdb');


program
.version('0.0.1')
.option('-p --position <position>', 'Player\'s  position', /^(qb|rb|wr|te|k|d)$/i, 'qb')
.option('-s --season   <season>',   'Player\s season',     /^(2015|2014|2013)$/i, '2015')
.option('-t --table    <table>',    'Table to query',      /./i, 'player_game_stats')
.parse(process.argv);

console.log(program.position, program.season, program.table);

r.connect(rOptions.connection, function(err, conn) {
    if (err) throw err;

    conn.use(rOptions.db);

    r
    .table(program.table)
    .filter({
        Season: +program.season,
        Position: program.position.toUpperCase()
    })
    .run(conn, function(err, cursor) {
        cursor.toArray(function(err, results) {
            console.log(results[0]);
            if (err) throw err;
            correlate(results, function(err, data) {
                var display = _.chain(data)
                    .filter(function(val) {
                        return val.corrcoeff;
                    })
                    .sortBy(function(val) {
                        return Math.abs(val.corrcoeff);
                    })
                    .value();
                console.log(display);
                process.exit();
            });
        });
    });
});
