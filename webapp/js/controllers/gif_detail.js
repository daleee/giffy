'use strict';

angular.module('giffy')
    .controller('GifDetailCtrl', function($scope, $routeParams, S3Service) {
        var name = $routeParams.name;

        S3Service.getGif(name)
            .success(function (data) {
                $scope.url = data.url;

            })
            .error(function(data, status, headers,config) {
                //TODO: show error on page
            });
    });