'use strict';

var giffy = angular.module('giffy', ['ngRoute']);

giffy.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/gifs', {
                templateUrl: 'views/gif_list.html',
                controller: 'GifListCtrl'
            })
            .when('/gifs/:name', {
                templateUrl: 'views/gif_detail.html',
                controller: 'GifDetailCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
