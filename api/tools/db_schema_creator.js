// get db config options from ./conf/db.js
var dbOptions;
try {
    dbOptions = require('../conf/db');
} catch(e) {
    console.log('ERROR: DB configuration is missing!');
    console.log('Please rename conf/db.js.example to conf/db.js and edit the file to your needs.');
    process.exit(1);
}

var knex = require('knex')(dbOptions);

// since knex uses connection pool, need to fake a query to check if sql if reachable
knex.raw('select 1+1 as result')
    .then(function (result) {
        // it worked... silent pass!
    })
    .catch(function (error) {
        console.log('ERROR: Could not access your database. Check the config and make sure SQL is running!');
        process.exit(1);
    });

// create tables
knex.schema.createTable('gifs', function (table) {
    table.increments();
    table.string('filename', 100);
    table.timestamp('uploaded_at');
}).then(function () {
    console.log('All tables created successfully!');
    knex.destroy();
});
