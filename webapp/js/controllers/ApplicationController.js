'use strict';

angular.module('giffy')
.controller('ApplicationController',['$scope', 'AuthService', function ($scope, AuthService) {
        $scope.currentUser = null;

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        };

        $scope.logOut = function () {
            AuthService
                .logout()
                .then(function () {
                    console.log('done');
                });
        }
    }]
);