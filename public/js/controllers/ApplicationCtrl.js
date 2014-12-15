angular.module('giffy')
.controller('ApplicationCtrl',['$scope', '$route', '$rootScope', '$location', 'AuthService', 'AUTH_EVENTS', function ($scope, $route, $rootScope, $location, AuthService, AUTH_EVENTS) {
        $scope.currentUser = null;
        $scope.$route = $route;

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        };

        $scope.logOut = function () {
            AuthService
                .logout()
                .then(function () {
                    $scope.setCurrentUser(null);
                    $location.path('/');
                });
        };

        $rootScope.$on(AUTH_EVENTS.loginSucess, function(event, user) {
            $scope.setCurrentUser(user);
            $location.path('/');
        });

        $rootScope.$on(AUTH_EVENTS.loginSession, function(event, user) {
            $scope.setCurrentUser(user);
        });

        AuthService.initialize();
    }]
);
