var restify = require('restify');
var knox = require('knox');
var crypto = require('crypto');

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
var s3Client = knox.createClient(awsOptions.s3ClientConfig);
s3Client.list({}, function(err, data){
    if(err) {
        console.log('ERROR: There was an issue getting a list of objects from the S3 bucket:');
        console.log(err);
        return;
    }
    for(var i = 0; i < data.Contents.length; ++i) {
        fileNameCache.push(data.Contents[i].Key);
    }
});

// start server, define routes
// TODO: move routes to their own files
var server = restify.createServer();
server.use(restify.queryParser());
// CORS stuff
// TODO: set cors to only accept requests from giffy.dale.io
server.use(restify.CORS({
    credentials: true
}));
server.get('/', function(req, res, next) {
    res.send(fileNameCache);
    next();
});
// taken from https://devcenter.heroku.com/articles/s3-upload-node
server.get('/sign_s3', function(req, res){
    var AWS_ACCESS_KEY = awsOptions.s3ClientConfig.key;
    var AWS_SECRET_KEY = awsOptions.s3ClientConfig.secret;
    var S3_BUCKET = awsOptions.s3ClientConfig.bucket;
    var object_name = req.query.s3_object_name;
    var mime_type = req.query.s3_object_type;

    var now = new Date();
    var expires = Math.ceil((now.getTime() + 10000)/1000); // 10 seconds from now
    var amz_headers = "x-amz-acl:public-read";

    var put_request = "PUT\n\n"+mime_type+"\n"+expires+"\n"+amz_headers+"\n/"+S3_BUCKET+"/"+object_name;

    var signature = crypto.createHmac('sha1', AWS_SECRET_KEY).update(put_request).digest('base64');
    signature = encodeURIComponent(signature.trim());
    signature = signature.replace('%2B','+');

    var url = 'http://'+S3_BUCKET+'.s3.amazonaws.com/'+object_name;

    var credentials = {
        signed_request: url+"?AWSAccessKeyId="+AWS_ACCESS_KEY+"&Expires="+expires+"&Signature="+signature,
        url: url
    };
    res.write(JSON.stringify(credentials));
    res.end();
});


server.listen(apiOptions.port, function() {
    console.log('Server is now online at: %s', server.url);
});