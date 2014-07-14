var giffyApp = angular.module('giffyApp', []);

giffyApp.factory('S3Service', function() {
    var numOfGifs = 0;
    return {
        numOfGifs: numOfGifs
    };
});

function IndexCtrl($scope, S3Service) {
    var numOfGifs = S3Service.numOfGifs;

    $scope.getNumOfGifs = function() {
        return numOfGifs;
    };

    function s3_upload(){
        var s3upload = new S3Upload({
            file_dom_selector: 'gifUploadBtn',
            s3_sign_put_url: '/sign_s3',
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