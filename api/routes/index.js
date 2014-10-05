"use strict";

module.exports = function(deps, models, awsOptions){
    var server = deps.server,
        crypto = deps.crypto,
        aws = deps.aws,
        shortid = deps.shortid,
        bookshelf = deps.bookshelf;

    server.get('/', function(req, res, next) {
        new models.Gif().fetchAll()
            .then(function (gifs) {
                res.send(gifs.toJSON());
            })
            .catch(function (error) {
                console.log(error);
                res.send(500, 'There was an error');
            });
    });

    server.get('/latest', function(req, res, next) {
        bookshelf.knex
            .select('*')
            .from('gifs')
            .limit(5)
            .then(function (gifs) {
                console.log(gifs);
                res.send(gifs);
            })
            .catch(function (error) {
                console.log(error);
                res.send(500, 'There was an error');
            });
    });

    server.get('/gifs/:name', function (req, res, next) {
        var name = req.params.name;
        if(!name){
            res.send(500, 'Did not receive name!');
            return next();
        }
        new models.Gif({name: name})
            .fetch({required: true})
            .then(function (model) {
                if(!model){
                    res.send(500, "Object not found.");
                    return next();
                }
                res.send(model);
                return next();
            });
    });

    server.post('/gifs', function (req, res, next) {
        var aUrl = req.params.url;
        var aName = req.params.name;
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

        var mime_type = req.query.s3_object_type;
        if(mime_type !== 'image/gif') {
            res.send(400, "ERROR: Expected a gif, but got a " + mime_type + " instead!");
            return next();
        }

        //TODO: check db for newName to ensure no duplicates

        var cannonical_name = shortid.generate();
        var object_name = cannonical_name + ".gif";

        aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
        var s3 = new aws.S3();
        var s3_params = {
            Bucket: S3_BUCKET,
            Key: object_name,
            Expires: 60,
            ContentType: mime_type,
            ACL: 'public-read'
        };
        s3.getSignedUrl('putObject', s3_params, function(err, data){
            if(err){
                console.log(err);
            }
            else{
                var return_data = {
                    signed_request: data,
                    url: 'http://'+S3_BUCKET+'.s3.amazonaws.com/'+object_name,
                    name: cannonical_name
                };
                res.write(JSON.stringify(return_data));
                res.end();
            }
        });
    });
};