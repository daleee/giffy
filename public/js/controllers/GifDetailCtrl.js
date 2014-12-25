'use strict';

angular.module('giffy')
    .controller('GifDetailCtrl', ['$scope', '$routeParams', 'S3Service', 'AuthService', function($scope, $routeParams, S3Service, AuthService) {
        $scope.tags = [];
        $scope.isAuthenticated = function() {
            if (AuthService.requiresAuthentication === false) {
                return true;
            }
            else {
                return AuthService.isAuthenticated();
            }
        };

        $scope.addTag = function () {
            if(!$scope.tag_name) return; //TODO: show error saying 'pls give name'
            S3Service.addTagToGif($routeParams.name, $scope.tag_name)
                .success(function (data) {
                    $scope.tags.push(data);
                    $scope.tag_name = '';
                })
                .error(function (data, status, headers, config) {
                    //TODO: error stuff hurr
                });
        };

        $scope.removeTag = function (tag_id) {
            if(!tag_id) return;
            S3Service.removeTagFromGif($routeParams.name, tag_id)
                .success(function (data) {
                    $scope.tags.map(function (currentVal, index, array) {
                        if(currentVal.id === tag_id) {
                            $scope.tags.splice(index, 1);
                        }
                    });
                })
                .error(function (data, status, headers, config) {
                    //TODO: error stuff here too
                });
        };

        S3Service.getGif($routeParams.name)
            .success(function (data) {
                $scope.url = data.url;
                $scope.tags = data.tags;
                $scope.giffyUrl = window.location.href;
            })
            .error(function(data, status, headers,config) {
                //TODO: show error on page
            });
    }]);