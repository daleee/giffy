angular.module('giffy')
.controller('ApplicationCtrl',['$scope', '$rootScope', '$location', 'AuthService', 'AUTH_EVENTS', function ($scope, $rootScope, $location, AuthService, AUTH_EVENTS) {
        $scope.currentUser = null;

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
