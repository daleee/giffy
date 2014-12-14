angular.module('giffy')
    .service('SessionService', ['$cookieStore', function ($cookieStore) {
        this.create = function (user) {
            this.id = user.id;
            this.userId = user.email;
            $cookieStore.put('user', JSON.stringify(user));
        };

        this.destroy = function () {
            this.id = null;
            this.userId = null;
            $cookieStore.remove('user');
        };

        return this;
    }]);
