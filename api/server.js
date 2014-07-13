// CONFIG START
var port = 8080;
// CONFIG END

var restify = require('restify');
var s3 = require('s3');

var s3ClientOptions;
try {
    awsOptions = require('./conf/aws');
} catch(e) {
    console.log('ERROR: API configuration is missing!');
    console.log('Please rename conf/api.js.example to conf/api.js and edit the file to your needs.');
    process.exit(1);
}

var listParams = {
    recursive: false,
    s3Params: {
        Bucket: 'gifs.dale.io'
    }
};

var server = restify.createServer();
var s3_client = s3.createClient(awsOptions.s3ClientConfig);

var fileNames = [];

var objectLister = s3_client.listObjects(listParams);
objectLister.on('error', function(err) {
    console.log('ERROR: There was an issue getting a list of objects from the S3 bucket:');
    console.log(err);
});
objectLister.on('data', function(data) {
    for(var i = 0; i < data.Contents.length; ++i) {
        fileNames.push(data.Contents[i].Key);
    }
});

// ROUTE START
server.get('/', function(req, res, next) {
    res.send(fileNames);
    next();
});
// ROUTE END

server.listen(port, function() {
    console.log('Server is now online at: %s', server.url);
});