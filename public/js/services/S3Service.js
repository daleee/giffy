'use strict';

angular.module('giffy')
    .factory('S3Service', ['$http', 'CONFIG', function($http, CONFIG) {
        $http.defaults.useXDomain = true;
        function getListOfGifs (){
            return $http.get(CONFIG.apiEndpoint + '/');
        }

        function getGif(name) {
            return $http.get(CONFIG.apiEndpoint + '/gifs/' + name);
        }

        function getLatestGifs (){
            return $http.get(CONFIG.apiEndpoint + '/latest');
        }

        function addTagToGif(gif_name, tag_id) {
            return $http.post(CONFIG.apiEndpoint + '/gifs/' + gif_name + '/tag', {tag: tag_id});
        }

        function removeTagFromGif(gif_name, tag_id) {
            return $http.delete(CONFIG.apiEndpoint + '/gifs/' + gif_name + '/tag/' + tag_id);
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