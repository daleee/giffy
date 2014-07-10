// CONFIG START
var port = 8080;
// CONFIG END

var restify = require('restify');
var s3 = require('s3');

var server = restify.createServer();

server.listen(port, function() {
    console.log('Server is now online at: %s', server.url);
});