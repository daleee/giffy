'use strict';

angular.module('giffy')
    .factory('AuthService', ['$http', 'SessionService', 'CONFIG', function($http, Session, CONFIG) {
        var authService = {};

        authService.createUser = function createUser (email, pass){
            return $http
                .post(CONFIG.apiEndpoint + '/user', {email: email, pass: pass})
                .then(function (res) {
                    // TODO: create session
                    return res.data;
                });
        };

        authService.login = function login (email, pass){
            return $http
                .post(CONFIG.apiEndpoint + '/login', {username: email, password: pass})
                .then(function (res) {
                    // TODO: create session
                    return res.data;
                });
        };

        authService.logout = function login (){
            return $http
                .get(CONFIG.apiEndpoint + '/logout')
                .then(function (res) {
                    // TODO: create session
                    Session.destroy();
                });
        };

        authService.isAuthenticated = function () {
            return !!Session.userId;
        };

        return authService;
    }]);
