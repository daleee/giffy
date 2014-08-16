'use strict';

var giffy = angular.module('giffy', ['ngRoute']);

giffy.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);

// TODO: move to own file
giffy.factory('S3Service', function($http) {
    function getListOfGifs (){
        return $http({method: 'GET', url: 'http://localhost:8080/'});
    }

    function registerGifWithAPI () {
        // TODO: make api call to register db entry for img
    }

    return {
        getListOfGifs: getListOfGifs,
        registerGifWithAPI: registerGifWithAPI
    };
});
