'use strict';

angular.module('giffy')
    .controller('MainCtrl', ['$scope', '$location', '$route', 'S3Service', function($scope, $location, $route, S3Service) {
        $scope.gifList = [];
        $scope.$route = $route;

        S3Service.getLatestGifs()
            .success(function(data){
                if($scope.errors) { // clear out any previous errors
                    $scpoe.errors = "";
                }
                $scope.gifList = data;
            })
            .error(function(data, status, headers,config) {
                $scope.errors = "ERROR: The API is down! I repeat, the API is down!";
            });

    }]);
