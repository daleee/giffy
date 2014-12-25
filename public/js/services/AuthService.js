angular.module('giffy')
    .factory('AuthService', ['$rootScope', '$http', 'SessionService', 'CONFIG', 'AUTH_EVENTS',
        function($rootScope, $http, Session, CONFIG, AUTH_EVENTS) {
            var authService = {};

            authService.requiresAuthentication = false;

            authService.createUser = function createUser (email, pass){
                return $http
                    .post(CONFIG.apiEndpoint + '/user', {email: email, pass: pass})
                    .success(function (data) {
                        Session.create(data, true);
                        return data;
                    });
            };

            authService.login = function login (email, pass){
                return $http
                    .post(CONFIG.apiEndpoint + '/login', {username: email, password: pass})
                    .success(function (data) {
                        Session.create(data, true);
                        return data;
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
                var userSessionData = Cookies.get('user');
                if(userSessionData) {
                    var parsedUserData = JSON.parse(userSessionData);
                    Session.create(parsedUserData);
                    $rootScope.$emit(AUTH_EVENTS.loginSession, parsedUserData);
                }
            };

            return authService;
        }]);
