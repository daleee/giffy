'use strict';

angular.module('giffy')
    .controller('LoginCtrl', ['$scope', '$rootScope', '$location', 'AuthService',
        function($scope, $rootScope, $location, AuthService) {
            $scope.login = function (creds) {
                AuthService
                    .login(creds.username, creds.password)
                    .then(function (res) {
                        $rootScope.$broadcast('HI');
                        $location.path('/');
                    })
                    .catch(function (data, status, headers, conf) {
                        if(data.status === 401) {
                            // show incorrect creds error
                            console.log('401: Incorrect credentials.');
                        }
                    })
            };
        }]);
