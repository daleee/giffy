angular.module('giffy')
    .controller('GifCreatorCtrl', ['$scope',
        function($scope) {
            $scope.canvas = null;
            $scope.context = null;
            $scope.video = null;

            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            var constraints = {
                video: true,
                audio: false
            };
            var imageArray = [];

            var successCallback = function(localMediaStream) {
                $scope.canvas = document.getElementById('canvas');
                $scope.context = canvas.getContext('2d');
                $scope.video = document.getElementById('video');

                if (navigator.mozGetUserMedia) {
                    $scope.video.mozSrcObject = localMediaStream;
                }
                else {
                    var url = window.URL || window.webkitURL;
                    $scope.video.src = url.createObjectURL(localMediaStream);
                }
                $scope.video.play();

            };

            var errorCallback = function(error) {
                if (error === 'PERMISSION_DENIED') {
                    console.log('permission denied');
                }
                else if (error === 'NOT_SUPPORTED_ERROR') {
                    console.log('audio/video not supported by browser');
                }
                else if (error === 'MANDATORY_UNSATISFIED_ERROR') {
                    console.log('no requested audio/video found');
                }
            };

            var stream = navigator.getUserMedia(constraints, successCallback, errorCallback);

            $scope.supportsGUM = function() {
                return !!navigator.getUserMedia;
            };

            $scope.captureFrame = function() {
                $scope.context.drawImage($scope.video, 0, 0);
                imageArray.push($scope.context.getImageData(0, 0, 320, 240));
                console.log(imageArray);
            }
        }]);
