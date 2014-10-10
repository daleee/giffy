'use strict';

angular.module('giffy')
    .controller('GifDetailCtrl', ['$scope', '$routeParams', 'S3Service', function($scope, $routeParams, S3Service) {
        $scope.addTag = function (tag_name) {
            if(!tag_name) return; //TODO: show error saying 'pls give name'
            S3Service.addTagToGif($routeParams.name, tag_name)
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
                    console.log('wooo!');
                    $scope.tags = data;
                })
                .error(function (data, status, headers, config) {
                    //TODO: error stuff here too
                });
        };

        S3Service.getGif($routeParams.name)
            .success(function (data) {
                $scope.url = data.url;
                $scope.tags = data.tags;
            })
            .error(function(data, status, headers,config) {
                //TODO: show error on page
            });
    }]);