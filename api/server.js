var restify = require('restify');
var s3 = require('s3');

// get config files from ./conf/
var apiOptions;
try {
    apiOptions = require('./conf/api');
} catch(e) {
    console.log('ERROR: API configuration is missing!');
    console.log('Please rename conf/api.js.example to conf/api.js and edit the file to your needs.');
    process.exit(1);
}
var awsOptions;
try {
    awsOptions = require('./conf/aws');
} catch(e) {
    console.log('ERROR: AWS configuration is missing!');
    console.log('Please rename conf/aws.js.example to conf/aws.js and edit the file to your needs.');
    process.exit(1);
}

// get file names from S3
var fileNameCache = [];
var s3_client = s3.createClient(awsOptions.s3ClientConfig);
var objectLister = s3_client.listObjects(awsOptions.s3ListObjectConfig);
objectLister.on('error', function(err) {
    console.log('ERROR: There was an issue getting a list of objects from the S3 bucket:');
    console.log(err);
});
objectLister.on('data', function(data) {
    for(var i = 0; i < data.Contents.length; ++i) {
        fileNameCache.push(data.Contents[i].Key);
    }
});

// start server, define routes
// TODO: move routes to their own files
var server = restify.createServer();
server.get('/', function(req, res, next) {
    res.send(fileNameCache);
    next();
});

server.listen(apiOptions.port, function() {
    console.log('Server is now online at: %s', server.url);
});