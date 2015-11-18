var _           = require('lodash');
var llCorrelate = require('./lib/league_leaders/correlate');
var r           = require('rethinkdb');
var rOptions    = require('./config/rethinkdb');




r.connect(rOptions.connection, function(err, conn) {
    if (err) throw err;

    conn.use(rOptions.db);

    r.table('season_league_leaders')
    .filter({
        Season: 2015,
        Position: 'QB'
    })
    .run(conn, function(err, cursor) {
        cursor.toArray(function(err, results) {
            if (err) throw err;
            llCorrelate(results, function(err, data) {
                console.log(data);
                process.exit();
            });
        });
    });
});
