angular.module('giffy')
    .controller('LoginCtrl', ['$scope', '$rootScope', '$location', 'AuthService', 'AUTH_EVENTS',
        function($scope, $rootScope, $location, AuthService, AUTH_EVENTS) {
            $scope.didLoginFail = false;
            $scope.login = function (creds) {
                $scope.didLoginFail = false;
                AuthService
                    .login(creds.username, creds.password)
                    .success(function (user) {
                        $rootScope.$emit(AUTH_EVENTS.loginSucess, user);
                    })
                    .error(function (data, status, headers, conf) {
                        if(data.status === 401) {
                            $scope.didLoginFail = true;
                        }
                    })
            };
        }]);
