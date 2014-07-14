var giffyApp = angular.module('giffyApp', []);

giffyApp.factory('S3Service', function($http) {
    function getListOfGifs (){
        return $http({method: 'GET', url: 'http://localhost:8080/'});
    }

    return {
        getListOfGifs: getListOfGifs
    };
});

function IndexCtrl($scope, S3Service) {
    $scope.numOfGifs = 0;
    $scope.gifList = [];

    var gifGetter = S3Service.getListOfGifs();
    gifGetter.
        success(function(data){
            $scope.numOfGifs = data.length;
            $scope.gifList = data;
        }).
        error(function(data, status, headers,config) {
            //TODO: remove
            console.log("ERROR: There was an error asking S3 for funnies: ");
            console.log(data);
            console.log(status);
            console.log(headers);
            console.log(config);
        });

    //TODO: turn into directive
    function s3_upload(){
        var s3upload = new S3Upload({
            file_dom_selector: 'gifUploadBtn',
            s3_sign_put_url: 'http://localhost:8080/sign_s3',
            onProgress: function(percent, message) {
                console.log('%s : %s', percent, message);
            },
            onFinishS3Put: function(public_url) {
                console.log('Done at %s', public_url);
            },
            onError: function(status) {
                console.log('ERROR: %s', status);
            }
        });
    }
    /*
     * Listen for file selection:
     */
    var fileEle = document.getElementById('gifUploadBtn');
    fileEle.addEventListener('change', s3_upload);
}