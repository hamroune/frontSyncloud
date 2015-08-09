(function () {

    'use strict';

    angular
        .module('app.core')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider', '$compileProvider'];

    function config($stateProvider, $urlRouterProvider, $compileProvider) {

        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile):|data:image\//);

        $stateProvider
          .state('login', {
              url: "/login",
              templateUrl: "module/login/login.html",
              controller: 'LoginCtrl'
          })
          .state('home', {
                url: "/home",
                templateUrl: "module/dashboard/dashboard.html",
                controller: 'DashboardCtrl'
            }
          );


        $urlRouterProvider.otherwise("/login");
    }

})();

