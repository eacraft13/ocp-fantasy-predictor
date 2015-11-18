var _        = require('lodash');
var jStat    = require('jStat').jStat;
var r        = require('rethinkdb');
var rOptions = require('./config/rethinkdb');




r.connect(rOptions.connection, function(err, conn) {
    if (err) throw err;

    conn.use(rOptions.db);

    r.table('season_league_leaders')
    .filter({
        Season: 2015,
        Position: 'QB'
    })
    .run(conn, function(err, cursor) {
        cursor.each(function(err, row) {
            if (err) throw err;
            console.log(row.FantasyPointsFanDuel);
        });
    });
});
