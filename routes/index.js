module.exports = function(deps, models, awsOptions){
    "use strict";

    var express = deps.express,
        server = deps.server,
        aws = deps.aws,
        shortid = deps.shortid,
        passport = deps.passport,
        bcrypt = deps.bcrypt,
        bookshelf = deps.bookshelf,
        requiresAuthentication = deps.requiresAuthentication;

    // TODO: move these functions somewhere else
    var isAuthenticated = function (req, res, next) {
        if (requiresAuthentication === true) {
            if (req.session.user) {
                next();
            } else {
                res.status(401).end();
            }
        }
        else {
            next();
        }
    };

    var apiRouter = express.Router();

    apiRouter.get('/latest', function(req, res, next) {
        bookshelf.knex
            .select('*')
            .from('gifs')
            .orderBy('created_at', 'desc')
            .limit(5)
            .then(function (gifs) {
                res.send(gifs);
            })
            .catch(function (error) {
                res.status(500).send(error);
            });
    });

    apiRouter.get('/gifs', function(req, res, next) {
        var page = req.query.page || 0;
        var numPerPage = req.query.numperpage || 25;
        // prevent negative numbers
        // TODO: make sure these are numbers
        page = Math.abs(page);
        numPerPage = Math.abs(numPerPage);

        bookshelf.knex
            .select('*')
            .from('gifs')
            .orderBy('created_at', 'desc')
            .limit(numPerPage)
            .offset(numPerPage * page)
            .then(function (gifs) {
                res.send(gifs);
            })
            .catch(function (error) {
                res.status(500).send(error);
            });

    });

    apiRouter.get('/gifs/count', function(req, res, next) {
        bookshelf.knex('gifs')
            .count('id')
            .then(function (count) {
                res.send(count)
            })
            .catch(function (error) {
                res.status(500).send(error);
            });

    });

    apiRouter.param('gif', function (req, res, next, gif_name) {
        models.Gif
            .forge({name: gif_name})
            .fetch({
                withRelated: ['tags'],
                require: true
            })
            .then(function (gif) {
                req.gif = gif;
                next();
            })
            .catch(function () {
                res.send(404, 'ERROR: GIF not found!');
                next();
            });
    });

    apiRouter.get('/gifs/:gif', function (req, res, next) {
        res.send(req.gif);
    });

    apiRouter.post('/gifs/:gif/tag', isAuthenticated, function (req, res, next) {
        var tag = req.body.tag,
            gif = req.gif;

        if(!tag){
            res.status(400).send('ERROR: Did not a tag!');
            return;
        }

        models.Tag.forge({name: tag}).fetch().then(function (model) {
            if(!model) {
                return gif.tags().create({name: tag});
            }
            else {
                gif.tags().attach(model);
                return model;
            }
        })
            .then(function (tag) {
                res.send(tag);
            })
            .catch(function (err) {
                res.status(500).send(err);
            });
    });

    apiRouter.delete('/gifs/:gif/tag/:tag_id', isAuthenticated, function (req, res, next) {
        var gif = req.gif,
            tag_id = req.params.tag_id;
        // can't figure out how to remove models from collections using join tables
        // with bookshelf, so using knex to do it
        bookshelf.knex('gifs_tags')
            .where({gif_id: gif.id, tag_id: tag_id})
            .del()
            .then(function () {
                res.send(tag_id);
            })
            .catch(function (err) {
                res.status(500).send(err);
            });
    });

    apiRouter.post('/gifs', isAuthenticated, function (req, res, next) {
        var url = req.body.url,
            name = req.body.name;

        if(!url || !name) {
            res.status(400).send('ERROR: Did not receive GIF url or name.');
            return;
        }

        new models.Gif({ url: url , name: name })
            .save()
            .then(function (model) {
                res.send(model.toJSON());
            })
            .catch(function (error) {
                res.status(500).send('ERROR: There was an error saving the new Gif model.')
            });
    });

    apiRouter.param('tag', function (req, res, next, tag_name) {
        models.Tag
            .forge({name: tag_name})
            .fetch({
                withRelated: ['gifs'],
                require: true
            })
            .then(function (tag) {
                req.tag = tag;
                next();
            })
            //.catch(function () {
            //    res.status(404).send('ERROR: Tag not found!');
            //});
    });

    apiRouter.get('/tags', function(req, res, next) {
        new models.Tag()
            .fetchAll()
            .then(function (tags) {
                res.send(tags.toJSON());
            })
            .catch(function (error) {
                res.status(500).send(error);
            });
    });

    apiRouter.get('/tags/:tag', function(req, res, next) {
        res.send(req.tag);
    });
    
    apiRouter.post('/user', function (req, res, next) {
        var email = req.body.email,
            pass = req.body.pass;

        if(!email || !pass) {
            res.status(500).send('ERROR: Did not receive email or password.');
            return;
        }
        var hash = bcrypt.hashSync(pass, 8);
        models.User.forge({email: email, hash: hash})
            .save()
            .then(function (model) {
                res.send(model.omit('hash'));
            })
            .catch(function (error) {
                res.send(400, 'ERROR: This user already exists.');
            })
        
    });

    apiRouter.post('/login',
        function (req, res, next) {
            var username = req.body.username,
                password = req.body.password;
            models.User.forge({'email': username})
                .fetch({required: true})
                .then(function (model) {
                    var hash = model.get('hash');
                    bcrypt.compare(password, hash, function (err, result) {
                        if(result === true) {
                            var user = model.omit('hash');
                            req.session.user = user;
                            res.status(200).send(user);
                        }
                        else {
                            res.status(401).send({'error': 'Invalid password!'});

                        }
                    });
                })
                .catch(function () {
                    res.status(401).send({'error': 'Invalid username or password.'});
                });
        }
    );

    apiRouter.get('/logout', function(req, res){
        if (req.session) {
            req.session = {};
        }
        res.status(200).end();
    });

    // originally from taken from https://devcenter.heroku.com/articles/s3-upload-node
    apiRouter.get('/sign_s3', isAuthenticated, function(req, res, next){
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
                res.status(500).send(err);
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

    var webRouter = express.Router();
    webRouter.get('*', function (req, res, next) {
        if (req.session && req.session.user) {
            req.user = req.session.user;
        }
        //res.sendfile('./public/index.html');
    });

    server.use('/api', apiRouter);
    server.use('/', webRouter);

};