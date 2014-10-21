'use strict';

angular.module('giffy')
    .directive('gifImageUploader', ['$location', '$http', 'CONFIG', function($location, $http, CONFIG){
        return {
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'views/gif_image_uploader.html',
            link: function(scope, element, attrs) {
                var hiddenFileElement = document.getElementById('hiddenFileInput');

                scope.errors = "";
                scope.currentUploadPercent = 0;
                scope.uploadInProgress = false;
                scope.onUploadBtnClick = function($event) {
                    if(hiddenFileElement){
                        hiddenFileElement.click();
                    }
                };

                var onUploadProgress = function(percent, message){
                    scope.$apply(function(){
                        scope.currentUploadPercent = percent;
                    });
                };
                var onUploadFinish = function(public_url, name) {
                    scope.$apply(function() {
                        scope.errors = '';
                        scope.uploadInProgress = false;
                        scope.currentUploadPercent = 0;
                    });
                    //TODO: move to S3Service (rename to ImageService?)
                    $http.post(CONFIG.apiEndpoint + '/gifs', {"url" : public_url, "name" : name})
                        .success(function (data, status, headers, config) {
                            $location.url('/gifs/' + name);
                        })
                        .error(function (data, status, headers, config) {
                            console.log(data);
                        })
                };
                var onUploadError = function(status) {
                    scope.$apply(function() {
                        scope.errors = status;
                        scope.uploadInProgress = false;
                        scope.currentUploadPercent = 0;
                    });
                };

                var uploadToS3 = function(){
                    scope.$apply(function() {
                        scope.uploadInProgress = true;
                    });
                    //TODO: take hardcoded url out
                    var s3upload = new S3Upload({
                        file_dom_selector: 'hiddenFileInput',
                        s3_sign_put_url: CONFIG.apiEndpoint + '/sign_s3',
                        onProgress:  onUploadProgress,
                        onFinishS3Put: onUploadFinish,
                        onError: onUploadError
                    });
                };
                hiddenFileElement.addEventListener('change', uploadToS3);
            }
        };
    }]);