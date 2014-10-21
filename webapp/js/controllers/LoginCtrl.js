'use strict';

angular.module('giffy')
    .controller('LoginCtrl', ['$scope', '$rootScope', '$location', 'AuthService', 'AUTH_EVENTS',
        function($scope, $rootScope, $location, AuthService, AUTH_EVENTS) {
            $scope.login = function (creds) {
                AuthService
                    .login(creds.username, creds.password)
                    .then(function (user) {
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                        $scope.setCurrentUser(user);
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
