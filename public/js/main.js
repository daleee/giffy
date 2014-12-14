var giffy = angular.module('giffy', ['ngRoute', 'ngCookies']);

giffy.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
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
            .when('/signup', {
                templateUrl: 'views/signup.html',
                controller: 'SignUpCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
    }]);
