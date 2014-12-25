var giffy = angular.module('giffy', ['ngRoute']);
giffy.config(['$routeProvider', '$locationProvider',

    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                activeTab: 'home'
            })
            .when('/gifs', {
                templateUrl: 'views/gif_list.html',
                controller: 'GifListCtrl',
                activeTab: 'gifs'
            })
            .when('/gifs/:name', {
                templateUrl: 'views/gif_detail.html',
                controller: 'GifDetailCtrl',
                activeTab: 'gifs'
            })
            .when('/tags/:name', {
                templateUrl: 'views/tag_results.html',
                controller: 'TagResultsCtrl',
                activeTab: 'gifs'
            })
            .when('/create', {
                templateUrl: 'views/gif_creator.html',
                controller: 'GifCreatorCtrl',
                activeTab: 'gifs'
            })
            .when('/signup', {
                templateUrl: 'views/signup.html',
                controller: 'SignUpCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/lib/gifjs/gif.worker.js', {
                templateUrl: 'lib/gifjs/gif.worker.js'
            })
            //.otherwise({
            //    redirectTo: '/'
            //});

        $locationProvider.html5Mode(true);
    }]);
