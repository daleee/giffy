angular.module('giffy')
    .controller('GifCreatorCtrl', ['$scope', 'S3Service', 'CONFIG',
        function($scope, S3Service, CONFIG) {
            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            $scope.canvas = null;
            $scope.context = null;
            $scope.video = null;
            $scope.numOfFrames = 0;
            $scope.isInitialized = false;
            $scope.currentRenderState = null;
            $scope.finalGifURL = '';
            $scope.gifBlob = null;
            var gifjs = null,
                width = 320,
                height = 240;

            var constraints = {
                video: true,
                audio: false
            };

            // can't acess constants in a view so i gotta do this :\
            $scope.RENDER_STATE = {
                WAITING: 'render-state-waiting',
                RENDERING: 'render-state-rendering',
                COMPLETE: 'render-state-complete',
                FAILED: 'render-state-failed'
            };


            var successCallback = function(localMediaStream) {
                $scope.isInitialized = true;
                $scope.currentRenderState = $scope.RENDER_STATE.WAITING;
                $scope.canvas = document.getElementById('canvas');
                $scope.context = canvas.getContext('2d');
                $scope.video = document.getElementById('video');
                $scope.$apply();
                gifjs = new GIF({
                    workers: 2,
                    workerScript: 'lib/gifjs/gif.worker.js',
                    quality: 10
                });
                gifjs.on('finished', renderCallback);

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

            var renderCallback = function(blob) {
                $scope.gifBlob = blob;
                $scope.finalGifURL = URL.createObjectURL(blob);
                document.getElementById('finalGif').src = $scope.finalGifURL;
                document.getElementById('finalGifDownloadLink').href = $scope.finalGifURL;
                $scope.currentRenderState = $scope.RENDER_STATE.COMPLETE;
                $scope.$apply();
            };

            var stream = navigator.getUserMedia(constraints, successCallback, errorCallback);

            $scope.supportsGUM = function() {
                return !!navigator.getUserMedia;
            };

            $scope.captureFrame = function() {
                $scope.context.drawImage($scope.video, 0, 0, width, height);
                gifjs.addFrame($scope.canvas, {copy: true, delay: 100});
                $scope.numOfFrames += 1;
            };

            $scope.renderGIF = function() {
                gifjs.render();
                $scope.currentRenderState = $scope.RENDER_STATE.RENDERING;
            };

            function onUploadFinish(public_url, name) {
                S3Service.registerGifWithAPI(public_url, name);
            }

            $scope.uploadGIF = function() {
                var s3upload = new S3Upload({
                    blobMode: true,
                    blob: $scope.gifBlob,
                    s3_sign_put_url: CONFIG.apiEndpoint + '/sign_s3',
                    onFinishS3Put: onUploadFinish
                });
            };
        }]);
