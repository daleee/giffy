angular.module('giffy')
    .controller('LoginCtrl', ['$scope', '$rootScope', '$location', 'AuthService'/*, 'AUTH_EVENTS'*/,
        function($scope, $rootScope, $location, AuthService/*, AUTH_EVENTS*/) {
            $scope.didLoginFail = false;
            $scope.login = function (creds) {
                $scope.didLoginFail = false;
                AuthService
                    .login(creds.username, creds.password)
                    .then(function (user) {
                        //$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                        $scope.setCurrentUser(user);
                        $location.path('/');
                    })
                    .catch(function (data, status, headers, conf) {
                        $scope.didLoginFail = true;
                        if(data.status === 401) {
                            // show incorrect creds error
                            console.log('401: Incorrect credentials.');
                        }
                    })
            };
        }]);
