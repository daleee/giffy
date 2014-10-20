'use strict';

angular.module('giffy')
    .factory('AuthService', ['$http', function($http) {
        $http.defaults.useXDomain = true;
        var createUser = function createUser (email, pass){
            return $http.post('http://localhost:8080/user', {email: email, pass: pass});
        };
        var login = function login (email, pass){
            return $http.post('http://localhost:8080/login', {username: email, password: pass});
        };

        return {
            createUser: createUser,
            login: login
        };
    }]);
