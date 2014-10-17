var restify = require('restify'),
    crypto = require('crypto'),
    aws = require('aws-sdk'),
    passport = require('passport'),
    shortid = require('shortid');

// get config options from ./conf/*.js
var apiOptions, awsOptions, dbOptions;
try {
    apiOptions = require('./conf/api');
} catch (e) {
    console.log('ERROR: API configuration is missing!');
    console.log('Please rename conf/api.js.example to conf/api.js and edit the file to your needs.');
    process.exit(1);
}
try {
    awsOptions = require('./conf/aws');
} catch (e) {
    console.log('ERROR: AWS configuration is missing!');
    console.log('Please rename conf/aws.js.example to conf/aws.js and edit the file to your needs.');
    process.exit(1);
}
try {
    dbOptions = require('./conf/db');
} catch (e) {
    console.log('ERROR: DB configuration is missing!');
    console.log('Please rename conf/db.js.example to conf/db.js and edit the file to your needs.');
    process.exit(1);
}

// intialzie DB stuff
var knex = require('knex')(dbOptions);
var bookshelf = require('bookshelf')(knex);

// since knex/bookshelf uses connection pool, need to fake a query to check if sql if reachable
knex.raw('select 1+1 as result')
    .then(function (result) {
        // it worked... silent pass!
    })
    .catch(function (error) {
        console.log('ERROR: Could not access your database. Check the config and make sure SQL is running!');
        process.exit(1);
    });

// create & configure server
var server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.queryParser());
//server.use(restify.CORS());
server.pre(function corsMiddleware(req, res, next) {
    //TODO: change to final url/make configurable for peoples
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-type');
    return next();
});
server.opts(/\.*/, function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-type');
    res.send(200);
    return next();
});

var deps = {
    crypto: crypto,
    aws: aws,
    shortid: shortid,
    bookshelf: bookshelf,
    passport: passport,
    server: server
}

var models = require('./models')(bookshelf);
var routes = require('./routes/index.routes.js')(deps, models, awsOptions);

// start server
server.listen(apiOptions.port, function () {
    console.log('Giffy API is now online at: %s', server.url);
});