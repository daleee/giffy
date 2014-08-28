var restify = require('restify');
var knox = require('knox');
var crypto = require('crypto');

// get config options from ./conf/*.js
var apiOptions, awsOptions, dbOptions;
try {
    apiOptions = require('./conf/api');
} catch(e) {
    console.log('ERROR: API configuration is missing!');
    console.log('Please rename conf/api.js.example to conf/api.js and edit the file to your needs.');
    process.exit(1);
}
try {
    awsOptions = require('./conf/aws');
} catch(e) {
    console.log('ERROR: AWS configuration is missing!');
    console.log('Please rename conf/aws.js.example to conf/aws.js and edit the file to your needs.');
    process.exit(1);
}
try {
    dbOptions = require('./conf/db');
} catch(e) {
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

// intialize S3 stuff
// TODO: is it necessary to use this?
//var s3Client = knox.createClient(awsOptions.s3ClientConfig);
//var baseURL = awsOptions.bucketBaseURL;

// create & configure server
var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.CORS({
    credentials: true
}));

require('./routes')(server);

// start server
server.listen(apiOptions.port, function() {
    console.log('Server is now online at: %s', server.url);
});