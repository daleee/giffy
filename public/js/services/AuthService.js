angular.module('giffy')
    .factory('AuthService', ['$http', 'SessionService', 'CONFIG', function($http, Session, CONFIG) {
        var authService = {};

        authService.createUser = function createUser (email, pass){
            return $http
                .post(CONFIG.apiEndpoint + '/user', {email: email, pass: pass})
                .then(function (res) {
                    Session.create(res.data.id, res.data.email);
                    return res.data;
                });
        };

        authService.login = function login (email, pass){
            return $http
                .post(CONFIG.apiEndpoint + '/login', {username: email, password: pass})
                .then(function (res) {
                    Session.create(res.data.id, res.data.email);
                    return res.data;
                });
        };

        authService.logout = function login (){
            return $http
                .get(CONFIG.apiEndpoint + '/logout')
                .then(function (res) {
                    Session.destroy();
                });
        };

        authService.isAuthenticated = function () {
            return !!Session.userId;
        };

        return authService;
    }]);
