module.exports = function passportConfig(deps, models) {
    var LocalStrategy = require('passport-local').Strategy,
        passport = deps.passport,
        Promise = deps.bluebird,
        bcrypt = deps.bcrypt,
        User = models.User;

    var verifyCallback = function (username, password, done) {
        User.forge({'email': username})
            .fetch({required: true})
            .then(function (model) {
                var hash = model.get('hash');
                bcrypt.compare(password, hash, function (err, res) {
                    if(res === true) {
                        return done(null, model.toJSON());
                    }
                    else {
                        return done(null, false);

                    }
                });
            })
            .catch(function () {
                return done({'error': 'User not found'});
            })
    };

    passport.use(new LocalStrategy(verifyCallback));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.forge({'id': id})
            .fetch()
            .then(function (model) {
                done(null, model);
            });
    });
};