module.exports = function(server, crypto, models, awsOptions){
    "use strict";
    var shortid = require('shortid');
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
        var aUrl = req.params.url;
        var aName = req.params.name;
        console.log(req.params);
        if(!aUrl || !aName) {
            res.send(500, 'Did not receive url or name!');
            return next();
        }

        new models.Gif({ url: aUrl , name: aName })
            .save()
            .then(function (model) {
                res.send(model.toJSON());
            })
            .catch(function (error) {
                res.send('ERROR: There was an error saving the new Gif!g model');
            });

        return next();
    });

    // originally from taken from https://devcenter.heroku.com/articles/s3-upload-node
    server.get('/sign_s3', function(req, res, next){
        var AWS_ACCESS_KEY = awsOptions.s3ClientConfig.key;
        var AWS_SECRET_KEY = awsOptions.s3ClientConfig.secret;
        var S3_BUCKET = awsOptions.s3ClientConfig.bucket;
        var object_name = req.query.s3_object_name;
        var mime_type = req.query.s3_object_type;

        if(!object_name || !mime_type) {
            res.send(500, "ERROR: Expected object name and mime type to be send as arguments!");
            res.end();
            return next();
        }

        var now = new Date();
        var expires = Math.ceil((now.getTime() + 10000)/1000); // 10 seconds from now
        var amz_headers = "x-amz-acl:public-read";

        //TODO: check db for newName to ensure no duplicates
        object_name = shortid.generate() + ".gif";

        var put_request = "PUT\n\n"+mime_type+"\n"+expires+"\n"+amz_headers+"\n/"+S3_BUCKET+"/"+object_name;

        var signature = crypto.createHmac('sha1', AWS_SECRET_KEY).update(put_request).digest('base64');
        signature = encodeURIComponent(signature.trim());
        signature = signature.replace('%2B','+');

        var url = 'http://'+S3_BUCKET+'.s3.amazonaws.com/'+object_name;

        var credentials = {
            signed_request: url+"?AWSAccessKeyId="+AWS_ACCESS_KEY+"&Expires="+expires+"&Signature="+signature,
            url: url,
            name: object_name
        };
        res.write(JSON.stringify(credentials));
        res.end();
    });
};