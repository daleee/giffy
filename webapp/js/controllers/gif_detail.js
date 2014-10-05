'use strict';

angular.module('giffy')
    .controller('GifDetailCtrl', ['$scope', '$routeParams', 'S3Service', function($scope, $routeParams, S3Service) {
        S3Service.getGif($routeParams.name)
            .success(function (data) {
                $scope.url = data.url;
                console.log(data)
            })
            .error(function(data, status, headers,config) {
                //TODO: show error on page
            });
    }]);