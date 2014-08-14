var giffyApp = angular.module('giffyApp', []);

giffyApp.factory('S3Service', function($http) {
    function getListOfGifs (){
        return $http({method: 'GET', url: 'http://localhost:8080/'});
    }

    function registerGifWithAPI () {
        // TODO: make api call to register db entry for img
    }

    return {
        getListOfGifs: getListOfGifs,
        registerGifWithAPI: registerGifWithAPI
    };
});

function IndexCtrl($scope, S3Service) {
    $scope.gifList = [];
    $scope.errors = "";
    $scope.getNumOfGifsWithGrammar = function() {
        //TODO: enable localization
        if($scope.gifList.length === 1) {
            return "There is 1 GIF uploaded.";
        } else {
            return "There are " + $scope.gifList.length + " GIFs uploaded.";
        }
    };

    var gifGetter = S3Service.getListOfGifs();
    gifGetter.
        success(function(data){
            if($scope.errors) { // clear out any previous errors
                $scpoe.errors = "";
            }
            $scope.gifList = data;
        }).
        error(function(data, status, headers,config) {
            $scope.errors = "ERROR: The API is down! I repeat, the API is down!";
        });

    //TODO: turn into directive
    function s3_upload(){
        var s3upload = new S3Upload({
            file_dom_selector: 'hiddenFileInput',
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
    var button = document.getElementById('uploadBtn');
    var fileEle = document.getElementById('hiddenFileInput');
    fileEle.addEventListener('change', s3_upload);
    button.addEventListener('click', function(e) {
        if(fileEle) {
            e.preventDefault();
            fileEle.click();
        }
    })
}