'use strict';

angular.module('giffy')
    .factory('S3Service', ['$http', '$location', 'CONFIG', function($http, $location, CONFIG) {
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

        function registerGifWithAPI (public_url, name) {
            return $http.post(CONFIG.apiEndpoint + '/gifs', {"url" : public_url, "name" : name})
                .success(function (data, status, headers, config) {
                    $location.url('/gifs/' + name);
                })
                .error(function (data, status, headers, config) {
                    console.log(data);
                })
        }

        return {
            getListOfGifs: getListOfGifs,
            getGif: getGif,
            getGifCount: getGifCount,
            getGifsWithTag: getGifsWithTag,
            getLatestGifs: getLatestGifs,
            addTagToGif: addTagToGif,
            registerGifWithAPI: registerGifWithAPI,
            removeTagFromGif: removeTagFromGif
        };
    }]);