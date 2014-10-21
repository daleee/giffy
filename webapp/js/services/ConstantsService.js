'use strict';

angular.module('giffy')
    .constant('CONFIG', {
        apiEndpoint: 'http://localhost:8080'
    })
    .constant('AUTH_EVENTS',
    {
        loginSuccess: 'auth-login-success',
        loginFailure: 'auth-login-failure',
        logoutSuccess: 'auth-logout-success'
    });
