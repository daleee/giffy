var express = require('express'),
    app = express(),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('client-sessions'),
    morgan = require('morgan'),
    aws = require('aws-sdk'),
    shortid = require('shortid'),
    bcrypt = require('bcrypt');

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

// intialzie express middlewares
var env = process.env.NODE_ENV || 'development';
if ('development' === env) {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}
app.use(express.static('public'));
app.use('/bower_components', express.static(__dirname + '/public/bower_components'));
app.use(cookieParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(session({
    cookieName: 'session',
    secret: 'ilovejuuuuuuuice!!!!1',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
}));

// intialzie DB stuff
var knex = require('knex')(dbOptions);
var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry'); // load model registry plugin

// since knex/bookshelf uses connection pool, need to fake a query to check if sql if reachable
knex.raw('select 1+1 as result')
    .then(function (result) {
        // it worked... silent pass!
    })
    .catch(function (error) {
        console.log('ERROR: Could not access your database. Check the config and make sure SQL is running!');
        process.exit(1);
    });

var deps = {
    aws: aws,
    shortid: shortid,
    bookshelf: bookshelf,
    bcrypt: bcrypt,
    express: express,
    server: app,
    requiresAuthentication: apiOptions.requiresAuthentication
};

var models = require('./models')(bookshelf);
var routes = require('./routes')(deps, models, awsOptions);

// start server
var port = process.env.PORT || apiOptions.port || 5000;
var server = app.listen(port, function () {
    console.log('Giffy API is now online at: %s:%s',
        server.address().address,
        server.address().port);
});