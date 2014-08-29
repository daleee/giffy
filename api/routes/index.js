module.exports = function(server, models){
    "use strict";
    server.get('/', function(req, res, next) {
        new models.Gif().fetchAll()
            .then(function (gifs) {
                res.send(gifs.toJSON());
            })
            .catch(function (error) {
                console.log(error);
                res.send(500, 'There was an error');
            })
    });

    server.post('/gifs', function (req, res, next) {
        var fn = req.params.filename;
        res.send({
            filename: fn
        });
        next();
    });

    // originally from taken from https://devcenter.heroku.com/articles/s3-upload-node
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
};