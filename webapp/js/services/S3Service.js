'use strict';

angular.module('giffy')
    .factory('S3Service', ['$http', function($http) {
        $http.defaults.useXDomain = true;
        function getListOfGifs (){
            return $http({method: 'GET', url: 'http://localhost:8080/'});
        }

        function getGif(name) {
            return $http({method: 'GET', url: 'http://localhost:8080/gifs/' + name});
        }

        function getLatestGifs (){
            return $http({method: 'GET', url: 'http://localhost:8080/latest'});
        }

        function addTagToGif(gif_name, tag_id) {
            return $http.post('http://localhost:8080/gifs/' + gif_name + '/tag', {tag: tag_id});
        }

        function removeTagFromGif(gif_name, tag_id) {
            return $http.delete('http://localhost:8080/gifs/' + gif_name + '/tag/' + tag_id);
        }

        function registerGifWithAPI () {
            // TODO: make api call to register db entry for img
        }

        return {
            getListOfGifs: getListOfGifs,
            getGif: getGif,
            getLatestGifs: getLatestGifs,
            addTagToGif: addTagToGif,
            removeTagFromGif: removeTagFromGif
        };
    }]);