'use strict';

angular.module('giffy')
    .factory('S3Service', ['$http', function($http) {
        function getListOfGifs (){
            return $http({method: 'GET', url: 'http://localhost:8080/'});
        }

        function getGif(name) {
            return $http({method: 'GET', url: 'http://localhost:8080/gifs/' + name});
        }

        function getLatestGifs (){
            //TODO: implement on server
            return $http({method: 'GET', url: 'http://localhost:8080/latest'});
        }

        function registerGifWithAPI () {
            // TODO: make api call to register db entry for img
        }

        return {
            getListOfGifs: getListOfGifs,
            getGif: getGif,
            getLatestGifs: getLatestGifs
        };
    }]);