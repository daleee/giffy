angular.module('giffy')
    .factory('AuthService', ['$rootScope', '$http', '$cookieStore', 'SessionService', 'CONFIG', 'AUTH_EVENTS', function($rootScope, $http, $cookieStore, Session, CONFIG, AUTH_EVENTS) {
        var authService = {};

        authService.createUser = function createUser (email, pass){
            return $http
                .post(CONFIG.apiEndpoint + '/user', {email: email, pass: pass})
                .then(function (res) {
                    Session.create(res.data);
                    return res.data;
                });
        };

        authService.login = function login (email, pass){
            return $http
                .post(CONFIG.apiEndpoint + '/login', {username: email, password: pass})
                .then(function (res) {
                    Session.create(res.data);
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

        authService.initialize = function() {
            var userSessionData = $cookieStore.get('user');
            if(userSessionData) {
                var parsedUserData = JSON.parse(userSessionData);
                Session.create(parsedUserData);
                $rootScope.$emit(AUTH_EVENTS.loginSession, parsedUserData);
            }
        };

        return authService;
    }]);
