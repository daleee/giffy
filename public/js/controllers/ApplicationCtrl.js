angular.module('giffy')
.controller('ApplicationCtrl',['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {
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
        }
    }]
);
