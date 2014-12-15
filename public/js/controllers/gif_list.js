'use strict';

angular.module('giffy')
    .controller('GifListCtrl', ['$scope', '$location', 'S3Service', function($scope, $location, S3Service) {
        var qs = $location.search();
        $scope.gifList = [];
        $scope.currentPage = qs.page || 0;
        $scope.numPerPage = qs.numperpage || 25;
        $scope.gifTotal = 0;

        var imageRequester = function() {
            S3Service
                .getListOfGifs($scope.currentPage, $scope.numPerPage)
                .success(function(data) {
                    $scope.gifList = data;
                });
        };

        imageRequester();

        $scope.loadPrevPage = function() {
            if ($scope.currentPage > 0) {
                $scope.currentPage -= 1;
                imageRequester();
            }
        };

        $scope.loadNextPage = function() {
            if ($scope.gifList && $scope.gifList.length > $scope.numPerPage) {
                $scope.currentPage += 1;
                imageRequester();
            }
        };


    }]);