angular.module('giffy')
    .service('SessionService', ['$cookieStore', function ($cookieStore) {
        this.create = function (sessionId, userId) {
            this.id = sessionId;
            this.userId = userId;
        };

        this.destroy = function () {
            this.id = null;
            this.userId = null;
        };

        return this;
    }]);
