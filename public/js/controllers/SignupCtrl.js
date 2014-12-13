angular.module('giffy')
    .controller('SignUpCtrl', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
        $scope.createUser = function (creds) {
            AuthService
                .createUser(creds.username, creds.password)
                .then(function (resp) {
                    $location.path('/');
                })
        };
    }]);
