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
knex.schema.createTable('users', function (table) {
    table.increments(); // pk / id
    table.string('username', 20).notNullable().unique();
    table.string('email', 30).notNullable().unique();
    table.timestamp('created_at');
}).then(function () {
    return knex.schema.createTable('gifs', function (table) {
        table.increments();
        table.string('url').notNullable().unique();
        table.timestamps();
    });
}).then(function () {
    return knex.schema.createTable('tags', function (table) {
        table.increments();
        table.string('name').notNullable().unique();
    });
}).then(function () {
    console.log('All tables created!');
    knex.destroy();
}).catch(function (error) {
    console.log('There was an error creating the tables:');
    console.log(error);
});
