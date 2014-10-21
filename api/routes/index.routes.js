module.exports = function(deps, models, awsOptions){
    "use strict";

    var server = deps.server,
        cors = deps.cors,
        aws = deps.aws,
        shortid = deps.shortid,
        passport = deps.passport,
        bcrypt = deps.bcrypt,
        bookshelf = deps.bookshelf;


    server.options('*', cors());
    server.get('/', function(req, res, next) {
        models.Gif
            .fetchAll()
            .then(function (gifs) {
                res.send(gifs.toJSON());
            })
            .catch(function (error) {
                res.send(500, error);
            });
    });

    server.get('/latest', function(req, res, next) {
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

    server.param('gif', function (req, res, next, gif_name) {
        models.Gif.forge({name: gif_name})
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

    server.get('/gifs/:gif', function (req, res, next) {
        res.send(req.gif);
    });

    server.post('/gifs/:gif/tag', function (req, res, next) {
        var tag = req.body.tag,
            gif = req.gif;

        console.log(tag);
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

    server.delete('/gifs/:gif/tag/:tag_id', function (req, res, next) {
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

    server.post('/gifs', function (req, res, next) {
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


    // user stuff
    server.post('/user', function (req, res, next) {
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

    server.post('/login',
        passport.authenticate('local'),
        function (req, res, next) {
            console.log(req.session);
            res.status(200).send(req.user);
        }
    );

    server.get('/logout', function(req, res){
        req.logout();
        res.status(200).end();
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
};