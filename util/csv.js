var csv      = require('fast-csv');
var r        = require('rethinkdb');
var rOptions = require('../config/rethinkdb');

r.connect(rOptions.connection, function(err, conn) {
    conn.use(rOptions.db);

    r
    .table('player_game_stats')
    .filter({
        Season: 2015,
        Position: 'WR',
        Activated: 1,
        Played: 1
    })
    .run(conn)
    .error(err)
    .then(function(cursor) {
        cursor
        .toArray()
        .error(err)
        .then(function(results) {
            csv
            .writeToPath('wrs.csv', results, { headers: true })
            .on('finish', function() {
                console.log('Success!');
                process.exit();
            });
        });
    });

});

function err(e) {
    throw e;
}
