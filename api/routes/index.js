module.exports = function(deps, models, awsOptions){
    "use strict";

    var express = deps.express,
        server = deps.server,
        aws = deps.aws,
        shortid = deps.shortid,
        bookshelf = deps.bookshelf;

    var router = express.Router();
    router.get('/', function(req, res, next) {
        new models.Gif().fetchAll()
            .then(function (gifs) {
                res.send(gifs.toJSON());
            })
            .catch(function (error) {
                res.send(500, error);
            });
    });

    router.get('/latest', function(req, res, next) {
        bookshelf.knex
            .select('*')
            .from('gifs')
            .orderBy('created_at', 'desc')
            .limit(5)
            .then(function (gifs) {
                res.send(gifs);
            })
            .catch(function (error) {
                res.send(500, error);
            });
    });

    router.get('/gifs/:name', function (req, res, next) {
        var name = req.params.name;
        if(!name){
            res.send(500, 'Did not receive name!');
            return next();
        }
        new models.Gif({name: name})
            .fetch({
                withRelated: ['tags']
            })
            .then(function (model) {
                if(!model){
                    res.send(500, "Object not found.");
                }
                res.send(model);
            });
    });

    router.post('/gifs/:name/tag', function (req, res, next) {
        var name = req.params.name;
        var tag = req.params.tag;
        if(!name || !tag) {
            res.send(500, 'Did not recieve name or tag array!');
            return;
        }

        models.Gif.forge({name: name})
            .fetch({require: true})
            .then(function (gif) {
                return models.Tag.forge({name: tag}).fetch().then(function (model) {
                    if(!model) {
                        return gif.tags().create({name: tag});
                    }
                    else {
                        gif.tags().attach(model)
                        return model;
                    }
                });
            })
            .then(function (tag) {
                res.send(tag);
            })
            .catch(function (err) {
                res.send(500, err);
            });
    });

    router.delete('/gifs/:name/tag/:tag_id', function (req, res, next) {
        var name = req.params.name;
        var tag_id = req.params.tag_id;
        if(!name || !tag_id) {
            res.send(500, 'Did not receive GIF id or tag id!');
            return next();
        }

        // can't figure out how to remove models from collections using join tables
        // with bookshelf, so using knex to do it
        models.Gif.forge({name: name})
            .fetch({require: true})
            .then(function (gif) {
                return bookshelf.knex('gifs_tags')
                    .where({gif_id: gif.id, tag_id: tag_id})
                    .del();
            })
            .then(function (tag_id) {
                res.send(200, tag_id);
                return next();
            })
            .catch(function (err) {
                res.send(500, err);
                return next();

            })
    });

    router.post('/gifs', function (req, res, next) {
        var url = req.params.url;
        var name = req.params.name;
        if(!url || !name) {
            res.send(500, 'Did not receive url or name!');
            return next();
        }

        new models.Gif({ url: url , name: name })
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
    router.get('/sign_s3', function(req, res, next){
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
                res.send(500, err)
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

    server.use('/api', router);
};