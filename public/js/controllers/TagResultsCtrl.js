'use strict';

angular.module('giffy')
    .controller('TagResultsCtrl', ['$scope', '$routeParams', 'S3Service', function($scope, $routeParams, S3Service) {
        $scope.gifList = [];

        var imageRequester = function() {
            S3Service
                .getGifsWithTag($routeParams.name)
                .success(function(data) {
                    $scope.gifList = data.gifs;
                });
        };

        imageRequester();
    }]);