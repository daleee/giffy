'use strict';

angular.module('giffy')
    .factory('S3Service', ['$http', 'CONFIG', function($http, CONFIG) {
        $http.defaults.useXDomain = true;
        function getListOfGifs (page, numPerPage){
            var qs = '?';
            if(page) {
                qs += 'page=' + page + '&';
            }
            if(numPerPage) {
                qs += 'numperpage=' + numPerPage;
            }
            return $http.get(CONFIG.apiEndpoint + '/gifs' + qs);
        }

        function getGif(name) {
            return $http.get(CONFIG.apiEndpoint + '/gifs/' + name);
        }

        function getGifCount() {
            return $http.get(CONFIG.apiEndpoint + '/gifs/count');
        }

        function getGifsWithTag(tagName) {
            return $http.get(CONFIG.apiEndpoint + '/tags/' + tagName);
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
            getGifCount: getGifCount,
            getGifsWithTag: getGifsWithTag,
            getLatestGifs: getLatestGifs,
            addTagToGif: addTagToGif,
            removeTagFromGif: removeTagFromGif
        };
    }]);