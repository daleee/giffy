'use strict';

angular.module('giffy')
    .directive('gifImageUploader', function($location, $http){
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

                var uploadToS3 = function(){
                    scope.$apply(function() {
                        scope.uploadInProgress = true;
                    });
                    var s3upload = new S3Upload({
                        file_dom_selector: 'hiddenFileInput',
                        s3_sign_put_url: 'http://localhost:8080/sign_s3',
                        onProgress:  onUploadProgress,
                        onFinishS3Put: onUploadFinish,
                        onError: onUploadError
                    });
                };
                var onUploadProgress = function(percent, message){
                    scope.$apply(function(){
                        console.log('%s : %s', percent, message);
                        scope.currentUploadPercent = percent;
                    });
                };
                var onUploadFinish = function(publuc_url) {
                    scope.$apply(function() {
                        //TODO: send user to image detail page
                        scope.errors = '';
                        scope.uploadInProgress = false;
                        scope.currentUploadPercent = 0;
                    });
                    $http.post('http://localhost:8080/gifs', {"url" : publuc_url})
                        .success(function (data, status, headers, config) {
                            console.log('it worked');
                        })
                        .error(function (data, status, headers, config) {
                            console.log('nope');

                        })
                };
                var onUploadError = function(status) {
                    scope.$apply(function() {
                        scope.errors = status;
                        scope.uploadInProgress = false;
                        scope.currentUploadPercent = 0;
                    });
                };

                hiddenFileElement.addEventListener('change', uploadToS3);
            }
        };
    });