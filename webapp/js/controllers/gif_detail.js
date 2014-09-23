'use strict';

angular.module('giffy')
    .controller('GifDetailCtrl', function($scope, S3Service) {

        S3Service.getGif()


    });