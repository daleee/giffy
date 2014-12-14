angular.module('giffy')
    .constant('CONFIG', {
        apiEndpoint: 'http://localhost:8080/api'
    })
    .constant('AUTH_EVENTS', {
        loginSucess: 'auth-login-sucess',
        loginSession: 'auth-login-session'
    });
