angular.module('giffy')
    .service('SessionService', [function () {
        this.create = function (user, createCookie) {
            this.id = user.id;
            this.userId = user.email;
            if (createCookie === true) {
                Cookies.set('user', JSON.stringify(user), {
                    expires: 1800
                });
            }
        };

        this.destroy = function () {
            this.id = null;
            this.userId = null;
            Cookies.expire('user');
        };

        return this;
    }]);
